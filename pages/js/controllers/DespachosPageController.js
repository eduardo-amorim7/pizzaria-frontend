/*global angular,$,addInteraction,L,document*/
angular.module('vdo.spa')
    .controller('DespachosPageController', function ($scope, $rootScope, $timeout, $http, $log, $filter, Upload, $window, $compile, $q, debounce, MapsLayerService, $location, $route, $routeParams) {


        var options = {
            'interval': 65000
        };

        var $reportspeeding = this;

        var $map = {
            'geoJSON': null,
            'options': {
                'marker_type': $window.localStorage.getItem("vdofts_localization_markertype") || "icon",
                'map_type': $window.localStorage.getItem("vdofts_localization_maptype") || "default"
            }
        };

        var lastRoute = $route.current;

        $scope.vm = {
            'active': { 'id': $routeParams.id, 'slug': $routeParams.slug }
        };


$scope.pedidos = [
  { id: '306', origem: 'SITE', hora: '20:49', tempo: 42 },
  { id: '307', origem: 'IFOOD', hora: '20:56', tempo: 34 },
  { id: '310', origem: 'SITE', hora: '21:00', tempo: 31 },
  // ...
];

$scope.entregadores = [
  { nome: 'Lucas Pereira', status: 0 },
  { nome: 'Yuri', status: 1 },
  { nome: 'Eduardo', status: 2 },
  // ...
];


        $scope.getStyle = function () {
            return { 'display': $scope.mode === 'M' ? 'none' : 'block' };
        };


        $scope.back = function (id, slug) {
            /*global history*/
            $location.path('/routes');
        };
    

        function findPositions() {
             $scope.loadingPositions = true


          $timeout(function (  ) {$scope.loadingPositions = false; }, 700);
          

        }


        $scope.$map = $map;
        $scope.enableMapMeasure = null;
        $scope.$watch('enableMapMeasure', function (newValue, oldValue) {
            if (newValue == true) addInteraction();
        });

        $reportspeeding.ready = false;
        $scope.selecteds = {};
        $scope.data = {};
        $scope.account = {};
        $scope.admin = false;
        $scope.invalidDate = false;
        $scope.allreadyLoad = false;

        $reportspeeding.fields = {};
        $reportspeeding.fields.report = false;
        $reportspeeding.fields = {
            datestart: new Date(),
            dateend: new Date()
        };


        $(document).on('nav:toggled', function (evt) {
            if ($map.el) $window.setTimeout(function () { $map.el.invalidateSize(); }, 100);
        });

        $scope.mapToggleFullScreen = function () {
            $map.el.isFullscreen(); // Is the map fullscreen?
            $map.el.toggleFullscreen(); // Either go fullscreen, or cancel the existing fullscreen.
        };

        $scope.openGoogleMaps = function (params) {
            var zoom = $map.el.getZoom();

            if (!params) {
                var center = $map.el.getCenter();
                $window.open("https://www.google.com/maps/@" + center.lat + "," + center.lng + "," + zoom + "z");
            } else {
                $window.open("https://www.google.com/maps/place/" + params.lat + ",+" + params.lng + "/@" + params.lat + "," + params.lng + "," + zoom + "z");
            }
        };

        function startInterval() {
            $window.requestAnimationFrame(function () {

                $scope.$apply(function () {
                    findPositions();
                });

            });
        }

        $scope.$on("$destroy", function () {
            startInterval.cancel = true;
        });


        $scope.exitFollowMode = function (marker) {
            $scope.navListToggle(true);

            $scope.followmode = null;

            for (var i = 0; i < $scope.vehicles.length; i++) {
                var site = $scope.vehicles[i];
                for (var j = 0; j < site.items.length; j++) {
                    var vehicle = site.items[j];
                    vehicle.selected = false;
                }
            }

        };

        $scope.zoomTo = function (lat, lng) {
            if ($scope.followmode && $scope.followmode.zoom) return;

            $map.el.setView(new L.LatLng(lat, lng), 15);

            if ($scope.followmode)
                $scope.followmode.zoom = true;

        };


        $scope.plotMarkers = function (markerType, firstLoad) {
            if (!$map.geoJSON) return;

            if ($scope.rotas) {

            }

            $scope.allreadyLoad = true;

        };


        $scope.changeMarker = function (markerType) {
            if (markerType == $map.markerType) return;

            $map.el.removeLayer($scope.markers);
            $window.localStorage.setItem("vdofts_localization_markertype", markerType);
            $map.options.marker_type = markerType;
            $scope.plotMarkers(markerType);
        };

        $scope.enableSearchComponent = function () {
            var geocoder = new L.Control.Geocoder.Nominatim();
            var control = L.Control.geocoder({
                geocoder: geocoder,
                collapsed: true,
                queryMinLength: 2,
                suggestMinLength: 3,
                suggestTimeout: 150,
                placeholder: 'label.search',
                errorMessage: 'label.navbar.distributor.notfound',
                defaultMarkGeocode: false
            }).on('markgeocode', function (e) {
                var bbox = e.geocode.bbox;
                $map.el.fitBounds(bbox);
                $map.el.setZoom(16); // Mantem o zoom no level 15 apos achar a localizacao
            }).addTo($map.el);
        };


        function initMaps() {

            return $q(function (resolve, reject) {

                $map.el = L.map('map', {
                    minZoom: 2,
                    maxZoom: 18,
                    zoomControl: false,
                    trackResize: true,
                    gestureHandling: true,
                    attributionControl: false,
                    measureControl: false,
                    center: [-15.872044, -48.066113]
                });

                $scope.plotMarkers($map.options.marker_type, true);

                $scope.enableSearchComponent();

                L.control.zoom({
                    zoomInTitle: 'label.leafletmap.control.zoomin',
                    zoomOutTitle: 'label.leafletmap.control.zoomout'
                }).addTo($map.el);

            /*   L.control.measure({ 'keyboard': false }).addTo($map.el);
                $('.leaflet-control-measure').attr('title', 'label.leafletmap.control.measure');
                $('.leaflet-control-geocoder-icon').attr('title', 'label.search'); */

                $map.el.setView(new L.LatLng(-15.872044, -48.066113), 14);

                $map.el.dragging.enable();


                resolve();

            });
        }

        $scope.repositionLayers = function () {
            $scope.plotMarkers($map.options.marker_type, false);
        };

        if (typeof $scope.vm.active.id == 'undefined') {
            initMaps().then(startInterval);

            var modalBackdrops = document.querySelectorAll('.modal-backdrop');

            var bodyElement = document.body;
            bodyElement.style.overflow = '';
            bodyElement.style.paddingRight = '';

            if (modalBackdrops && modalBackdrops.length > 0) {
                modalBackdrops.forEach(function (modalBackdrop) {
                    modalBackdrop.style.display = 'none';
                });
            }
        } else {
            
        }

        return $reportspeeding;
    });

