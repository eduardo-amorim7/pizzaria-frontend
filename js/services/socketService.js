angular.module('pizzariaApp').service('SocketService', ['$rootScope', function($rootScope) {
    let socket = null;
    let connected = false;

    return {
        connect: function() {
            if (!socket) {
                socket = io('http://localhost:3000');
                
                socket.on('connect', function() {
                    connected = true;
                    console.log('Conectado ao servidor Socket.IO');
                    $rootScope.$broadcast('socket:connected');
                });

                socket.on('disconnect', function() {
                    connected = false;
                    console.log('Desconectado do servidor Socket.IO');
                    $rootScope.$broadcast('socket:disconnected');
                });

                // Eventos de pedidos
                socket.on('novo_pedido', function(pedido) {
                    $rootScope.$broadcast('pedido:novo', pedido);
                });

                socket.on('pedido_updated', function(data) {
                    $rootScope.$broadcast('pedido:atualizado', data);
                });

                socket.on('novo_pedido_alerta', function(pedido) {
                    $rootScope.$broadcast('pedido:alerta', pedido);
                });

                socket.on('pedido_atrasado', function(pedido) {
                    $rootScope.$broadcast('pedido:atrasado', pedido);
                });
            }
        },

        disconnect: function() {
            if (socket) {
                socket.disconnect();
                socket = null;
                connected = false;
            }
        },

        isConnected: function() {
            return connected;
        },

        // Entrar em uma sala específica (ex: setor)
        joinSetor: function(setor) {
            if (socket && connected) {
                socket.emit('join_setor', setor);
            }
        },

        // Sair de uma sala
        leaveSetor: function(setor) {
            if (socket && connected) {
                socket.emit('leave_setor', setor);
            }
        },

        // Emitir atualização de status de pedido
        emitPedidoStatusUpdate: function(data) {
            if (socket && connected) {
                socket.emit('pedido_status_update', data);
            }
        },

        // Emitir novo pedido
        emitNovoPedido: function(pedido) {
            if (socket && connected) {
                socket.emit('novo_pedido', pedido);
            }
        },

        // Emitir pedido atrasado
        emitPedidoAtrasado: function(pedido) {
            if (socket && connected) {
                socket.emit('pedido_atrasado', pedido);
            }
        },

        // Método genérico para emitir eventos
        emit: function(event, data) {
            if (socket && connected) {
                socket.emit(event, data);
            }
        },

        // Método genérico para escutar eventos
        on: function(event, callback) {
            if (socket) {
                socket.on(event, function() {
                    const args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            }
        },

        // Remover listener de evento
        off: function(event, callback) {
            if (socket) {
                socket.off(event, callback);
            }
        }
    };
}]);

