// Configuração principal da aplicação AngularJS
angular.module('pizzariaApp', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/kds.html',
            controller: 'KdsController',
            requireAuth: true
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController',
            requireAuth: true
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController',
            requireAuth: false
        })
        .when('/pedidos', {
            templateUrl: 'views/pedidos.html',
            controller: 'PedidosController',
            requireAuth: true
        })
        .when("/pedidos/novo", {
            templateUrl: "views/novo-pedido.html",
            controller: "NovoPedidoController",
            requireAuth: true
        })
        .when('/produtos', {
            templateUrl: 'views/produtos.html',
            controller: 'ProdutosController',
            requireAuth: true
        })
        .when('/relatorios', {
            templateUrl: 'views/relatorios.html',
            controller: 'RelatoriosController',
            requireAuth: true
        })
        .when('/perfil', {
            templateUrl: 'views/perfil.html',
            controller: 'PerfilController',
            requireAuth: true
        })
        .otherwise({
            redirectTo: '/'
        });
}])

.run(['$rootScope', '$location', 'AuthService', 'ToastService', function($rootScope, $location, AuthService, ToastService) {
    // Verificar autenticação em mudanças de rota
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.requireAuth && !AuthService.isAuthenticated()) {
            event.preventDefault();
            $location.path('/login');
        } else if (next.originalPath === '/login' && AuthService.isAuthenticated()) {
            event.preventDefault();
            $location.path('/');
        }
    });

    // Interceptar erros de mudança de rota
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
        console.error('Erro na mudança de rota:', rejection);
        ToastService.error('Erro ao carregar a página');
        $location.path('/');
    });

    // Variáveis globais
    $rootScope.isLoading = false;
    $rootScope.toasts = [];

    // Função para mostrar/ocultar loading
    $rootScope.setLoading = function(loading) {
        $rootScope.isLoading = loading;
    };

    // Funções para toasts
    $rootScope.getToastIcon = function(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    };

    $rootScope.getToastTitle = function(type) {
        const titles = {
            success: 'Sucesso',
            error: 'Erro',
            warning: 'Atenção',
            info: 'Informação'
        };
        return titles[type] || 'Notificação';
    };

    $rootScope.removeToast = function(index) {
        $rootScope.toasts.splice(index, 1);
    };

    // Escutar eventos de toast
    $rootScope.$on('toast:show', function(event, toast) {
        $rootScope.toasts.push(toast);
        
        // Auto-remover após 5 segundos
        setTimeout(function() {
            const index = $rootScope.toasts.indexOf(toast);
            if (index > -1) {
                $rootScope.$apply(function() {
                    $rootScope.toasts.splice(index, 1);
                });
            }
        }, 5000);
    });
}])

// Filtros personalizados
.filter('statusText', function() {
    return function(status) {
        const statusMap = {
            'aguardando_preparo': 'Aguardando Preparo',
            'em_preparo': 'Em Preparo',
            'pronto': 'Pronto',
            'despachado': 'Despachado',
            'entregue': 'Entregue',
            'cancelado': 'Cancelado'
        };
        return statusMap[status] || status;
    };
})

.filter('tipoText', function() {
    return function(tipo) {
        const tipoMap = {
            'entrega': 'Entrega',
            'retirada': 'Retirada',
            'consumo_local': 'Consumo Local'
        };
        return tipoMap[tipo] || tipo;
    };
})

.filter('canalText', function() {
    return function(canal) {
        const canalMap = {
            'balcao': 'Balcão',
            'telefone': 'Telefone',
            'ifood': 'iFood',
            'site': 'Site',
            'whatsapp': 'WhatsApp'
        };
        return canalMap[canal] || canal;
    };
})

.filter('formatTempo', function() {
    return function(minutos) {
        if (!minutos && minutos !== 0) return '';
        
        if (minutos < 60) {
            return minutos + 'min';
        } else {
            const horas = Math.floor(minutos / 60);
            const mins = minutos % 60;
            return horas + 'h' + (mins > 0 ? ' ' + mins + 'min' : '');
        }
    };
})

.filter('formatMoeda', function() {
    return function(valor) {
        if (!valor && valor !== 0) return '';
        return 'R$ ' + valor.toFixed(2).replace('.', ',');
    };
})

// Diretivas personalizadas
.directive('autoFocus', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function() {
                element[0].focus();
            });
        }
    };
}])

.directive('confirmClick', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            const message = attrs.confirmClick || 'Tem certeza?';
            element.bind('click', function(e) {
                if (!confirm(message)) {
                    e.preventDefault();
                }
            });
        }
    };
})

.directive('numberOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
                if (inputValue == undefined) return '';
                const transformedInput = inputValue.replace(/[^0-9]/g, '');
                
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                
                return transformedInput;
            });
        }
    };
});

// Controller para Dashboard
angular.module('pizzariaApp').controller('DashboardController', ['$scope', 'ApiService', 'ToastService', 
function($scope, ApiService, ToastService) {
    $scope.stats = {
        pedidos_hoje: 0,
        pedidos_ativos: 0,
        tempo_medio_preparo: 0,
        faturamento_hoje: 0
    };

    $scope.pedidos_recentes = [];

    $scope.init = function() {
        $scope.carregarEstatisticas();
        $scope.carregarPedidosRecentes();
    };

    $scope.carregarEstatisticas = function() {
        ApiService.get('/relatorios/dashboard')
            .then(function(response) {
                $scope.stats = response.dados;
            })
            .catch(function(error) {
                console.error('Erro ao carregar estatísticas:', error);
                // Manter dados mockados em caso de erro
                $scope.stats = {
                    pedidos_hoje: 25,
                    pedidos_ativos: 8,
                    tempo_medio_preparo: 28,
                    faturamento_hoje: 1250.50
                };
            });
    };

    $scope.carregarPedidosRecentes = function() {
        ApiService.get('/pedidos', { limit: 5 })
            .then(function(response) {
                $scope.pedidos_recentes = response.pedidos;
            })
            .catch(function(error) {
                ToastService.error('Erro ao carregar pedidos recentes');
            });
    };

    $scope.init();
}]);



