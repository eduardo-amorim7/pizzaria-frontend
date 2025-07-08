angular.module('pizzariaApp').service('AuthService', ['$http', '$q', function($http, $q) {
    const API_BASE = 'http://localhost:3000/api';
    let currentUser = null;
    let token = localStorage.getItem('pizzaria_token');

    // Configurar token no header das requisições
    if (token) {
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }

    return {
        login: function(credentials) {
            const deferred = $q.defer();
            
            // Login de teste para demonstração
            if (credentials.email === 'admin@pizzaria.com' && credentials.senha === '123456') {
                token = 'test_token_123456';
                currentUser = {
                    id: 1,
                    nome: 'Administrador',
                    email: 'admin@pizzaria.com',
                    nivel_acesso: 'admin'
                };
                
                // Salvar token no localStorage
                localStorage.setItem('pizzaria_token', token);
                
                // Configurar header para próximas requisições
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                
                setTimeout(function() {
                    deferred.resolve({
                        success: true,
                        token: token,
                        usuario: currentUser,
                        message: 'Login realizado com sucesso'
                    });
                }, 500); // Simular delay de rede
                
                return deferred.promise;
            }
            
            // Tentar login real com API
            $http.post(API_BASE + '/auth/login', credentials)
                .then(function(response) {
                    if (response.data.success) {
                        token = response.data.token;
                        currentUser = response.data.usuario;
                        
                        // Salvar token no localStorage
                        localStorage.setItem('pizzaria_token', token);
                        
                        // Configurar header para próximas requisições
                        $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                        
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject(response.data);
                    }
                })
                .catch(function(error) {
                    // Se falhar, tentar credenciais de teste
                    if (credentials.email === 'admin@pizzaria.com' && credentials.senha === '123456') {
                        token = 'test_token_123456';
                        currentUser = {
                            id: 1,
                            nome: 'Administrador',
                            email: 'admin@pizzaria.com',
                            nivel_acesso: 'admin'
                        };
                        
                        localStorage.setItem('pizzaria_token', token);
                        $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                        
                        deferred.resolve({
                            success: true,
                            token: token,
                            usuario: currentUser,
                            message: 'Login realizado com sucesso (modo teste)'
                        });
                    } else {
                        deferred.reject(error.data || { message: 'Credenciais inválidas' });
                    }
                });
            
            return deferred.promise;
        },

        logout: function() {
            token = null;
            currentUser = null;
            localStorage.removeItem('pizzaria_token');
            delete $http.defaults.headers.common['Authorization'];
        },

        isAuthenticated: function() {
            return !!token;
        },

        getCurrentUser: function() {
            const deferred = $q.defer();
            
            if (currentUser) {
                deferred.resolve(currentUser);
            } else if (token) {
                // Se for token de teste, retornar usuário de teste
                if (token === 'test_token_123456') {
                    currentUser = {
                        id: 1,
                        nome: 'Administrador',
                        email: 'admin@pizzaria.com',
                        nivel_acesso: 'admin'
                    };
                    deferred.resolve(currentUser);
                } else {
                    // Buscar dados do usuário atual
                    $http.get(API_BASE + '/auth/me')
                        .then(function(response) {
                            if (response.data.success) {
                                currentUser = response.data.usuario;
                                deferred.resolve(currentUser);
                            } else {
                                deferred.reject(response.data);
                            }
                        })
                        .catch(function(error) {
                            // Token inválido, fazer logout
                            this.logout();
                            deferred.reject(error.data || { message: 'Token inválido' });
                        }.bind(this));
                }
            } else {
                deferred.reject({ message: 'Usuário não autenticado' });
            }
            
            return deferred.promise;
        },

        hasPermission: function(permission) {
            if (!currentUser) return false;
            
            const permissions = {
                admin: ['*'],
                gerente: ['criar_pedido', 'editar_pedido', 'cancelar_pedido', 'ver_relatorios', 'gerenciar_produtos', 'gerenciar_usuarios'],
                atendente: ['criar_pedido', 'editar_pedido', 'ver_pedidos'],
                pizzaiolo: ['ver_pedidos', 'atualizar_status_preparo'],
                entregador: ['ver_pedidos', 'atualizar_status_entrega']
            };
            
            const userPermissions = permissions[currentUser.nivel_acesso] || [];
            return userPermissions.includes('*') || userPermissions.includes(permission);
        },

        canManageProducts: function() {
            return this.hasPermission('gerenciar_produtos');
        },

        canViewReports: function() {
            return this.hasPermission('ver_relatorios');
        },

        canCreateOrder: function() {
            return this.hasPermission('criar_pedido');
        },

        canEditOrder: function() {
            return this.hasPermission('editar_pedido');
        },

        canCancelOrder: function() {
            return this.hasPermission('cancelar_pedido');
        },

        canUpdatePreparationStatus: function() {
            return this.hasPermission('atualizar_status_preparo');
        },

        canUpdateDeliveryStatus: function() {
            return this.hasPermission('atualizar_status_entrega');
        },

        changePassword: function(passwordData) {
            const deferred = $q.defer();
            
            $http.put(API_BASE + '/auth/senha', passwordData)
                .then(function(response) {
                    deferred.resolve(response.data);
                })
                .catch(function(error) {
                    deferred.reject(error.data || { message: 'Erro ao alterar senha' });
                });
            
            return deferred.promise;
        },

        getToken: function() {
            return token;
        }
    };
}]);

