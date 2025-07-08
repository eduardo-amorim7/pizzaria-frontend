// Configuração principal da aplicação
angular.module('pizzariaApp', ['ngRoute'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/', {
            templateUrl: 'views/main-dashboard.html',
            controller: 'MainDashboardController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                        return false;
                    }
                    return true;
                }
            }
        })
        .when('/novo-pedido', {
            templateUrl: 'views/novo-pedido.html',
            controller: 'NovoPedidoController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                        return false;
                    }
                    return true;
                }
            }
        })
        .when('/pedidos', {
            templateUrl: 'views/pedidos.html',
            controller: 'PedidosController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                        return false;
                    }
                    return true;
                }
            }
        })
        .when('/kds', {
            templateUrl: 'views/kds.html',
            controller: 'KdsController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                        return false;
                    }
                    return true;
                }
            }
        })
        .when('/relatorios', {
            templateUrl: 'views/relatorios.html',
            controller: 'RelatoriosController',
            resolve: {
                auth: function(AuthService, $location) {
                    if (!AuthService.isAuthenticated()) {
                        $location.path('/login');
                        return false;
                    }
                    return true;
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });
    
    // Configurar HTML5 mode
    $locationProvider.html5Mode(false);
}])
.run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.$$route && next.$$route.resolve && next.$$route.resolve.auth) {
            if (!AuthService.isAuthenticated()) {
                $location.path('/login');
            }
        }
    });
}]);

