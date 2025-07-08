angular.module('pizzariaApp').controller('NovoPedidoController', function($scope, $location, ApiService, ToastService, $interval) {
    
    // Inicialização
    $scope.pedido = {
        cliente: {
            nome: '',
            telefone: '',
            endereco: {
                completo: ''
            }
        },
        tipo: 'entrega',
        itens: [],
        taxaEntrega: 0.00,
        desconto: 0.00,
        cupom: '',
        observacoesEntregador: '',
        observacoesPedido: ''
    };

    // Estados do formulário
    $scope.comboSelecionado = null;
    $scope.produtoSelecionado = 'pizza';
    $scope.tamanhoSelecionado = 'gigante';
    $scope.saboresSelecionados = [];
    $scope.adicionaisSelecionados = ['Sem Borda'];
    $scope.opcaoSaborSelecionada = 'sem_bebidas';
    $scope.buscaSabor = '';
    $scope.mostrarClientesDropdown = false;

    // Configurações do header
    $scope.activeFilter = 'entrega';
    $scope.siteAberto = true;
    $scope.caixaAberto = true;
    $scope.caixaDetalhado = false;
    $scope.currentTime = formatTime(new Date());

    // Atualizar relógio a cada segundo
    var clockTimer = $interval(function() {
        $scope.currentTime = formatTime(new Date());
    }, 1000);

    // Limpar timer quando o controller for destruído
    $scope.$on('$destroy', function() {
        if (clockTimer) {
            $interval.cancel(clockTimer);
        }
    });

    // Dados de clientes para o dropdown
    $scope.clientesDisponiveis = [
        { nome: 'Carlos', telefone: '(48) 9 8456-3255', endereco: 'Rua das Flores, 123 - Centro' },
        { nome: 'Fabio Maria', telefone: '(48) 9 8493-2550', endereco: 'Av. Principal, 456 - Bairro Novo' },
        { nome: 'Gica', telefone: '(48) 9 9932-5582', endereco: 'Rua dos Girassóis, 321 - Barreiros' },
        { nome: 'Ingrid', telefone: '(48) 9 8496-3255', endereco: 'Rua das Palmeiras, 789 - Campinas' },
        { nome: 'Ivanir Izidorio', telefone: '(48) 3065-3255', endereco: 'Rua das Acácias, 654 - Campinas' },
        { nome: 'L', telefone: '(48) 3325-5555', endereco: 'Av. Beira Mar, 1000 - Centro' },
        { nome: 'Shirlei Padilha', telefone: '(48) 3243-2552', endereco: 'Rua das Margaridas, 741 - Barreiros' },
        { nome: 'Tiago Raupp', telefone: '(48) 9 9832-5586', endereco: 'Rua Dorcílio Luz s/n, Potecas, São José - SC' }
    ];

    // Filtrar clientes com base no telefone ou nome
    $scope.clientesFiltrados = [];

    // Funções do header
    $scope.toggleMenu = function() {
        // Implementação do toggle menu
    };

    $scope.closeTab = function() {
        $location.path('/');
    };

    $scope.setFilter = function(filter) {
        $scope.activeFilter = filter;
    };

    $scope.toggleSiteAberto = function() {
        $scope.siteAberto = !$scope.siteAberto;
    };

    $scope.toggleCaixaAberto = function() {
        $scope.caixaAberto = !$scope.caixaAberto;
    };

    $scope.toggleCaixaDetalhado = function() {
        $scope.caixaDetalhado = !$scope.caixaDetalhado;
    };

    $scope.novoPedido = function() {
        // Já estamos na tela de novo pedido
        ToastService.show('info', 'Você já está na tela de novo pedido');
    };

    // Função para formatar o tempo
    function formatTime(date) {
        var hours = date.getHours().toString().padStart(2, '0');
        var minutes = date.getMinutes().toString().padStart(2, '0');
        return hours + ':' + minutes;
    }

    // Funções para o dropdown de clientes
    $scope.filtrarClientes = function() {
        var termo = $scope.pedido.cliente.telefone || $scope.pedido.cliente.nome || '';
        if (termo.length < 3) {
            $scope.clientesFiltrados = [];
            $scope.mostrarClientesDropdown = false;
            return;
        }

        termo = termo.toLowerCase();
        $scope.clientesFiltrados = $scope.clientesDisponiveis.filter(function(cliente) {
            return cliente.nome.toLowerCase().includes(termo) || 
                   cliente.telefone.includes(termo);
        });

        $scope.mostrarClientesDropdown = $scope.clientesFiltrados.length > 0;
    };

    $scope.selecionarCliente = function(cliente) {
        $scope.pedido.cliente.nome = cliente.nome;
        $scope.pedido.cliente.telefone = cliente.telefone;
        $scope.pedido.cliente.endereco.completo = cliente.endereco;
        $scope.mostrarClientesDropdown = false;
    };

    // Observar mudanças no campo de telefone ou nome para filtrar clientes
    $scope.$watch('pedido.cliente.telefone', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.filtrarClientes();
        }
    });

    $scope.$watch('pedido.cliente.nome', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.filtrarClientes();
        }
    });

    // Dados disponíveis
    $scope.saboresDisponiveis = [
        { nome: 'Alho poró', preco: 0 },
        { nome: 'Belíssima', preco: 0 },
        { nome: 'Abobrinha', preco: 0 },
        { nome: 'Alho', preco: 0 },
        { nome: 'Bolonha', preco: 0 },
        { nome: 'Capira', preco: 0 },
        { nome: 'Calabresa', preco: 0 },
        { nome: 'Calabresa Picante', preco: 0 },
        { nome: 'Canadense', preco: 0 },
        { nome: 'Com Bacon', preco: 0 },
        { nome: 'Filé com Catupiry', preco: 0 },
        { nome: 'Filé Mignon', preco: 0 },
        { nome: 'Florentina', preco: 0 },
        { nome: 'Frango cheddar', preco: 0 },
        { nome: 'Hawaiana', preco: 0 },
        { nome: 'Lombo ao Creme', preco: 0 },
        { nome: 'Madre', preco: 0 },
        { nome: 'Mexicana', preco: 0 },
        { nome: 'Mineira', preco: 0 },
        { nome: 'Napolitana', preco: 0 },
        { nome: 'Nápoles', preco: 0 }
    ];

    $scope.adicionaisDisponiveis = [
        { nome: 'Sem Borda', preco: 0 },
        { nome: 'Borda de Catupiry', preco: 5.00 },
        { nome: 'Borda cheddar', preco: 5.00 },
        { nome: 'Borda cream cheese', preco: 6.00 },
        { nome: 'Borda chocolate preto', preco: 4.00 },
        { nome: 'Borda chocolate branco', preco: 4.00 }
    ];

    // Funções de seleção
    $scope.selecionarModalidade = function(tipo) {
        $scope.pedido.tipo = tipo;
        
        // Atualizar taxa de entrega
        if (tipo === 'entrega') {
            $scope.pedido.taxaEntrega = 5.00;
        } else {
            $scope.pedido.taxaEntrega = 0.00;
        }
        
        $scope.atualizarTotal();
    };

    $scope.selecionarCombo = function(combo) {
        $scope.comboSelecionado = $scope.comboSelecionado === combo ? null : combo;
    };

    $scope.selecionarProduto = function(produto) {
        $scope.produtoSelecionado = produto;
        // Reset selections when changing product
        if (produto !== 'pizza') {
            $scope.saboresSelecionados = [];
            $scope.adicionaisSelecionados = [];
        } else if ($scope.adicionaisSelecionados.length === 0) {
            $scope.adicionaisSelecionados = ['Sem Borda'];
        }
    };

    $scope.selecionarTamanho = function(tamanho) {
        $scope.tamanhoSelecionado = tamanho;
    };

    $scope.toggleSabor = function(sabor) {
        var index = $scope.saboresSelecionados.indexOf(sabor);
        if (index === -1) {
            $scope.saboresSelecionados.push(sabor);
        } else {
            $scope.saboresSelecionados.splice(index, 1);
        }
    };

    $scope.toggleAdicional = function(adicional) {
        var index = $scope.adicionaisSelecionados.indexOf(adicional);
        if (index === -1) {
            // Remove "Sem Borda" se selecionar outra borda
            if (adicional.includes('Borda') && adicional !== 'Sem Borda') {
                var semBordaIndex = $scope.adicionaisSelecionados.indexOf('Sem Borda');
                if (semBordaIndex !== -1) {
                    $scope.adicionaisSelecionados.splice(semBordaIndex, 1);
                }
                // Remove outras bordas
                $scope.adicionaisSelecionados = $scope.adicionaisSelecionados.filter(function(item) {
                    return !item.includes('Borda') || item === 'Sem Borda';
                });
            }
            $scope.adicionaisSelecionados.push(adicional);
        } else {
            $scope.adicionaisSelecionados.splice(index, 1);
            // Se remover uma borda, adicionar "Sem Borda"
            if (adicional.includes('Borda') && adicional !== 'Sem Borda') {
                var temBorda = $scope.adicionaisSelecionados.some(function(item) {
                    return item.includes('Borda');
                });
                if (!temBorda) {
                    $scope.adicionaisSelecionados.push('Sem Borda');
                }
            }
        }
    };

    $scope.selecionarOpcaoSabor = function(opcao) {
        $scope.opcaoSaborSelecionada = opcao;
    };

    // Funções de item
    $scope.adicionarItem = function() {
        if ($scope.produtoSelecionado === 'pizza') {
            var item = {
                id: Date.now(),
                tipo: 'pizza',
                nome: 'Pizza (' + $scope.tamanhoSelecionado.charAt(0).toUpperCase() + $scope.tamanhoSelecionado.slice(1) + ')',
                tamanho: $scope.tamanhoSelecionado,
                sabores: angular.copy($scope.saboresSelecionados),
                adicionais: angular.copy($scope.adicionaisSelecionados),
                quantidade: 1,
                preco: calcularPrecoPizza(),
                observacoes: ''
            };
            
            $scope.pedido.itens.push(item);
            
            // Reset selections
            $scope.saboresSelecionados = [];
            $scope.adicionaisSelecionados = ['Sem Borda'];
            
            ToastService.show('success', 'Item adicionado ao pedido!');
        }
    };

    $scope.editarItem = function(item) {
        // Implementar edição de item
        ToastService.show('info', 'Funcionalidade de edição em desenvolvimento');
    };

    $scope.removerItem = function(item) {
        var index = $scope.pedido.itens.indexOf(item);
        if (index !== -1) {
            $scope.pedido.itens.splice(index, 1);
            ToastService.show('success', 'Item removido do pedido!');
        }
    };

    $scope.aumentarQuantidade = function(item) {
        item.quantidade++;
        $scope.atualizarTotal();
    };

    $scope.diminuirQuantidade = function(item) {
        if (item.quantidade > 1) {
            item.quantidade--;
            $scope.atualizarTotal();
        }
    };

    // Cálculos
    function calcularPrecoPizza() {
        var precoBase = 0;
        
        // Preço base por tamanho
        switch ($scope.tamanhoSelecionado) {
            case 'gigante':
                precoBase = 35.00;
                break;
            case 'grande':
                precoBase = 28.00;
                break;
            case 'media':
                precoBase = 22.00;
                break;
            case 'so_minha':
                precoBase = 18.00;
                break;
            case 'brotinho':
                precoBase = 15.00;
                break;
        }

        // Adicionar preço dos adicionais
        $scope.adicionaisSelecionados.forEach(function(adicional) {
            var adicionalObj = $scope.adicionaisDisponiveis.find(function(a) {
                return a.nome === adicional;
            });
            if (adicionalObj) {
                precoBase += adicionalObj.preco;
            }
        });

        return precoBase;
    }

    $scope.calcularTotal = function() {
        var subtotal = 0;
        
        $scope.pedido.itens.forEach(function(item) {
            subtotal += item.preco * item.quantidade;
        });
        
        subtotal += parseFloat($scope.pedido.taxaEntrega) || 0;
        subtotal -= parseFloat($scope.pedido.desconto) || 0;
        
        return Math.max(0, subtotal);
    };

    $scope.atualizarTotal = function() {
        // Apenas para forçar a atualização do total na view
        // O cálculo real é feito em calcularTotal()
    };

    // Ações do pedido
    $scope.cancelar = function() {
        $location.path('/');
    };

    $scope.cancelarPedido = function() {
        if (confirm('Tem certeza que deseja cancelar este pedido?')) {
            $location.path('/');
        }
    };

    $scope.finalizarPedido = function() {
        if ($scope.pedido.itens.length === 0) {
            ToastService.show('error', 'Adicione pelo menos um item ao pedido!');
            return;
        }

        if (!$scope.pedido.cliente.nome || !$scope.pedido.cliente.telefone) {
            ToastService.show('error', 'Preencha os dados do cliente!');
            return;
        }

        // Preparar dados para envio
        var pedidoParaEnvio = {
            numero: 'PED' + Date.now(),
            cliente: $scope.pedido.cliente,
            tipo: $scope.pedido.tipo,
            itens: $scope.pedido.itens,
            total: $scope.calcularTotal(),
            taxaEntrega: $scope.pedido.taxaEntrega,
            desconto: $scope.pedido.desconto,
            cupom: $scope.pedido.cupom,
            observacoes: {
                entregador: $scope.pedido.observacoesEntregador,
                pedido: $scope.pedido.observacoesPedido
            },
            status: 'aguardando_preparo',
            canal: 'balcao',
            dataHora: new Date()
        };

        // Mostrar modal de confirmação
        if (confirm('Confirmar pedido no valor de R$ ' + $scope.calcularTotal().toFixed(2) + '?')) {
            // Enviar para API
            ApiService.post('/pedidos', pedidoParaEnvio)
                .then(function(response) {
                    ToastService.show('success', 'Pedido criado com sucesso!');
                    $location.path('/');
                })
                .catch(function(error) {
                    console.error('Erro ao criar pedido:', error);
                    ToastService.show('error', 'Erro ao criar pedido. Tente novamente.');
                });
        }
    };

    // Inicializar com borda padrão selecionada
    if ($scope.adicionaisSelecionados.length === 0) {
        $scope.adicionaisSelecionados.push('Sem Borda');
    }

    // Inicializar taxa de entrega
    if ($scope.pedido.tipo === 'entrega') {
        $scope.pedido.taxaEntrega = 5.00;
    }
});

