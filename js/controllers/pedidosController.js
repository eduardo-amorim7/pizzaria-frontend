angular.module('pizzariaApp').controller('PedidosController', ['$scope', 'ApiService', 'AuthService', 'ToastService',
function($scope, ApiService, AuthService, ToastService) {
    
    $scope.pedidos = [];
    $scope.filtros = {
        status: '',
        tipo: '',
        data_inicio: '',
        data_fim: '',
        busca: ''
    };
    
    $scope.statusOptions = [
        { value: '', label: 'Todos os Status' },
        { value: 'aguardando_preparo', label: 'Aguardando Preparo' },
        { value: 'em_preparo', label: 'Em Preparo' },
        { value: 'pronto', label: 'Pronto' },
        { value: 'despachado', label: 'Despachado' },
        { value: 'entregue', label: 'Entregue' },
        { value: 'cancelado', label: 'Cancelado' }
    ];
    
    $scope.tipoOptions = [
        { value: '', label: 'Todos os Tipos' },
        { value: 'entrega', label: 'Entrega' },
        { value: 'retirada', label: 'Retirada' },
        { value: 'consumo_local', label: 'Consumo Local' }
    ];
    
    $scope.isLoading = false;
    $scope.pedidoSelecionado = null;

    $scope.init = function() {
        $scope.carregarPedidos();
    };

    $scope.carregarPedidos = function() {
        $scope.isLoading = true;
        
        ApiService.getPedidos($scope.filtros)
            .then(function(response) {
                $scope.pedidos = response.pedidos;
            })
            .catch(function(error) {
                ToastService.error('Erro ao carregar pedidos: ' + (error.message || 'Erro desconhecido'));
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    };

    $scope.aplicarFiltros = function() {
        $scope.carregarPedidos();
    };

    $scope.limparFiltros = function() {
        $scope.filtros = {
            status: '',
            tipo: '',
            data_inicio: '',
            data_fim: '',
            busca: ''
        };
        $scope.carregarPedidos();
    };

    $scope.verDetalhes = function(pedido) {
        $scope.pedidoSelecionado = pedido;
        
        // Abrir modal (usando Bootstrap)
        const modal = new bootstrap.Modal(document.getElementById('modalDetalhes'));
        modal.show();
    };

    $scope.editarPedido = function(pedido) {
        if (!AuthService.canEditOrder()) {
            ToastService.warning('Você não tem permissão para editar pedidos');
            return;
        }
        
        // Implementar edição de pedido
        ToastService.info('Funcionalidade de edição em desenvolvimento');
    };

    $scope.cancelarPedido = function(pedido) {
        if (!AuthService.canCancelOrder()) {
            ToastService.warning('Você não tem permissão para cancelar pedidos');
            return;
        }
        
        if (!confirm('Tem certeza que deseja cancelar o pedido #' + pedido.numero + '?')) {
            return;
        }
        
        ApiService.cancelarPedido(pedido._id)
            .then(function(response) {
                ToastService.success('Pedido cancelado com sucesso');
                $scope.carregarPedidos();
            })
            .catch(function(error) {
                ToastService.error('Erro ao cancelar pedido: ' + (error.message || 'Erro desconhecido'));
            });
    };

    $scope.podeEditarPedido = function(pedido) {
        return AuthService.canEditOrder() && 
               ['aguardando_preparo'].includes(pedido.status);
    };

    $scope.podeCancelarPedido = function(pedido) {
        return AuthService.canCancelOrder() && 
               !['entregue', 'cancelado'].includes(pedido.status);
    };

    $scope.getClasseStatus = function(status) {
        const classes = {
            'aguardando_preparo': 'bg-warning text-dark',
            'em_preparo': 'bg-orange text-white',
            'pronto': 'bg-success text-white',
            'despachado': 'bg-primary text-white',
            'entregue': 'bg-secondary text-white',
            'cancelado': 'bg-danger text-white'
        };
        return classes[status] || 'bg-light text-dark';
    };

    $scope.calcularTempoTotal = function(pedido) {
        if (!pedido.tempos) return null;
        
        const inicio = new Date(pedido.tempos.pedido_criado);
        const fim = pedido.tempos.entregue ? 
                   new Date(pedido.tempos.entregue) : 
                   new Date();
        
        const diffMinutos = Math.round((fim - inicio) / (1000 * 60));
        return diffMinutos;
    };

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

    $scope.init();
}])

// Controller para novo pedido
.controller('NovoPedidoController', ['$scope', '$location', 'ApiService', 'ToastService',
function($scope, $location, ApiService, ToastService) {
    
    $scope.pedido = {
        cliente: {
            nome: '',
            telefone: '',
            endereco: {
                rua: '',
                numero: '',
                bairro: '',
                cidade: '',
                cep: '',
                complemento: ''
            }
        },
        tipo: 'entrega',
        canal: 'balcao',
        itens: [],
        pagamento: {
            forma: 'dinheiro',
            troco: 0
        },
        observacoes_gerais: ''
    };
    
    $scope.produtos = [];
    $scope.produtoSelecionado = null;
    $scope.itemAtual = {
        produto: null,
        quantidade: 1,
        tamanho: '',
        sabores: [],
        borda: null,
        adicionais: [],
        observacoes: ''
    };
    
    $scope.isLoading = false;

    $scope.init = function() {
        $scope.carregarProdutos();
    };

    $scope.carregarProdutos = function() {
        ApiService.getProdutos({ categoria: 'pizza', disponivel: true })
            .then(function(response) {
                $scope.produtos = response.produtos;
            })
            .catch(function(error) {
                ToastService.error('Erro ao carregar produtos');
            });
    };

    $scope.selecionarProduto = function(produto) {
        $scope.produtoSelecionado = produto;
        $scope.itemAtual.produto = produto._id;
        $scope.itemAtual.tamanho = produto.tamanhos.length > 0 ? produto.tamanhos[0].nome : '';
    };

    $scope.adicionarItem = function() {
        if (!$scope.itemAtual.produto || !$scope.itemAtual.tamanho) {
            ToastService.warning('Selecione um produto e tamanho');
            return;
        }
        
        if ($scope.itemAtual.sabores.length === 0) {
            ToastService.warning('Selecione pelo menos um sabor');
            return;
        }
        
        const item = angular.copy($scope.itemAtual);
        item.produto_nome = $scope.produtoSelecionado.nome;
        
        $scope.pedido.itens.push(item);
        
        // Limpar item atual
        $scope.itemAtual = {
            produto: null,
            quantidade: 1,
            tamanho: '',
            sabores: [],
            borda: null,
            adicionais: [],
            observacoes: ''
        };
        $scope.produtoSelecionado = null;
        
        ToastService.success('Item adicionado ao pedido');
    };

    $scope.removerItem = function(index) {
        $scope.pedido.itens.splice(index, 1);
        ToastService.info('Item removido do pedido');
    };

    $scope.calcularTotal = function() {
        let total = 0;
        
        $scope.pedido.itens.forEach(function(item) {
            const produto = $scope.produtos.find(p => p._id === item.produto);
            if (produto) {
                const tamanho = produto.tamanhos.find(t => t.nome === item.tamanho);
                if (tamanho) {
                    total += tamanho.preco * item.quantidade;
                    
                    // Adicionar preço da borda
                    if (item.borda) {
                        const borda = produto.bordas_disponiveis.find(b => b.nome === item.borda);
                        if (borda) {
                            total += borda.preco * item.quantidade;
                        }
                    }
                    
                    // Adicionar preço dos adicionais
                    item.adicionais.forEach(function(adicional) {
                        const adicionalInfo = produto.adicionais_disponiveis.find(a => a.nome === adicional);
                        if (adicionalInfo) {
                            total += adicionalInfo.preco * item.quantidade;
                        }
                    });
                }
            }
        });
        
        return total;
    };

    $scope.salvarPedido = function() {
        if ($scope.pedido.itens.length === 0) {
            ToastService.warning('Adicione pelo menos um item ao pedido');
            return;
        }
        
        if (!$scope.pedido.cliente.nome) {
            ToastService.warning('Informe o nome do cliente');
            return;
        }
        
        $scope.pedido.pagamento.valor_total = $scope.calcularTotal();
        $scope.isLoading = true;
        
        ApiService.criarPedido($scope.pedido)
            .then(function(response) {
                ToastService.success('Pedido criado com sucesso!');
                $location.path('/pedidos');
            })
            .catch(function(error) {
                ToastService.error('Erro ao criar pedido: ' + (error.message || 'Erro desconhecido'));
            })
            .finally(function() {
                $scope.isLoading = false;
            });
    };

    $scope.init();
}]);

