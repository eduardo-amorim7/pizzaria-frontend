angular.module('pizzariaApp').controller('KdsController', ['$scope', '$interval', 'ApiService', 'SocketService', 'ToastService', '$window',
function($scope, $interval, ApiService, SocketService, ToastService, $window) {
    
    // Dados do escopo
    $scope.pedidos = [];
    $scope.currentTime = new Date();
    $scope.filtros = {
        tipo: '',
        canal: '',
        status: ''
    };
    
    // Configurações
    $scope.tempoLimiteUrgente = 30; // minutos
    $scope.autoRefreshInterval = 30000; // 30 segundos
    
    // Inicialização
    $scope.init = function() {
        $scope.carregarPedidos();
        $scope.conectarSocket();
        $scope.iniciarRelogio();
        $scope.iniciarAutoRefresh();
    };

    // Carregar pedidos da API
    $scope.carregarPedidos = function() {
        const filtros = {
            ativo: true,
            status: ['aguardando_preparo', 'em_preparo', 'pronto', 'despachado']
        };
        
        // Aplicar filtros se definidos
        if ($scope.filtros.tipo) {
            filtros.tipo = $scope.filtros.tipo;
        }
        if ($scope.filtros.canal) {
            filtros.canal = $scope.filtros.canal;
        }
        
        ApiService.get('/pedidos', filtros)
            .then(function(response) {
                $scope.pedidos = response.pedidos || [];
                console.log('Pedidos carregados:', $scope.pedidos.length);
            })
            .catch(function(error) {
                console.error('Erro ao carregar pedidos:', error);
                ToastService.error('Erro ao carregar pedidos');
            });
    };

    // Conectar ao Socket.IO para atualizações em tempo real
    $scope.conectarSocket = function() {
        SocketService.connect();
        
        // Escutar eventos de novos pedidos
        SocketService.on('novo_pedido', function(pedido) {
            $scope.$apply(function() {
                $scope.pedidos.unshift(pedido);
                ToastService.success('Novo pedido #' + pedido.numero);
                $scope.reproduzirSomNotificacao();
            });
        });
        
        // Escutar atualizações de status
        SocketService.on('status_atualizado', function(data) {
            $scope.$apply(function() {
                const index = $scope.pedidos.findIndex(p => p._id === data.pedidoId);
                if (index !== -1) {
                    $scope.pedidos[index] = data.pedido;
                }
            });
        });
        
        // Escutar pedidos cancelados
        SocketService.on('pedido_cancelado', function(data) {
            $scope.$apply(function() {
                $scope.pedidos = $scope.pedidos.filter(p => p._id !== data.pedidoId);
            });
        });
    };

    // Obter pedidos por status
    $scope.getPedidosPorStatus = function(status) {
        return $scope.pedidos.filter(function(pedido) {
            const matchStatus = pedido.status === status;
            const matchTipo = !$scope.filtros.tipo || pedido.tipo === $scope.filtros.tipo;
            const matchCanal = !$scope.filtros.canal || pedido.canal === $scope.filtros.canal;
            
            return matchStatus && matchTipo && matchCanal;
        });
    };

    // Obter pedidos agendados (simulação - pode ser implementado no backend)
    $scope.getPedidosAgendados = function() {
        // Por enquanto, retorna array vazio
        // Pode ser implementado para pedidos com horário_agendado
        return $scope.pedidos.filter(function(pedido) {
            return pedido.horario_agendado && new Date(pedido.horario_agendado) > new Date();
        });
    };

    // Atualizar status do pedido
    $scope.atualizarStatus = function(pedido, novoStatus) {
        ApiService.put('/pedidos/' + pedido._id + '/status', { status: novoStatus })
            .then(function(response) {
                pedido.status = novoStatus;
                
                // Atualizar tempos
                const agora = new Date();
                if (novoStatus === 'em_preparo' && !pedido.tempos.preparo_iniciado) {
                    pedido.tempos.preparo_iniciado = agora;
                } else if (novoStatus === 'pronto' && !pedido.tempos.preparo_concluido) {
                    pedido.tempos.preparo_concluido = agora;
                } else if (novoStatus === 'despachado' && !pedido.tempos.despachado) {
                    pedido.tempos.despachado = agora;
                } else if (novoStatus === 'entregue' && !pedido.tempos.entregue) {
                    pedido.tempos.entregue = agora;
                }
                
                ToastService.success('Status atualizado para: ' + $scope.getStatusText(novoStatus));
            })
            .catch(function(error) {
                console.error('Erro ao atualizar status:', error);
                ToastService.error('Erro ao atualizar status');
            });
    };

    // Cancelar pedido
    $scope.cancelarPedido = function(pedido) {
        if (!confirm('Tem certeza que deseja cancelar o pedido #' + pedido.numero + '?')) {
            return;
        }
        
        ApiService.delete('/pedidos/' + pedido._id)
            .then(function(response) {
                $scope.pedidos = $scope.pedidos.filter(p => p._id !== pedido._id);
                ToastService.success('Pedido cancelado com sucesso');
            })
            .catch(function(error) {
                console.error('Erro ao cancelar pedido:', error);
                ToastService.error('Erro ao cancelar pedido');
            });
    };

    // Iniciar pedido agendado
    $scope.iniciarPedidoAgendado = function(pedido) {
        $scope.atualizarStatus(pedido, 'aguardando_preparo');
    };

    // Toggle de filtros
    $scope.toggleFiltro = function(tipo, valor) {
        if ($scope.filtros[tipo] === valor) {
            $scope.filtros[tipo] = '';
        } else {
            $scope.filtros[tipo] = valor;
        }
        $scope.carregarPedidos();
    };

    // Calcular tempo decorrido em minutos
    $scope.calcularTempoDecorrido = function(pedido) {
        if (!pedido.tempos || !pedido.tempos.pedido_criado) {
            return 0;
        }
        
        const inicio = new Date(pedido.tempos.pedido_criado);
        const agora = new Date();
        const diffMinutos = Math.round((agora - inicio) / (1000 * 60));
        
        return Math.max(0, diffMinutos);
    };

    // Formatar tempo para exibição
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

    // Verificar se pedido está atrasado/urgente
    $scope.isUrgent = function(pedido) {
        const tempoDecorrido = $scope.calcularTempoDecorrido(pedido);
        return tempoDecorrido > $scope.tempoLimiteUrgente;
    };

    // Obter ícone do tipo de pedido
    $scope.getTypeIcon = function(tipo) {
        const icons = {
            'entrega': 'fa-motorcycle',
            'retirada': 'fa-walking',
            'consumo_local': 'fa-utensils',
            'mesa': 'fa-chair'
        };
        return icons[tipo] || 'fa-question';
    };

    // Obter texto do status
    $scope.getStatusText = function(status) {
        const texts = {
            'aguardando_preparo': 'Aguardando Preparo',
            'em_preparo': 'Em Preparo',
            'pronto': 'Pronto',
            'despachado': 'Despachado',
            'entregue': 'Entregue',
            'cancelado': 'Cancelado'
        };
        return texts[status] || status;
    };

    // Novo pedido
    $scope.novoPedido = function() {
        $window.location.href = '#!/pedidos/novo';
    };

    // Atualizar pedidos manualmente
    $scope.atualizarPedidos = function() {
        $scope.carregarPedidos();
        ToastService.info('Pedidos atualizados');
    };

    // Reproduzir som de notificação
    $scope.reproduzirSomNotificacao = function() {
        try {
            // Criar um beep simples usando Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Não foi possível reproduzir som de notificação');
        }
    };

    // Iniciar relógio
    $scope.iniciarRelogio = function() {
        $interval(function() {
            $scope.currentTime = new Date();
        }, 1000);
    };

    // Auto-refresh
    $scope.iniciarAutoRefresh = function() {
        $interval(function() {
            $scope.carregarPedidos();
        }, $scope.autoRefreshInterval);
    };

    // Cleanup ao sair da tela
    $scope.$on('$destroy', function() {
        SocketService.disconnect();
    });

    // Inicializar
    $scope.init();
}]);

// Filtros personalizados
angular.module('pizzariaApp').filter('tipoText', function() {
    return function(tipo) {
        const texts = {
            'entrega': 'Entrega',
            'retirada': 'Retirada',
            'consumo_local': 'Balcão',
            'mesa': 'Mesa'
        };
        return texts[tipo] || tipo;
    };
});

angular.module('pizzariaApp').filter('canalText', function() {
    return function(canal) {
        const texts = {
            'balcao': 'Balcão',
            'telefone': 'Telefone',
            'ifood': 'iFood',
            'site': 'Site',
            'whatsapp': 'WhatsApp'
        };
        return texts[canal] || canal;
    };
});

