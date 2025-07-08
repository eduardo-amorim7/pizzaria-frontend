angular.module('pizzariaApp').controller('KdsController', ['$scope', '$interval', '$location', 'ApiService', 'SocketService', 'ToastService', function($scope, $interval, $location, ApiService, SocketService, ToastService) {
    
    // Estado do KDS
    $scope.pedidos = [];
    $scope.currentTime = new Date();
    
    $scope.filtros = {
        tipo: null // null = todos, 'entrega', 'retirada', 'consumo_local', 'mesa'
    };

    // Estado do modal
    $scope.showModalAcoes = false;
    $scope.pedidoSelecionado = null;
    $scope.mostrarHistorico = false;

    // Atualizar relógio
    $scope.atualizarRelogio = function() {
        $scope.currentTime = new Date();
    };

    // Carregar pedidos
    $scope.carregarPedidos = function() {
        ApiService.get('/pedidos')
            .then(function(response) {
                if (response.success) {
                    $scope.pedidos = response.pedidos || [];
                } else {
                    console.error('Erro ao carregar pedidos:', response.message);
                }
            })
            .catch(function(error) {
                console.error('Erro ao carregar pedidos:', error);
                ToastService.error('Erro ao carregar pedidos');
            });
    };

    // Obter pedidos por status
    $scope.getPedidosPorStatus = function(status) {
        if (!$scope.pedidos) return [];
        
        let pedidosFiltrados = $scope.pedidos.filter(function(pedido) {
            return pedido.status === status;
        });

        // Aplicar filtro de tipo se selecionado
        if ($scope.filtros.tipo) {
            pedidosFiltrados = pedidosFiltrados.filter(function(pedido) {
                return pedido.tipo === $scope.filtros.tipo;
            });
        }

        return pedidosFiltrados;
    };

    // Obter pedidos agendados
    $scope.getPedidosAgendados = function() {
        if (!$scope.pedidos) return [];
        
        let pedidosAgendados = $scope.pedidos.filter(function(pedido) {
            return pedido.horario_agendado && new Date(pedido.horario_agendado) > new Date();
        });

        // Aplicar filtro de tipo se selecionado
        if ($scope.filtros.tipo) {
            pedidosAgendados = pedidosAgendados.filter(function(pedido) {
                return pedido.tipo === $scope.filtros.tipo;
            });
        }

        return pedidosAgendados;
    };

    // Alternar filtro
    $scope.toggleFiltro = function(campo, valor) {
        if ($scope.filtros[campo] === valor) {
            $scope.filtros[campo] = null; // Desativar filtro
        } else {
            $scope.filtros[campo] = valor; // Ativar filtro
        }
    };

    // Calcular tempo decorrido
    $scope.calcularTempoDecorrido = function(pedido) {
        if (!pedido || !pedido.data_criacao) return 0;
        
        const inicio = new Date(pedido.data_criacao);
        const agora = new Date();
        const diferenca = Math.floor((agora - inicio) / (1000 * 60)); // em minutos
        
        return diferenca;
    };

    // Formatar tempo
    $scope.formatarTempo = function(minutos) {
        if (!minutos && minutos !== 0) return '';
        
        if (minutos < 60) {
            return minutos + 'min';
        } else {
            const horas = Math.floor(minutos / 60);
            const mins = minutos % 60;
            return horas + 'h' + (mins > 0 ? ' ' + mins + 'min' : '');
        }
    };

    // Verificar se pedido está urgente/atrasado
    $scope.isUrgent = function(pedido) {
        const tempoDecorrido = $scope.calcularTempoDecorrido(pedido);
        return tempoDecorrido > 30; // Considerar urgente após 30 minutos
    };

    // Obter ícone do tipo
    $scope.getTypeIcon = function(tipo) {
        const icones = {
            'entrega': 'fa-motorcycle',
            'retirada': 'fa-walking',
            'consumo_local': 'fa-utensils',
            'mesa': 'fa-chair'
        };
        return icones[tipo] || 'fa-box';
    };

    // Navegação para novo pedido
    $scope.irParaNovoPedido = function() {
        $location.path('/pedidos/novo');
    };

    // Abrir modal de ações
    $scope.abrirModalAcoes = function(pedido) {
        $scope.pedidoSelecionado = pedido;
        $scope.showModalAcoes = true;
        $scope.mostrarHistorico = false;
    };

    // Fechar modal de ações
    $scope.fecharModalAcoes = function() {
        $scope.showModalAcoes = false;
        $scope.pedidoSelecionado = null;
        $scope.mostrarHistorico = false;
    };

    // Atualizar status do pedido
    $scope.atualizarStatus = function(pedido, novoStatus) {
        const dados = {
            status: novoStatus
        };

        ApiService.put('/pedidos/' + pedido._id, dados)
            .then(function(response) {
                if (response.success) {
                    ToastService.success('Status do pedido atualizado com sucesso');
                    $scope.carregarPedidos();
                } else {
                    ToastService.error('Erro ao atualizar status: ' + response.message);
                }
            })
            .catch(function(error) {
                console.error('Erro ao atualizar status:', error);
                ToastService.error('Erro ao atualizar status do pedido');
            });
    };

    // Atualizar status via modal
    $scope.atualizarStatusModal = function(novoStatus) {
        if ($scope.pedidoSelecionado) {
            $scope.atualizarStatus($scope.pedidoSelecionado, novoStatus);
            $scope.fecharModalAcoes();
        }
    };

    // Cancelar pedido
    $scope.cancelarPedido = function(pedido) {
        if (confirm('Tem certeza que deseja cancelar este pedido?')) {
            $scope.atualizarStatus(pedido, 'cancelado');
        }
    };

    // Cancelar pedido via modal
    $scope.cancelarPedidoModal = function() {
        if ($scope.pedidoSelecionado && confirm('Tem certeza que deseja cancelar este pedido?')) {
            $scope.atualizarStatus($scope.pedidoSelecionado, 'cancelado');
            $scope.fecharModalAcoes();
        }
    };

    // Voltar status
    $scope.voltarStatus = function(statusAnterior) {
        if ($scope.pedidoSelecionado) {
            $scope.atualizarStatus($scope.pedidoSelecionado, statusAnterior);
            $scope.fecharModalAcoes();
        }
    };

    // Iniciar pedido agendado
    $scope.iniciarPedidoAgendado = function(pedido) {
        $scope.atualizarStatus(pedido, 'aguardando_preparo');
    };

    // Atualizar pedidos manualmente
    $scope.atualizarPedidos = function() {
        $scope.carregarPedidos();
        ToastService.success('Pedidos atualizados');
    };

    // Funções do modal (placeholder - implementar conforme necessário)
    $scope.editarPedido = function() {
        ToastService.info('Funcionalidade de edição em desenvolvimento');
        $scope.fecharModalAcoes();
    };

    $scope.pausarPedido = function() {
        ToastService.info('Funcionalidade de pausa em desenvolvimento');
        $scope.fecharModalAcoes();
    };

    $scope.imprimirComanda = function() {
        ToastService.info('Funcionalidade de impressão em desenvolvimento');
        $scope.fecharModalAcoes();
    };

    $scope.duplicarPedido = function() {
        ToastService.info('Funcionalidade de duplicação em desenvolvimento');
        $scope.fecharModalAcoes();
    };

    $scope.verHistorico = function() {
        $scope.mostrarHistorico = !$scope.mostrarHistorico;
        // Aqui você pode carregar o histórico do pedido se necessário
    };

    // Socket.IO para atualizações em tempo real
    $scope.iniciarSocket = function() {
        SocketService.on('novo_pedido', function(pedido) {
            $scope.$apply(function() {
                $scope.carregarPedidos();
                ToastService.success('Novo pedido recebido: #' + pedido.numero);
            });
        });

        SocketService.on('pedido_atualizado', function(pedido) {
            $scope.$apply(function() {
                $scope.carregarPedidos();
            });
        });
    };

    // Atualização automática
    $scope.iniciarAtualizacaoAutomatica = function() {
        // Atualizar relógio a cada segundo
        $scope.relogioInterval = $interval(function() {
            $scope.atualizarRelogio();
        }, 1000);

        // Atualizar pedidos a cada 30 segundos
        $scope.pedidosInterval = $interval(function() {
            $scope.carregarPedidos();
        }, 30000);
    };

    // Inicialização
    $scope.init = function() {
        $scope.carregarPedidos();
        $scope.iniciarAtualizacaoAutomatica();
        $scope.iniciarSocket();
    };

    // Cleanup
    $scope.$on('$destroy', function() {
        if ($scope.relogioInterval) {
            $interval.cancel($scope.relogioInterval);
        }
        if ($scope.pedidosInterval) {
            $interval.cancel($scope.pedidosInterval);
        }
    });

    // Inicializar
    $scope.init();
}]);

