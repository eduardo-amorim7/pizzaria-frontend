/*global angular*/
angular.module('vdo.spa').controller('HomeController', function($scope, $log, $location, $interval, $timeout, SpaNavigation, $window, $http) {
  var $home = this;

  $home.goto = function(event, link) {
    $location.url(link);
  };

  $home.today = Date.now();

  $interval(function() {
    $home.today = Date.now();  

  }, 60000);

  $scope.scrollUp = function() {
    $window.scrollTo(0, 0);
  };
  

  $home.toggleNav = SpaNavigation.toggleNav;

  return $home;
}).directive('homedrag', function($log) {
  return {
    'link': function(scope, element) { 
      var el = element[0];

      /*global event*/
      function cancelDrop(e) {
        e = e || event;
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();

        return false;        
      }

      el.addEventListener('dragover', cancelDrop, false);      
      el.addEventListener('drop', cancelDrop, false);            
      el.addEventListener('dragenter', cancelDrop, false);
    }
  };
});

