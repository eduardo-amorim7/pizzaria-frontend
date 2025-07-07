angular.module('pizzariaApp').service('ApiService', ['$http', '$q', function($http, $q) {
    const API_BASE = 'http://localhost:3000/api';

    return {
        get: function(endpoint, params) {
            const deferred = $q.defer();
            
            $http.get(API_BASE + endpoint, { params: params })
                .then(function(response) {
                    deferred.resolve(response.data);
                })
                .catch(function(error) {
                    deferred.reject(error.data || { message: 'Erro de conexão' });
                });
            
            return deferred.promise;
        },

        post: function(endpoint, data) {
            const deferred = $q.defer();
            
            $http.post(API_BASE + endpoint, data)
                .then(function(response) {
                    deferred.resolve(response.data);
                })
                .catch(function(error) {
                    deferred.reject(error.data || { message: 'Erro de conexão' });
                });
            
            return deferred.promise;
        },

        put: function(endpoint, data) {
            const deferred = $q.defer();
            
            $http.put(API_BASE + endpoint, data)
                .then(function(response) {
                    deferred.resolve(response.data);
                })
                .catch(function(error) {
                    deferred.reject(error.data || { message: 'Erro de conexão' });
                });
            
            return deferred.promise;
        },

        delete: function(endpoint) {
            const deferred = $q.defer();
            
            $http.delete(API_BASE + endpoint)
                .then(function(response) {
                    deferred.resolve(response.data);
                })
                .catch(function(error) {
                    deferred.reject(error.data || { message: 'Erro de conexão' });
                });
            
            return deferred.promise;
        },

        // Métodos específicos para pedidos
        getPedidos: function(filtros) {
            return this.get('/pedidos', filtros);
        },

        getPedidosKds: function(setor) {
            return this.get('/pedidos/kds', { setor: setor });
        },

        getPedido: function(id) {
            return this.get('/pedidos/' + id);
        },

        criarPedido: function(pedido) {
            return this.post('/pedidos', pedido);
        },

        atualizarStatusPedido: function(id, status) {
            return this.put('/pedidos/' + id + '/status', { status: status });
        },

        editarPedido: function(id, dados) {
            return this.put('/pedidos/' + id, dados);
        },

        cancelarPedido: function(id) {
            return this.delete('/pedidos/' + id);
        },

        // Métodos específicos para produtos
        getProdutos: function(filtros) {
            return this.get('/produtos', filtros);
        },

        getCategorias: function() {
            return this.get('/produtos/categorias');
        },

        getProduto: function(id) {
            return this.get('/produtos/' + id);
        },

        criarProduto: function(produto) {
            return this.post('/produtos', produto);
        },

        editarProduto: function(id, dados) {
            return this.put('/produtos/' + id, dados);
        },

        alterarDisponibilidadeProduto: function(id, disponivel) {
            return this.put('/produtos/' + id + '/disponibilidade', { disponivel: disponivel });
        },

        removerProduto: function(id) {
            return this.delete('/produtos/' + id);
        }
    };
}]);

