angular.module('pizzariaApp').controller('MainDashboardController', ['$scope', '$interval', '$location', 'ApiService', 'ToastService', 'ModalService', function($scope, $interval, $location, ApiService, ToastService, ModalService) {
    
    // Estado inicial
    $scope.orders = [];
    $scope.currentTime = new Date();
    $scope.activeFilter = 'entrega';
    
    // Configurações do sistema
    $scope.siteAberto = true;
    $scope.caixaAberto = true;
    $scope.caixaDetalhado = false;
    $scope.retiradaConfigurada = false;

    // Dados de exemplo para demonstração
    $scope.sampleOrders = [
        {
            numero: '100',
            status: 'novo',
            tipo: 'entrega',
            canal: 'balcao',
            data_criacao: new Date(Date.now() - 15 * 60000), // 15 minutos atrás
            cliente: {
                nome: 'Marcos',
                telefone: '(48) 9 9999-2136',
                endereco: {
                    rua: 'Rua das Flores',
                    numero: '123',
                    bairro: 'Centro'
                }
            },
            itens: [
                {
                    quantidade: 1,
                    produto: { nome: 'Pizza' },
                    tamanho: 'Gigante',
                    sabores: ['Frango com catupiry'],
                    borda: 'Sem borda'
                },
                {
                    quantidade: 1,
                    produto: { nome: 'Pizza' },
                    tamanho: 'Broto Doce',
                    sabores: ['Dois amores'],
                    borda: null
                }
            ]
        },
        {
            numero: '101',
            status: 'novo',
            tipo: 'entrega',
            canal: 'ifood',
            data_criacao: new Date(Date.now() - 10 * 60000), // 10 minutos atrás
            cliente: {
                nome: 'Lucas',
                telefone: '(48) 9 9919-3998',
                endereco: {
                    rua: 'Av. Principal',
                    numero: '456',
                    bairro: 'Bairro Novo'
                }
            },
            itens: [
                {
                    quantidade: 1,
                    produto: { nome: 'Pizza' },
                    tamanho: 'Gigante',
                    sabores: ['Calabresa', 'Quatro queijos', 'Bacon'],
                    borda: 'Borda Cheddar'
                }
            ]
        },
        {
            numero: '097',
            status: 'processando',
            tipo: 'entrega',
            canal: 'ifood',
            data_criacao: new Date(Date.now() - 30 * 60000), // 30 minutos atrás
            cliente: {
                nome: 'Ana',
                telefone: '(48) 9 6821-4829',
                endereco: {
                    rua: 'Rua das Palmeiras',
                    numero: '789',
                    bairro: 'Campinas'
                }
            },
            itens: [
                {
                    quantidade: 1,
                    produto: { nome: 'Pizza' },
                    tamanho: 'Gigante',
                    sabores: ['Margherita'],
                    borda: null
                }
            ]
        },
        {
            numero: '102',
            status: 'processando',
            tipo: 'entrega',
            canal: 'site',
            data_criacao: new Date(Date.now() - 11 * 60000), // 11 minutos atrás
            cliente: {
                nome: 'Jonathas teste',
                telefone: '(48) 9 9191-4708',
                endereco: {
                    rua: 'Rua dos Girassóis',
                    numero: '321',
                    bairro: 'Barreiros'
                }
            },
            itens: [
                {
                    quantidade: 1,
                    produto: { nome: 'Pizza' },
                    tamanho: 'Gigante',
                    sabores: ['Calabresa', 'Quatro queijos', 'Bacon'],
                    borda: 'Borda Cheddar'
                }
            ]
        },
        {
            numero: '098',
            status: 'pronto',
            tipo: 'retirada',
            canal: 'telefone',
            data_criacao: new Date(Date.now() - 15 * 60000), // 15 minutos atrás
            cliente: {
                nome: 'Jessica',
                telefone: '(48) 9 8447-2336'
            },
            itens: [
                {
                    quantidade: 1,
                    produto: { nome: 'Pizza' },
                    tamanho: 'Gigante',
                    sabores: ['Frango supremo', 'Calabresa'],
                    borda: 'Borda Cheddar'
                }
            ]
        },
        {
            numero: '099',
            status: 'pronto',
            tipo: 'entrega',
            canal: 'ifood',
            data_criacao: new Date(Date.now() - 15 * 60000), // 15 minutos atrás
            cliente: {
                nome: 'Marcelo',
                telefone: '(48) 9 8651-2196',
                endereco: {
                    rua: 'Rua das Acácias',
                    numero: '654',
                    bairro: 'Campinas'
                }
            },
            itens: [
                {
                    quantidade: 1,
                    produto: { nome: 'Pizza' },
                    tamanho: 'Broto Doce',
                    sabores: ['Sensação'],
                    borda: null
                }
            ]
        },
        {
            numero: '18:00',
            status: 'agendado',
            tipo: 'entrega',
            canal: 'telefone',
            horario_agendado: new Date(Date.now() + 4 * 60 * 60000), // 4 horas no futuro
            cliente: {
                nome: 'Lucas',
                telefone: '(48) 9 9747-3998',
                endereco: {
                    rua: 'Rua das Margaridas',
                    numero: '741',
                    bairro: 'Barreiros'
                }
            },
            itens: [
                {
                    quantidade: 1,
                    produto: { nome: 'Pizza' },
                    tamanho: 'Gigante',
                    sabores: ['Calabresa', 'Quatro queijos', 'Bacon'],
                    borda: 'Borda Cheddar'
                }
            ]
        }
    ];

    // Inicializar com dados de exemplo
    $scope.orders = $scope.sampleOrders;

    // Atualizar relógio
    $scope.updateClock = function() {
        $scope.currentTime = new Date();
    };

    // Filtrar pedidos por status
    $scope.getOrdersByStatus = function(status) {
        if (!$scope.orders) return [];
        
        let filteredOrders = $scope.orders.filter(function(order) {
            return order.status === status;
        });

        // Aplicar filtro de tipo se ativo
        if ($scope.activeFilter && $scope.activeFilter !== 'all') {
            filteredOrders = filteredOrders.filter(function(order) {
                return order.tipo === $scope.activeFilter;
            });
        }

        return filteredOrders;
    };

    // Definir filtro ativo
    $scope.setFilter = function(filter) {
        if ($scope.activeFilter === filter) {
            $scope.activeFilter = null; // Desativar filtro se já estiver ativo
        } else {
            $scope.activeFilter = filter;
        }
    };

    // Calcular tempo decorrido
    $scope.getElapsedTime = function(startTime) {
        if (!startTime) return 0;
        
        const now = new Date();
        const start = new Date(startTime);
        const diffMinutes = Math.floor((now - start) / (1000 * 60));
        
        return diffMinutes;
    };

    // Verificar se pedido está urgente
    $scope.isUrgent = function(order) {
        const elapsed = $scope.getElapsedTime(order.data_criacao);
        return elapsed > 30; // Considerar urgente após 30 minutos
    };

    // Obter ícone do tipo
    $scope.getTypeIcon = function(tipo) {
        const icons = {
            'entrega': 'fa-motorcycle',
            'retirada': 'fa-walking',
            'balcao': 'fa-utensils',
            'mesa': 'fa-chair'
        };
        return icons[tipo] || 'fa-box';
    };

    // Obter label do tipo
    $scope.getTypeLabel = function(tipo) {
        const labels = {
            'entrega': 'Entrega',
            'retirada': 'Retirada',
            'balcao': 'Balcão',
            'mesa': 'Mesa'
        };
        return labels[tipo] || tipo;
    };

    // Ações dos pedidos
    $scope.selectOrder = function(order) {
        console.log('Pedido selecionado:', order);
        ToastService.info('Pedido #' + order.numero + ' selecionado');
    };

    $scope.startOrder = function(order, event) {
        event.stopPropagation();
        order.status = 'processando';
        ToastService.success('Pedido #' + order.numero + ' iniciado');
    };

    $scope.finishOrder = function(order, event) {
        event.stopPropagation();
        
        ModalService.confirmFinish(order.numero).then(function(confirmed) {
            if (confirmed) {
                order.status = 'pronto';
                ToastService.success('Pedido #' + order.numero + ' finalizado');
            }
        });
    };

    $scope.cancelOrder = function(order, event) {
        event.stopPropagation();
        
        ModalService.confirmDelete('o pedido #' + order.numero).then(function(confirmed) {
            if (confirmed) {
                order.status = 'cancelado';
                ToastService.warning('Pedido #' + order.numero + ' cancelado');
            }
        });
    };

    $scope.deliverOrder = function(order, event) {
        event.stopPropagation();
        
        ModalService.confirmDeliver(order.numero).then(function(confirmed) {
            if (confirmed) {
                order.status = 'entregue';
                ToastService.success('Pedido #' + order.numero + ' entregue');
            }
        });
    };

    $scope.dispatchOrder = function(order, event) {
        event.stopPropagation();
        
        ModalService.confirmDispatch(order.numero).then(function(confirmed) {
            if (confirmed) {
                order.status = 'despachado';
                ToastService.success('Pedido #' + order.numero + ' despachado');
            }
        });
    };

    $scope.startScheduledOrder = function(order, event) {
        event.stopPropagation();
        order.status = 'novo';
        ToastService.success('Pedido agendado #' + order.numero + ' iniciado');
    };

    // Ações do header
    $scope.toggleMenu = function() {
        ToastService.info('Menu toggle');
    };

    $scope.closeTab = function() {
        ToastService.info('Tab fechada');
    };

    $scope.toggleSite = function() {
        $scope.siteAberto = !$scope.siteAberto;
        ToastService.info('Site ' + ($scope.siteAberto ? 'aberto' : 'fechado'));
    };

    $scope.toggleCaixa = function() {
        $scope.caixaAberto = !$scope.caixaAberto;
        ToastService.info('Caixa ' + ($scope.caixaAberto ? 'aberto' : 'fechado'));
    };

    $scope.toggleCaixaDetalhado = function() {
        $scope.caixaDetalhado = !$scope.caixaDetalhado;
        ToastService.info('Caixa detalhado ' + ($scope.caixaDetalhado ? 'ativado' : 'desativado'));
    };

    $scope.novoPedido = function() {
        ToastService.info('Redirecionando para novo pedido...');
        $location.path('/novo-pedido');
    };

    $scope.showUserMenu = function() {
        ToastService.info('Menu do usuário');
    };

    // Ações do footer
    $scope.configurePickup = function() {
        $scope.retiradaConfigurada = !$scope.retiradaConfigurada;
        ToastService.info('Retirada ' + ($scope.retiradaConfigurada ? 'configurada' : 'não configurada'));
    };

    $scope.adjustDeliveryTime = function() {
        ToastService.info('Ajustar tempo de entrega');
    };

    $scope.refreshOrders = function() {
        ToastService.success('Pedidos atualizados');
        // Aqui você pode implementar a lógica para recarregar os pedidos da API
    };

    // Inicialização
    $scope.init = function() {
        // Atualizar relógio a cada segundo
        $scope.clockInterval = $interval(function() {
            $scope.updateClock();
        }, 1000);

        // Simular atualizações automáticas dos pedidos
        $scope.ordersInterval = $interval(function() {
            // Aqui você pode implementar lógica para buscar novos pedidos da API
        }, 30000); // A cada 30 segundos
    };

    // Cleanup
    $scope.$on('$destroy', function() {
        if ($scope.clockInterval) {
            $interval.cancel($scope.clockInterval);
        }
        if ($scope.ordersInterval) {
            $interval.cancel($scope.ordersInterval);
        }
    });

    // Inicializar
    $scope.init();
}]);

