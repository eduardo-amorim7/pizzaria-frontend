angular.module('pizzariaApp').controller('NavController', ['$scope', '$location', 'AuthService', 'SocketService', 'ToastService',
function($scope, $location, AuthService, SocketService, ToastService) {
    
    $scope.isAuthenticated = false;
    $scope.currentUser = null;

    $scope.init = function() {
        $scope.checkAuthentication();
        
        if ($scope.isAuthenticated) {
            SocketService.connect();
        }
    };

    $scope.checkAuthentication = function() {
        $scope.isAuthenticated = AuthService.isAuthenticated();
        
        if ($scope.isAuthenticated) {
            AuthService.getCurrentUser()
                .then(function(user) {
                    $scope.currentUser = user;
                })
                .catch(function(error) {
                    console.error('Erro ao obter usuário atual:', error);
                    $scope.logout();
                });
        }
    };

    $scope.logout = function() {
        AuthService.logout();
        SocketService.disconnect();
        $scope.isAuthenticated = false;
        $scope.currentUser = null;
        ToastService.info('Logout realizado com sucesso');
        $location.path('/login');
    };

    // Verificar permissões
    $scope.canManageProducts = function() {
        return AuthService.canManageProducts();
    };

    $scope.canViewReports = function() {
        return AuthService.canViewReports();
    };

    $scope.canCreateOrder = function() {
        return AuthService.canCreateOrder();
    };

    // Escutar eventos de autenticação
    $scope.$on('auth:login', function() {
        $scope.checkAuthentication();
        SocketService.connect();
    });

    $scope.$on('auth:logout', function() {
        $scope.logout();
    });

    // Escutar eventos de socket
    $scope.$on('socket:connected', function() {
        console.log('Socket conectado');
    });

    $scope.$on('socket:disconnected', function() {
        console.log('Socket desconectado');
    });

    $scope.init();
}]);

