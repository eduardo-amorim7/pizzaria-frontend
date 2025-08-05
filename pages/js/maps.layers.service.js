/*global angular*/
angular.module('vdo.spa').controller('MapLayerController', function(MapsLayerService, $log, $scope, debounce) {
  var $maplayer = this;
  
  $log.debug('MapLayerController::init');
  
  var $defered = MapsLayerService.getAvailableLayers().then(function(layers) {
    $maplayer.layers = layers;
  });
  
  MapsLayerService.getAvailableMarkers().then(function(markers) {
    $maplayer.markers = markers;
  });
  
  
  
  $maplayer.activate = function(layer, $map) {
    $log.debug('MapLayerController::activate - layer: %s, $map: %p', layer.id, $map);
    
    for(var k in $maplayer.layers) {
      $maplayer.layers[k].active = false;
    }    
    layer.active = true;
    
    MapsLayerService.setLayer(layer, $map);    
    MapsLayerService.initLayer(layer, $map);
  };
  
  $maplayer.init = function($map) {
    if (!$maplayer.layers) return $defered.then(function() {
      $maplayer.init($map);
    });
    
    for(var k in $maplayer.layers) {
      if ($maplayer.layers[k].active) {
        return MapsLayerService.initLayer($maplayer.layers[k], $map);
      }
    }    
    
    return false;
  };
  
  var init = false;

  $scope.$watch('$map.el', debounce(function(val, oldval) {
    if (init || !$scope.$map || !$scope.$map.el) return;   
    if (!$maplayer.init($scope.$map)) return;
    
    init = true;
  }, 500));
  
  return $maplayer; 
  
}).service('MapsLayerService', function($rootScope, $log, $window, $http, $q) {
  var MapsLayerService = this;
  
  var DEFAULT_SELECTED_LAYERID = 'default';
  
  function getDefaultLayerId() {
    try {
      return $window.localStorage.getItem('vdo.spa.maps.layers.default') || DEFAULT_SELECTED_LAYERID;
      
    } catch(e) {
      $log.error('MapsLayerService::getDefaultLayerId - error: %s', e.message || e);      
      return DEFAULT_SELECTED_LAYERID;
    }
  }
  
  function setDefaultLayerId(layer) {
    try {
      return $window.localStorage.setItem('vdo.spa.maps.layers.default', layer);
      
    } catch(e) {
      $log.error('MapsLayerService::setDefaultLayerId - error: %s', e.message || e);      
      return DEFAULT_SELECTED_LAYERID;
    }
  }  
  
  var availableLayers;
  
   MapsLayerService.getAvailableLayers = function() {
    
    return $http.get('/context/v1/maptiles.json').then(function(result) {
    
      var layers = [];
      var defaultLayer = getDefaultLayerId();

      var hasActiveLayer = false;
      availableLayers = result.data;
      
      for(var k in availableLayers) {
        layers.push({
          'id': k,
          'icon': availableLayers[k].icon,
          'title': availableLayers[k].title,
          'active': defaultLayer === k
        });

        hasActiveLayer = hasActiveLayer || defaultLayer === k;
      }

      if (!hasActiveLayer) layers[0].active = true;

      return layers;
    });
      
    
  };
  
  MapsLayerService.setLayer = function(layer, $map) {
    setDefaultLayerId(layer.id);
  };
  
  MapsLayerService.initLayer = function(layer, $map) {
    
    /*global L*/
    try {
      if (typeof $map === 'undefined') return;      
      if (typeof $map.el === 'undefined') return;
      if (typeof L === 'undefined') return;

      $log.debug('MapsLayerService::initLayer - layer: %s', layer.id);
      
      if ($map.layers && $map.layers.length > 0) {
        $map.el.removeLayer($map.layers[0]);
      }

      var layer_url = MapsLayerService.getLayerURL(layer.id);
      $map.el.addLayer(L.tileLayer(MapsLayerService.getLayerURL(layer.id)));

      return true;
    } catch(e) {
      $log.error('MapsLayerService::activate - error: $e', e.message||e);
      
      return false;
    }        
  };
  
  
  MapsLayerService.getLayerURL = function(id) {
    return availableLayers[id].url;    
  };
  
  MapsLayerService.getAvailableMarkers = function() {
    
    var availableMarkers = [{
      'id': 'icon',
      'icon': 'pli-car-2',
      'title': 'label.fts.localization.markers.icon'
    },{
      'id': 'plate',
      'icon': 'pli-razor-blade',
      'title': 'label.fts.localization.markers.plate'
    },{
      'id': 'icon_plate',
      'icon': 'pli-razor-blade',
      'title': 'label.fts.localization.markers.icon_plate'
    },{
      'id': 'alias',
      'icon': 'pli-razor-blade',
      'title': 'label.fts.localization.markers.alias'
    },{
      'id': 'icon_alias',
      'icon': 'pli-razor-blade',
      'title':'label.fts.localization.markers.icon_alias'
    }];
    
    return $q(function(resolve, reject) {
      resolve(availableMarkers);
      
    });
  };
  
  // $rootScope.vm.maps
  function init() { 
    var $maps = {};    
    $maps.layers = MapsLayerService.getAvailableLayers();
    $maps.markers = MapsLayerService.getAvailableMarkers();
    
    $rootScope.spa.maps = $maps;
  }
  

  
  
  return MapsLayerService;

});

