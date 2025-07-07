angular.module('pizzariaApp').controller('LoginController', ['$scope', '$location', 'AuthService', 'ToastService',
function($scope, $location, AuthService, ToastService) {
    
    $scope.credentials = {
        email: '',
        senha: ''
    };
    
    $scope.isLoading = false;

    $scope.login = function() {
        if (!$scope.credentials.email || !$scope.credentials.senha) {
            ToastService.warning('Por favor, preencha todos os campos');
            return;
        }

        $scope.isLoading = true;

        AuthService.login($scope.credentials)
            .then(function(response) {
                ToastService.success('Login realizado com sucesso!');
                $scope.$emit('auth:login');
                $location.path('/');
            })
            .catch(function(error) {
                ToastService.error(error.message || 'Erro ao fazer login');
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    };

    // Fazer login ao pressionar Enter
    $scope.onKeyPress = function(event) {
        if (event.keyCode === 13) {
            $scope.login();
        }
    };
}]);

