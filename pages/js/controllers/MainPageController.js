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

 function getNetworkChartMockup() {
    return  {
    "chart": {
        "xAxisname": "Dia",
        "yAxisName": "Quantidade de Pizzas",
        "legendposition": "Right",
        "drawanchors": "0",
        "showvalues": "0",
        "plotHighlightEffect": "fadeout",
        "drawcrossline": "1",
        "palettecolors": "#1976d2",
        "plottooltext": "<b>$dataValue</b> - $label",
        "theme": "zune",
        "showShadow": "1",
        "yAxisMaxValue": "600"
    },
    "data": [
        {
            "label": "27/07/2025",
            "value": 65,
            "tooltext": "Pizzas: <b>0</b>{br}Data: <b>27/07/2025</b>"
        },
        {
            "label": "28/07/2025",
            "value": 88,
            "tooltext": "Pizzas: <b>8</b>{br}Data: <b>28/07/2025</b>"
        },
        {
            "label": "29/07/2025",
            "value": 90,
            "tooltext": "Pizzas: <b>0</b>{br}Data: <b>29/07/2025</b>"
        },
        {
            "label": "30/07/2025",
            "value": 180,
            "tooltext": "Pizzas: <b>0</b>{br}Data: <b>30/07/2025</b>"
        },
        {
            "label": "31/07/2025",
            "value": 80,
            "tooltext": "Pizzas: <b>0</b>{br}Data: <b>31/07/2025</b>"
        },
        {
            "label": "01/08/2025",
            "value": 75,
            "tooltext": "Pizzas: <b>0</b>{br}Data: <b>01/08/2025</b>"
        },
        {
            "label": "02/08/2025",
            "value": 98,
            "tooltext": "Pizzas: <b>0</b>{br}Data: <b>02/08/2025</b>"
        }
    ]
}
}


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
        comparative: getComparative(data.comparativo),
        comparativev2: getNetworkChartMockup()
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
        "qtd_collaborators": 22,
        "qtd_trajetos": 6,
        "ocorrencias_pendente": 6
    },
    "nps_motoristas": {
        "total_avaliacao": 1,
        "total_motoristas": 1,
        "total_linhas": 1,
        "media": "5.00"
    },
    "nps_colaboradores": {
        "total_colaboradores": 2,
        "total_avaliacao": 2,
        "total_linhas": 2,
        "media": "4.00"
    },
    "routes": [
        {
            "id_bc_route": 447,
            "line_name": "Linha Ipiranga",
            "ds_departure_time": "06:12",
            "route_key": "4be57523-d456-4b0e-869e-f7866d6d20ce",
            "do_route_direction": "I",
            "do_status": "A",
            "veiculo": "DEV-0001",
            "capacity": 50,
            "motorista": "Antonio da Silva Martins",
            "quantpassageirosalocados": 3,
            "exec_id": null,
            "dt_start": null,
            "dt_finished": null,
            "$$hashKey": "object:87"
        },
        {
            "id_bc_route": 545,
            "line_name": "Linha Ipiranga",
            "ds_departure_time": "14:30",
            "route_key": "befb26bf-65fd-48fb-9fb7-0a7c24d075a5",
            "do_route_direction": "V",
            "do_status": "A",
            "veiculo": "FXP3661",
            "capacity": 50,
            "motorista": "Antonio da Silva Martins",
            "quantpassageirosalocados": 3,
            "exec_id": null,
            "dt_start": null,
            "dt_finished": null,
            "$$hashKey": "object:88"
        },
        {
            "id_bc_route": 162,
            "line_name": "Cambuci - Ipiranga",
            "ds_departure_time": "14:53",
            "route_key": "40c63a77-f061-4faa-b860-53388f02f3e2",
            "do_route_direction": "I",
            "do_status": "A",
            "veiculo": "DEV3000",
            "capacity": 423,
            "motorista": "Ivan",
            "quantpassageirosalocados": 0,
            "exec_id": null,
            "dt_start": null,
            "dt_finished": null,
            "$$hashKey": "object:89"
        },
        {
            "id_bc_route": 544,
            "line_name": "Cambuci - Ipiranga",
            "ds_departure_time": "15:10",
            "route_key": "cb7da112-5e33-4f46-8ca9-d4ef2a252da2",
            "do_route_direction": "V",
            "do_status": "A",
            "veiculo": "DEV3000",
            "capacity": 423,
            "motorista": "Ivan",
            "quantpassageirosalocados": 0,
            "exec_id": null,
            "dt_start": null,
            "dt_finished": null,
            "$$hashKey": "object:90"
        },
        {
            "id_bc_route": 546,
            "line_name": "Expediente Colaboradores",
            "ds_departure_time": "15:35",
            "route_key": "d5910fd3-da52-41f2-8930-885b6354b1e4",
            "do_route_direction": "I",
            "do_status": "A",
            "veiculo": "DEV3001",
            "capacity": 50,
            "motorista": "Ivan",
            "quantpassageirosalocados": 1,
            "exec_id": null,
            "dt_start": null,
            "dt_finished": null,
            "$$hashKey": "object:91"
        },
        {
            "id_bc_route": 146,
            "line_name": "Expediente Colaboradores",
            "ds_departure_time": "21:00",
            "route_key": "2a3d1499-56f1-45a0-868c-48eb16260afc",
            "do_route_direction": "V",
            "do_status": "A",
            "veiculo": null,
            "capacity": null,
            "motorista": "Douglas motorista",
            "quantpassageirosalocados": 1,
            "exec_id": null,
            "dt_start": null,
            "dt_finished": null,
            "$$hashKey": "object:92"
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
        $scope.nps_colaboradores.media = $scope.nps_colaboradores.media;

        $scope.nps_motoristas = insigths.nps_motoristas;
        $scope.nps_motoristas.media = $scope.nps_motoristas.media;


        $scope.routes = insigths.routes;


    }




    $scope.$watch('vm.active', function (val) {

        getDashboard();
    }, false);

    $scope.doughnut2d = {

    };

    return $main;
});



