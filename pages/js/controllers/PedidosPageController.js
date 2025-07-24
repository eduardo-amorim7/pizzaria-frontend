/*global angular,$,addInteraction,L,document*/
angular.module('vdo.spa').controller('PedidosPageController', function($scope, $rootScope, $timeout, $http, $log, $location, $route, $routeParams, $window, $filter) {

  var $branch = this;
  var lastRoute = $route.current;
  $scope.loadingPositions = true;
  $scope.textFilter = "";

  $scope.pages = [];
  $scope.paginatedItems = [];

  $scope.pageSize = parseInt($window.localStorage.getItem('bc.page.itens.size')) || 10;

  $scope.currentPage = 0;
  $scope.maxPagesToShow = 5;

  $scope.changeFilter = function(text){
    $scope.textFilter = text;
    $scope.currentPage = 0;
    $scope.paginateItems();
  };

  // Função para calcular os itens na página atual
  $scope.paginateItems = function() {
    var filteredItems = $scope.textFilter ? $filter('filter')($scope.branchs, $scope.textFilter) : $scope.branchs;

    var startIndex = $scope.currentPage * $scope.pageSize;
    $scope.paginatedItems = filteredItems.slice(startIndex, startIndex + $scope.pageSize);
    $scope.totalPages = Math.ceil(filteredItems.length / $scope.pageSize);
    $scope.updatePages();
  };


  $scope.updatePages = function() {
    $scope.pages = [];
    var startPage, endPage;

    if ($scope.totalPages <= $scope.maxPagesToShow) {
      startPage = 0;
      endPage = $scope.totalPages;
    } else {
      var halfPagesToShow = Math.floor($scope.maxPagesToShow / 2);
      startPage = Math.max(0, $scope.currentPage - halfPagesToShow);
      endPage = Math.min(startPage + $scope.maxPagesToShow, $scope.totalPages);

      if (endPage - startPage < $scope.maxPagesToShow) {
        startPage = endPage - $scope.maxPagesToShow;
      }
    }

    for (var i = startPage; i < endPage; i++) {
      $scope.pages.push(i);
    }
  };

  $scope.goToPage = function(page) {
    $scope.currentPage = page;
    $scope.paginateItems();
    $scope.updatePages();
  };


  $scope.nextPage = function() {
    if ($scope.currentPage < Math.ceil($scope.branchs.length / $scope.pageSize) - 1) {
      $scope.currentPage++;
      $scope.paginateItems();
    }
  };


  $scope.prevPage = function() {
    if ($scope.currentPage > 0) {
      $scope.currentPage--;
      $scope.paginateItems();
    }
  };

  $scope.changepageSize = function(size){
    if ($window && $window.localStorage){
      $window.localStorage.setItem('bc.page.itens.size', size);  
    } 

    $scope.pageSize = size;
    $scope.currentPage = 0;
    $scope.updatePages();
    $scope.paginateItems();
  };



  $scope.vm = {
    'active': { 'id': $routeParams.id, 'slug': $routeParams.slug }
  };

  $scope.edit = function(id, slug) {
    /*global history*/
    $location.path('/branches/edit/'+slug);
  };
  $scope.backToLast = function() {
    /*global history*/
    $window.history.back();
  };



  $scope.back = function(id, slug) {
    /*global history*/
    $location.path('/branches');
  };

  function findBranchs() {
    
$scope.loadingPositions = false;
$scope.branchs = [];
  }


  if(!$scope.vm.active.id){
    findBranchs();
  }

  return $branch;
});

