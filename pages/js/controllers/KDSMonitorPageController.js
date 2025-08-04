/*global angular*/
angular.module("vdo.spa").controller("KDSMonitorPageController", function($scope) {

    // Canais disponíveis com cores/classes diferentes
    var canais = [
      { canal: "IFOOD", classe: "ifood-pickup" },
        { canal: "SITE", classe: "site-entrega" }
    ];

    // Exemplos variados de itens
    var exemplosDeItens = [
        [
            {
                nome: "01 - Pizza (Gigante)",
                opcoes: ["Frango com catupiry", "Calabresa", "Sem borda"],
                icone: "psi-check"
            },
            {
                nome: "01 - Pizza (Broto Doce)",
                opcoes: ["Dois amores"],
                icone: "psi-warning warning"
            }
        ],
        [
            {
                nome: "01 - Pizza (Gigante)",
                opcoes: ["Quatro queijos", "Milho", "Brócolis", "Borda Catupiry"],
                icone: "psi-warning warning"
            },
            {
                nome: "01 - Pizza (Broto Doce)",
                opcoes: ["Sensação"],
                icone: "psi-warning warning"
            }
        ],
        [
            {
                nome: "01 - Pizza (Broto Doce)",
                opcoes: ["Chocolate branco"],
                icone: "psi-warning warning"
            },
            {
                nome: "01 - Pizza (Gigante)",
                opcoes: ["Catupiry", "Quatro queijos", "Bacon", "Borda Cheddar"],
                icone: "psi-warning warning"
            }
        ],
        [
            {
                nome: "01 - Pizza (Gigante)",
                opcoes: ["Frango napolitano", "Calabresa", "Borda Cheddar"],
                icone: "psi-warning warning"
            },
            {
                nome: "01 - Pizza (Broto Doce)",
                opcoes: ["Chocolate preto"],
                icone: "psi-warning warning"
            }
        ]
    ];

    // Gerar 6 pedidos variados
    $scope.pedidos = [];

    for (var i = 0; i < 6; i++) {
        var canal = canais[i % canais.length];
        var itens = exemplosDeItens[i % exemplosDeItens.length];

        $scope.pedidos.push({
            numero: "15" + (i + 1),                     // Ex: 151, 152...
            tempo: "00:2" + i,                         // Tempo fictício
            tipo: "ENTREGA",
            canal: canal.canal,
            classe: canal.classe,
            itens: angular.copy(itens)
        });
    }
});
