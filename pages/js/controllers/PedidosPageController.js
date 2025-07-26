/*global angular,$,addInteraction,L,document*/
angular.module(\'vdo.spa\').controller(\'PedidosPageController\', function($scope, $rootScope, $timeout, $http, $log, $location, $route, $routeParams, $window, $filter) {

  var $orders = this;
  var lastRoute = $route.current;

  $scope.vm = {
    \"active\": { \"id\": $routeParams.id, \"slug\": $routeParams.slug }
  };

  $scope.edit = function(id, slug) {
    /*global history*/
    $location.path(\\'/pedidos/edit/\\'+slug);
  };

  $scope.back = function(id, slug) {
    /*global history*/
    $location.path(\\'/pedidos\\');
  };

  function findPedidos() {
    $scope.loadingPositions = false;

    $scope.pedidos = [
      // Pedidos Novos
      {
        id: \'001\',
        status: \'Novo\',
        type: \'Entrega\',
        source: \'APP\',
        time: \'10:00\',
        client: \'Ana Silva\',
        phone: \'(61) 98765-4321\',
        address: \'Ceilândia\',
        deliveryTime: \'10min\',
        preparationTime: \'20min\',
        column: \'novos\'
      },
      {
        id: \'002\',
        status: \'Novo\',
        type: \'Retirada\',
        source: \'LOCAL\',
        time: \'10:05\',
        client: \'Bruno Costa\',
        phone: \'(61) 91234-5678\',
        address: \'Guará\',
        deliveryTime: \'0min\',
        preparationTime: \'15min\',
        column: \'novos\'
      },
      // Pedidos Processando
      {
        id: \'018\',
        status: \'Aprovado\',
        type: \'Entrega\',
        source: \'LOCAL\',
        time: \'10:16\',
        client: \'Marcio\',
        phone: \'(61) 99673-6411\',
        address: \'Taguatinga\',
        deliveryTime: \'5min\',
        preparationTime: \'1799 min\',
        column: \'processando\'
      },
      {
        id: \'019\',
        status: \'Aprovado\',
        type: \'Entrega\',
        source: \'LOCAL\',
        time: \'10:16\',
        client: \'Marcio\',
        phone: \'(61) 99673-6411\',
        address: \'Taguatinga\',
        deliveryTime: \'5min\',
        preparationTime: \'1799 min\',
        column: \'processando\'
      },
      {
        id: \'020\',
        status: \'Aprovado\',
        type: \'Entrega\',
        source: \'SITE\',
        time: \'10:16\',
        client: \'Marcio\',
        phone: \'(61) 99673-6411\',
        address: \'Taguatinga\',
        deliveryTime: \'5min\',
        preparationTime: \'1799 min\',
        column: \'processando\'
      },
      // Pedidos Prontos
      {
        id: \'021\',
        status: \'Pronto\',
        type: \'Entrega\',
        source: \'LOCAL\',
        time: \'10:30\',
        client: \'Carla Dias\',
        phone: \'(61) 98765-1234\',
        address: \'Águas Claras\',
        deliveryTime: \'0min\',
        preparationTime: \'0min\',
        column: \'prontos\'
      },
      {
        id: \'022\',
        status: \'Pronto\',
        type: \'Retirada\',
        source: \'APP\',
        time: \'10:35\',
        client: \'Daniel Rocha\',
        phone: \'(61) 91234-9876\',
        address: \'Asa Sul\',
        deliveryTime: \'0min\',
        preparationTime: \'0min\',
        column: \'prontos\'
      }
    ];

  }


  if(!$scope.vm.active.id){
    findPedidos();
  }

  return $orders;
});



