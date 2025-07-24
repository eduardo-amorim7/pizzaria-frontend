/*global angular*/
angular.module('vdo.spa').service('InitService', function ($log, $q, $http, $rootScope, $timeout, $route, $window, SpaNavigation, $sce) {
    var d = $q.defer();

    function done(vm) {
        $timeout(function () {
            vm.loaded = true;
        }, 50);

        d.resolve();
        $route.reload();

    }

    function ctx(vm) {
          vm.user = {
                'name': "Eduardo",
                'email': "edu@teste.com",
                'slug': "ds_slug_edu293",
                'language': "pt-br",
                'roles': []
            };

            return vm;
    }



    function routes(vm) {
        $log.debug('::vm ', vm);

        /* return $http.get('/api/context/v1/routes.json?_='+$rootScope.spa.sessionId).then(function(result) {
        
        }); */

        var routes = [
            {
                "id": "home",
                "path": "/home",
                "template": "/static/forms/home", 
                "controller": "MainPageController",
                "group": "bus_control",
                "title": "Visão Geral",
                "icon": "pli-bar-chart-4",
                "edit": false
            }
        ];
        routes.forEach(SpaNavigation.addRoute);

        SpaNavigation.setDefault(routes[0].path);


        return vm;

    }



    return {
      /*  'init': function (vm) {
            return ctx(vm).then(routes).then(function () {
                $rootScope.$broadcast('rotasCarregadas');
                done(vm);
            });
        }, */
        'init': function (vm) {

            ctx(vm);
            routes();
            $rootScope.$broadcast('rotasCarregadas');
            done(vm);
                
          
        }, 
        'promise': d.promise
    };
});