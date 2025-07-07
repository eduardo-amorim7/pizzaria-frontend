angular.module('pizzariaApp').controller('RelatoriosController', ['$scope', 'ApiService', 'ToastService',
function($scope, ApiService, ToastService) {
    
    $scope.filtros = {
        data_inicio: '',
        data_fim: '',
        agrupamento: 'dia'
    };
    
    $scope.relatorios = {
        vendas: {
            dados: [],
            totais: {},
            carregando: false
        },
        produtos: {
            dados: [],
            carregando: false
        },
        tempos: {
            dados: {},
            carregando: false
        },
        canais: {
            dados: [],
            totais: {},
            carregando: false
        }
    };
    
    $scope.agrupamentoOptions = [
        { value: 'hora', label: 'Por Hora' },
        { value: 'dia', label: 'Por Dia' },
        { value: 'mes', label: 'Por Mês' }
    ];

    $scope.init = function() {
        // Definir período padrão (últimos 30 dias)
        const hoje = new Date();
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(hoje.getDate() - 30);
        
        $scope.filtros.data_fim = hoje.toISOString().split('T')[0];
        $scope.filtros.data_inicio = trintaDiasAtras.toISOString().split('T')[0];
        
        $scope.carregarTodosRelatorios();
    };

    $scope.carregarTodosRelatorios = function() {
        $scope.carregarRelatorioVendas();
        $scope.carregarRelatorioProdutos();
        $scope.carregarRelatorioTempos();
        $scope.carregarRelatorioCanais();
    };

    $scope.carregarRelatorioVendas = function() {
        $scope.relatorios.vendas.carregando = true;
        
        const params = {
            data_inicio: $scope.filtros.data_inicio,
            data_fim: $scope.filtros.data_fim,
            agrupamento: $scope.filtros.agrupamento
        };
        
        ApiService.get('/relatorios/vendas', params)
            .then(function(response) {
                $scope.relatorios.vendas.dados = response.dados;
                $scope.relatorios.vendas.totais = response.totais;
                $scope.gerarGraficoVendas();
            })
            .catch(function(error) {
                ToastService.error('Erro ao carregar relatório de vendas');
            })
            .finally(function() {
                $scope.relatorios.vendas.carregando = false;
            });
    };

    $scope.carregarRelatorioProdutos = function() {
        $scope.relatorios.produtos.carregando = true;
        
        const params = {
            data_inicio: $scope.filtros.data_inicio,
            data_fim: $scope.filtros.data_fim,
            limite: 10
        };
        
        ApiService.get('/relatorios/produtos', params)
            .then(function(response) {
                $scope.relatorios.produtos.dados = response.dados;
                $scope.gerarGraficoProdutos();
            })
            .catch(function(error) {
                ToastService.error('Erro ao carregar relatório de produtos');
            })
            .finally(function() {
                $scope.relatorios.produtos.carregando = false;
            });
    };

    $scope.carregarRelatorioTempos = function() {
        $scope.relatorios.tempos.carregando = true;
        
        const params = {
            data_inicio: $scope.filtros.data_inicio,
            data_fim: $scope.filtros.data_fim
        };
        
        ApiService.get('/relatorios/tempos', params)
            .then(function(response) {
                $scope.relatorios.tempos.dados = response.dados;
                $scope.gerarGraficoTempos();
            })
            .catch(function(error) {
                ToastService.error('Erro ao carregar relatório de tempos');
            })
            .finally(function() {
                $scope.relatorios.tempos.carregando = false;
            });
    };

    $scope.carregarRelatorioCanais = function() {
        $scope.relatorios.canais.carregando = true;
        
        const params = {
            data_inicio: $scope.filtros.data_inicio,
            data_fim: $scope.filtros.data_fim
        };
        
        ApiService.get('/relatorios/canais', params)
            .then(function(response) {
                $scope.relatorios.canais.dados = response.dados;
                $scope.relatorios.canais.totais = response.totais;
                $scope.gerarGraficoCanais();
            })
            .catch(function(error) {
                ToastService.error('Erro ao carregar relatório de canais');
            })
            .finally(function() {
                $scope.relatorios.canais.carregando = false;
            });
    };

    $scope.aplicarFiltros = function() {
        $scope.carregarTodosRelatorios();
    };

    $scope.gerarGraficoVendas = function() {
        const ctx = document.getElementById('graficoVendas');
        if (!ctx) return;

        const labels = $scope.relatorios.vendas.dados.map(item => item.data_formatada);
        const vendas = $scope.relatorios.vendas.dados.map(item => item.total_vendas);
        const pedidos = $scope.relatorios.vendas.dados.map(item => item.quantidade_pedidos);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Vendas (R$)',
                    data: vendas,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y'
                }, {
                    label: 'Quantidade de Pedidos',
                    data: pedidos,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Período'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Vendas (R$)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Quantidade de Pedidos'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    };

    $scope.gerarGraficoProdutos = function() {
        const ctx = document.getElementById('graficoProdutos');
        if (!ctx) return;

        const labels = $scope.relatorios.produtos.dados.map(item => item.nome_produto);
        const quantidades = $scope.relatorios.produtos.dados.map(item => item.quantidade_vendida);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantidade Vendida',
                    data: quantidades,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(199, 199, 199, 0.8)',
                        'rgba(83, 102, 255, 0.8)',
                        'rgba(255, 99, 255, 0.8)',
                        'rgba(99, 255, 132, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Produtos Mais Vendidos'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Quantidade'
                        }
                    }
                }
            }
        });
    };

    $scope.gerarGraficoTempos = function() {
        const ctx = document.getElementById('graficoTempos');
        if (!ctx) return;

        const dados = $scope.relatorios.tempos.dados;
        const labels = ['Tempo de Preparo', 'Tempo de Entrega', 'Tempo Total'];
        const tempos = [
            dados.tempo_preparo?.tempo_medio || 0,
            dados.tempo_entrega?.tempo_medio || 0,
            dados.tempo_total?.tempo_medio || 0
        ];

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tempo Médio (minutos)',
                    data: tempos,
                    backgroundColor: [
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Tempos Médios'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Tempo (minutos)'
                        }
                    }
                }
            }
        });
    };

    $scope.gerarGraficoCanais = function() {
        const ctx = document.getElementById('graficoCanais');
        if (!ctx) return;

        const labels = $scope.relatorios.canais.dados.map(item => {
            const nomes = {
                'balcao': 'Balcão',
                'telefone': 'Telefone',
                'ifood': 'iFood',
                'site': 'Site',
                'whatsapp': 'WhatsApp'
            };
            return nomes[item._id] || item._id;
        });
        const receitas = $scope.relatorios.canais.dados.map(item => item.receita_total);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: receitas,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Receita por Canal'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    };

    $scope.formatarMoeda = function(valor) {
        if (!valor && valor !== 0) return 'R$ 0,00';
        return 'R$ ' + valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    $scope.formatarTempo = function(minutos) {
        if (!minutos && minutos !== 0) return '0min';
        
        if (minutos < 60) {
            return minutos + 'min';
        } else {
            const horas = Math.floor(minutos / 60);
            const mins = minutos % 60;
            return horas + 'h' + (mins > 0 ? ' ' + mins + 'min' : '');
        }
    };

    $scope.exportarRelatorio = function(tipo) {
        // Implementar exportação para PDF/Excel
        ToastService.info('Funcionalidade de exportação em desenvolvimento');
    };

    $scope.init();
}]);

