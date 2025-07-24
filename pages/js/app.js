    /*global angular,window*/
window.module = {};
window.logging = {
  'withLogger': function() {}
};

angular.module('vdo.spa', [ 'ngRoute', 'ngFileUpload', 'ng-fusioncharts', 'ui.calendar', 'ui.bootstrap', 'ui.mask', 'ui.utils.masks', 'ngSanitize', 'ui.select' ])
  .run(function($rootScope, $log, $http, InitService, $templateCache) { 
 
 FusionCharts.options.license({
    key: 'mB-16A7C-13f1nA3H2C2B1C2A5E6D5A4C4I2D1A4juwE2B4G1C-7G1A7C8rqg1C4D1I4njyB5D6D3bzfG2C9A4C6A1B4A1C3D1J2B3yqsD1B1ZA33egvD8D5B4oC-8D3QA16A7jteE3A3H2E3A9C10A5C3B4B3A2A2A2C2B-16==',
    creditLabel: false
  });

  FusionCharts.addEventListener('beforeInitialize', function (opts) {
    opts.sender.options.dataEmptyMessage = "Sem dados para exibir.";
  });
  
 

  $rootScope.pages = {
    'home': {}
  };
  
  $rootScope.spa = {
    'sessionId': Number(Date.now() - 946684800000).toString(16),
    'template_version': 'unknown',
    'home': {
      'link': '/'
    },
    'ready': true,
    'pending_changes': true,
    'page': $rootScope.pages.home
  };
  
  
  
  $rootScope.navbar = [
    $rootScope.pages.home,
    $rootScope.pages.maps    
  ];

  
  $rootScope.$watch('spa.template_version', function(val) {
    if (val == 'dev') $rootScope.spa.template_version = $rootScope.spa.sessionId;
  });

  InitService.init($rootScope.spa);
  
}).config(function($httpProvider) {
  $httpProvider.interceptors.push("noCacheInterceptor");
  $httpProvider.interceptors.push("activeSessionInterceptor");
  
}).factory("activeSessionInterceptor", [ "$q", "$log", "$rootScope", "$window", "$timeout", function ($q, $log, $rootScope, window, $timeout) {

  return {
    'request': function(config) {
      if ($rootScope.spa.locked) throw 'error.session.locked';
      
      return config;
    },
    'responseError': function(rejection) {
      $log.error('[activeSessionInterceptor] responseError - status: %o \r\n%o', rejection.status, rejection);
      if (rejection.status == '504') {
        $rootScope.spa.timeout = true;
        
        
        
      } else if (rejection.status == '401' && !$rootScope.spa.locked) {  
        $rootScope.spa.locked = true;
        
      }
      
      return $q.reject(rejection);
    }
  };
  
}]).factory("noCacheInterceptor", [ "$log", "$injector", "$rootScope", function ($log, $injector, $rootScope) {
  var noCacheFolders = ["forms"];

  var shouldApplyNoCache = function (config) {
    
    // The logic in here can be anything you like, filtering on
    // the HTTP method, the URL, even the request body etc.
    for (var i = 0; i < noCacheFolders.length; i++) {
      var folder = noCacheFolders[i];
      if (config.url.indexOf('/' + folder + '/') > -1) {
        return true;
      }
    }
    return false;
  };

  var applyNoCache = function (config) {
    if (config.url.indexOf("?") !== -1) {
      config.url += "&";
    } else {
      config.url += "?";
    }
    
    config.url += "_=" + $rootScope.spa.template_version;
  };

  return {
    'request': function (config) {
      
      var nocache = shouldApplyNoCache(config);
      // $log.debug('shouldApplyNoCache - url: %s, result: %s', config.url, nocache);
    
      
      if (nocache) applyNoCache(config);

      return config;
    }
  };
  
}]);

