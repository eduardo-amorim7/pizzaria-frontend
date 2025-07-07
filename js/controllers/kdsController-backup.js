angular.module('pizzariaApp').controller('KdsController', ['$scope', '$interval', 'ApiService', 'SocketService', 'AuthService', 'ToastService',
function($scope, $interval, ApiService, SocketService, AuthService, ToastService) {
    
    $scope.pedidos = {
        aguardando_preparo: [],
        em_preparo: [],
        pronto: [],
        despachado: []
    };
    
    $scope.filtros = {
        setor: 'todos',
        mostrar_entregues: false
    };
    
    $scope.setores = [
        { value: 'todos', label: 'Todos os Setores' },
        { value: 'preparo', label: 'Preparo' },
        { value: 'expedição', label: 'Expedição' },
        { value: 'entrega', label: 'Entrega' }
    ];
    
    $scope.isLoading = false;
    $scope.alertaSonoro = true;
    $scope.tempoLimiteAtencao = 20; // minutos
    $scope.tempoLimiteAtraso = 30; // minutos
    
    let intervaloPedidos = null;
    let audioAlerta = null;

    $scope.init = function() {
        $scope.configurarAudio();
        $scope.carregarPedidos();
        $scope.iniciarAtualizacaoAutomatica();
        $scope.configurarSocketEvents();
        
        // Entrar na sala do setor selecionado
        SocketService.joinSetor($scope.filtros.setor);
    };

    $scope.configurarAudio = function() {
        // Criar elemento de áudio para alertas
        audioAlerta = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    };

    $scope.carregarPedidos = function() {
        $scope.isLoading = true;
        
        ApiService.getPedidosKds($scope.filtros.setor)
            .then(function(response) {
                $scope.organizarPedidos(response.pedidos);
                $scope.verificarPedidosAtrasados();
            })
            .catch(function(error) {
                ToastService.error('Erro ao carregar pedidos: ' + (error.message || 'Erro desconhecido'));
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    };

    $scope.organizarPedidos = function(pedidos) {
        // Limpar arrays
        $scope.pedidos.aguardando_preparo = [];
        $scope.pedidos.em_preparo = [];
        $scope.pedidos.pronto = [];
        $scope.pedidos.despachado = [];
        
        // Organizar pedidos por status
        pedidos.forEach(function(pedido) {
            if ($scope.pedidos[pedido.status]) {
                $scope.pedidos[pedido.status].push(pedido);
            }
        });
    };

    $scope.verificarPedidosAtrasados = function() {
        Object.keys($scope.pedidos).forEach(function(status) {
            $scope.pedidos[status].forEach(function(pedido) {
                const tempoDecorrido = pedido.tempo_decorrido_minutos || 0;
                
                if (tempoDecorrido > $scope.tempoLimiteAtraso) {
                    pedido.atrasado = true;
                    pedido.classeTempoDecorrido = 'tempo-atrasado';
                } else if (tempoDecorrido > $scope.tempoLimiteAtencao) {
                    pedido.atencao = true;
                    pedido.classeTempoDecorrido = 'tempo-atencao';
                } else {
                    pedido.classeTempoDecorrido = 'tempo-normal';
                }
            });
        });
    };

    $scope.atualizarStatusPedido = function(pedido, novoStatus) {
        if (!$scope.podeAtualizarStatus(novoStatus)) {
            ToastService.warning('Você não tem permissão para esta ação');
            return;
        }

        ApiService.atualizarStatusPedido(pedido._id, novoStatus)
            .then(function(response) {
                ToastService.success('Status atualizado com sucesso');
                
                // Emitir evento via socket
                SocketService.emitPedidoStatusUpdate({
                    pedido_id: pedido._id,
                    status_anterior: pedido.status,
                    status_novo: novoStatus,
                    setor: $scope.filtros.setor
                });
                
                // Recarregar pedidos
                $scope.carregarPedidos();
            })
            .catch(function(error) {
                ToastService.error('Erro ao atualizar status: ' + (error.message || 'Erro desconhecido'));
            });
    };

    $scope.podeAtualizarStatus = function(status) {
        if (status === 'em_preparo' || status === 'pronto') {
            return AuthService.canUpdatePreparationStatus();
        }
        if (status === 'despachado' || status === 'entregue') {
            return AuthService.canUpdateDeliveryStatus();
        }
        return true;
    };

    $scope.getProximoStatus = function(statusAtual) {
        const fluxoStatus = {
            'aguardando_preparo': 'em_preparo',
            'em_preparo': 'pronto',
            'pronto': 'despachado',
            'despachado': 'entregue'
        };
        return fluxoStatus[statusAtual];
    };

    $scope.getTextoProximoStatus = function(statusAtual) {
        const textos = {
            'aguardando_preparo': 'Iniciar Preparo',
            'em_preparo': 'Marcar Pronto',
            'pronto': 'Despachar',
            'despachado': 'Entregar'
        };
        return textos[statusAtual] || 'Avançar';
    };

    $scope.getClasseBotaoStatus = function(statusAtual) {
        const classes = {
            'aguardando_preparo': 'btn-warning',
            'em_preparo': 'btn-success',
            'pronto': 'btn-primary',
            'despachado': 'btn-info'
        };
        return classes[statusAtual] || 'btn-secondary';
    };

    $scope.alterarSetor = function() {
        // Sair da sala anterior
        SocketService.leaveSetor($scope.filtros.setor);
        
        // Entrar na nova sala
        SocketService.joinSetor($scope.filtros.setor);
        
        // Recarregar pedidos
        $scope.carregarPedidos();
    };

    $scope.toggleAlertaSonoro = function() {
        $scope.alertaSonoro = !$scope.alertaSonoro;
        ToastService.info('Alerta sonoro ' + ($scope.alertaSonoro ? 'ativado' : 'desativado'));
    };

    $scope.tocarAlerta = function() {
        if ($scope.alertaSonoro && audioAlerta) {
            audioAlerta.play().catch(function(error) {
                console.log('Erro ao tocar alerta:', error);
            });
        }
    };

    $scope.iniciarAtualizacaoAutomatica = function() {
        // Atualizar a cada 30 segundos
        intervaloPedidos = $interval(function() {
            $scope.carregarPedidos();
        }, 30000);
    };

    $scope.pararAtualizacaoAutomatica = function() {
        if (intervaloPedidos) {
            $interval.cancel(intervaloPedidos);
            intervaloPedidos = null;
        }
    };

    $scope.configurarSocketEvents = function() {
        // Novo pedido
        $scope.$on('pedido:novo', function(event, pedido) {
            ToastService.info('Novo pedido recebido: #' + pedido.numero);
            $scope.tocarAlerta();
            $scope.carregarPedidos();
        });

        // Pedido atualizado
        $scope.$on('pedido:atualizado', function(event, data) {
            $scope.carregarPedidos();
        });

        // Alerta de novo pedido
        $scope.$on('pedido:alerta', function(event, pedido) {
            $scope.tocarAlerta();
        });

        // Pedido atrasado
        $scope.$on('pedido:atrasado', function(event, pedido) {
            ToastService.warning('Pedido #' + pedido.numero + ' está atrasado!');
            $scope.tocarAlerta();
        });
    };

    $scope.formatarTempo = function(minutos) {
        if (!minutos && minutos !== 0) return '0min';
        
        if (minutos < 60) {
            return minutos + 'min';
        } else {
            const horas = Math.floor(minutos / 60);
            const mins = minutos % 60;
            return horas + 'h' + (mins > 0 ? ' ' + mins + 'min' : '');
        }
    };

    $scope.getCorStatus = function(status) {
        const cores = {
            'aguardando_preparo': '#ffc107',
            'em_preparo': '#fd7e14',
            'pronto': '#28a745',
            'despachado': '#007bff'
        };
        return cores[status] || '#6c757d';
    };

    // Cleanup ao sair da página
    $scope.$on('$destroy', function() {
        $scope.pararAtualizacaoAutomatica();
        SocketService.leaveSetor($scope.filtros.setor);
    });

    $scope.init();
}]);

