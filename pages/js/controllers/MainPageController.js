/*global angular*/
angular.module('vdo.spa').controller('MainPageController', function ($scope, $timeout, $log, $http, $location) {
    var $main = this;
    $scope.charts = null;
    $scope.nps = null;
    $scope.routes = null;

    $main.tab = function (val) {
        $scope.active_tab = val;
    };
    $scope.active_tab = "";
    $scope.customFilterAccount = { text: '' };


    $scope.mode = 'T';

    $scope.changeMode = function (newMode) {
        $scope.mode = newMode;
        getDashboard();
    };

    $scope.formatarData = function (dataHora) {
        var data = new Date(dataHora);
        var dia = ('0' + data.getDate()).slice(-2);
        var mes = ('0' + (data.getMonth() + 1)).slice(-2);
        var ano = data.getFullYear();
        return dia + '/' + mes + '/' + ano;
    };

    $scope.formatarHora = function (dataHora) {
        var data = new Date(dataHora);
        var horas = ('0' + data.getHours()).slice(-2);
        var minutos = ('0' + data.getMinutes()).slice(-2);
        return horas + ':' + minutos;
    };

    $scope.edit = function (slug) {
        $location.path('/routes/edit/' + slug);
    };

    function getComparative(data) {

        var label = [];


        label.push({ "label": "Iniciadas", "value": data.linhas_iniciadas });
        label.push({ "label": "Não Iniciadas", "value": data.linhas_nao_iniciadas });
        return {
            chart: {
                numberPrefix: "",
                decimals: "0",
                formatNumberScale: "0",
                palettecolors: "#f47a25, #b1b0b0",
                valueFontColor: "#fff",
                valueFontBold: "1",
                showLegend: "1",
                slicingDistance: "9",
                enableSmartLabels: "0",
                centerLabelColor: "#5a5a5a",
                centerLabel: "$percentValue",
                plottooltext: "<b>$value</b> <b>$label</b>",
                pieRadius: "65",
                theme: "zune",
                startingAngle: "100",
                legendPosition: "bottom"
            },
            data: label
        };

    }

    function getCharts(data) {
        return {
            'comparative': getComparative(data.comparativo)
        };
    }


    function getDashboard() {
        var result = {
            "data": {
                 "comparativo": {
                "linhas_iniciadas": 4,
                "linhas_nao_iniciadas": 7
            },
            "geral": {
                "linhas_sem_veiculo": 1,
                "qtd_collaborators": 2,
                "qtd_trajetos": 2,
                "ocorrencias_pendente": 0
            },
            "nps_motoristas": {
                "total_avaliacao": 0,
                "total_motoristas": 0,
                "total_linhas": 0,
                "media": 0
            },
            "nps_colaboradores": {
                "total_colaboradores": 0,
                "total_avaliacao": 0,
                "total_linhas": 0,
                "media": 0
            },
            "routes": [
                {
                    "id_bc_route": 1,
                    "line_name": "Jardim da glória - Vila endres",
                    "ds_departure_time": "05:58",
                    "route_key": "1f4cf856-c88e-4181-8233-dd558d3e6efb",
                    "do_route_direction": "I",
                    "do_status": "A",
                    "veiculo": null,
                    "capacity": null,
                    "motorista": "ivan",
                    "quantpassageirosalocados": 2,
                    "exec_id": null,
                    "dt_start": null,
                    "dt_finished": null
                },
                {
                    "id_bc_route": 2,
                    "line_name": "Jardim da glória - Vila endres",
                    "ds_departure_time": "18:20",
                    "route_key": "dc8b91af-f3ab-4f04-a7cb-3c88cacd6313",
                    "do_route_direction": "V",
                    "do_status": "A",
                    "veiculo": null,
                    "capacity": null,
                    "motorista": "Lucas Motorista",
                    "quantpassageirosalocados": 2,
                    "exec_id": null,
                    "dt_start": null,
                    "dt_finished": null
                }
            ]
            }
           
        }






        var insigths = result.data;
        $scope.insigths = insigths;
        $scope.charts = getCharts(insigths);
        console.log('$scope.charts', $scope.charts);
        $scope.linhas_sem_veiculo = insigths.geral.linhas_sem_veiculo;
        $scope.qtd_trajetos = insigths.geral.qtd_trajetos;
        $scope.ocorrencias_pendente = insigths.geral.ocorrencias_pendente;
        $scope.qtd_collaborators = insigths.geral.qtd_collaborators;

        $scope.nps_colaboradores = insigths.nps_colaboradores;
        $scope.nps_colaboradores.media = $scope.nps_colaboradores.media.toFixed(2);

        $scope.nps_motoristas = insigths.nps_motoristas;
        $scope.nps_motoristas.media = $scope.nps_motoristas.media.toFixed(2);


        $scope.routes = insigths.routes;


    }




    $scope.$watch('vm.active', function (val) {

        getDashboard();
    }, false);

    $scope.doughnut2d = {

    };

    return $main;
});



