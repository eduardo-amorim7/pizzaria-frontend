/*global angular*/
angular.module('vdo.spa').config(function($interpolateProvider, $httpProvider) {
  $interpolateProvider.startSymbol('#!{');
  $interpolateProvider.endSymbol('}!#'); 
});

