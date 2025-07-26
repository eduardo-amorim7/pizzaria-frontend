/*global angular,$,addInteraction,L,document*/
angular.module(\'vdo.spa\').controller(\'PedidosPageController\', function($scope, $rootScope, $timeout, $http, $log, $location, $route, $routeParams, $window, $filter) {

  var $orders = this;
  var lastRoute = $route.current;

  $scope.vm = {
    \'active\': { \'id\': $routeParams.id, \'slug\': $routeParams.slug }
  };

  $scope.edit = function(id, slug) {
    /*global history*/
    $location.path(\'/pedidos/edit/\'+slug);
  };

  $scope.back = function(id, slug) {
    /*global history*/
    $location.path(\'/pedidos\');
  };

  function findPedidos() {
    $scope.loadingPositions = false;

    $scope.pedidos = [
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
        preparationTime: \'1799 min\'
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
        preparationTime: \'1799 min\'
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
        preparationTime: \'1799 min\'
      }
    ];

  }


  if(!$scope.vm.active.id){
    findPedidos();
  }

  return $orders;
});



