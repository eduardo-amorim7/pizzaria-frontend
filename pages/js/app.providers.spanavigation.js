/*global angular*/
angular.module('vdo.spa').provider('SpaNavigation', function($routeProvider, $windowProvider) {
  
  
  var $this = {
    'routes': [],
    'groups': {}
  };
  
  
  function initResolver(view) {
    return {
      'init': [ 'InitService', '$log', '$rootScope', function(Init, $log, $rootScope) {
        $rootScope.spa.active = view.id;
        $rootScope.spa.edit_page = view.edit;
        return Init.promise;
      }]
    };
  }   
  
  function getNavOptions() {
    var $window = $windowProvider.$get();
    if (!$window) return {};    
    if (!$window.localStorage) return {};
    
    var s_opts = $window.localStorage.getItem('vdo.mainnav.opts');
    if (!s_opts) s_opts = '{}';
    
    return JSON.parse(s_opts);    
  }
  
  function setNavOptions(opts) {
    var $window = $windowProvider.$get();
    if (!$window) return {};    
    if (!$window.localStorage) return {};
    
    $window.localStorage.setItem('vdo.mainnav.opts', JSON.stringify(opts));    
  }
  
  function getNavToggle(opt, stdval) {
    var opts = getNavOptions();
    opt = 'toggle.'+(opt.toLowerCase().replaceAll(/[^a-z]/g, '_'));
    
    if (opts[opt] == null) opts[opt] = stdval;
    
    return !!opts[opt];    
  }
  
  function setNavToggle(opt, val) {
    var opts = getNavOptions();
    opt = 'toggle.'+(opt.toLowerCase().replaceAll(/[^a-z]/g, '_'));
    
    /*
    if (!val) {
      delete opts[opt];  
    } else {
      opts[opt] = val;
    }
    */    
    opts[opt] = val;
    
    setNavOptions(opts);
  }
  
  $this.addRoute = function(route) {    
    $routeProvider.when(route.path, {
      'templateUrl' : route.template,
      'controller': route.controller,
      'controllerAs': '$page',
      'resolve': initResolver(route)      
    });    
    
    $this.routes.push(route);    
    
    if (!route.group) return;
    
    if (!$this.groups[route.group]) {
      $this.groups[route.group] = {
        'title': route.group,
        'routes': []
      };
      
      $this.groups[route.group].open = getNavToggle(route.group, true);      
    }
    
    $this.groups[route.group].routes.push(route);
    
    
  };
  
  $this.setDefault = function(path) {
    $routeProvider.otherwise({ 
      'redirectTo': path 
    });    
  };
  
  $this.toggleNav = function(item, toggle) {
    item.open = toggle !== undefined ? toggle : !item.open;    
    setNavToggle(item.title, item.open);
    // $log.warn(item);    
  };  
  
  
  
  this.$get = function() {
    return $this;
  };
  
  
}).run(function(SpaNavigation, $rootScope) {
  $rootScope.nav = SpaNavigation;
  
});

