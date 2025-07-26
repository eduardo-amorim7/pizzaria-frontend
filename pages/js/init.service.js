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
            },
            {
            'id': 'pedidos',
            'path': '/pedidos',
            'template' : '/static/forms/pedidos',
            'controller': 'PedidosPageController',
            'group': 'bus_control',
            'title': 'Pedidos',
            'icon': 'pli-list-view',
            'edit': false
            },{
            'id': 'despachos',
            'path': '/despachos',
            'template' : '/static/forms/despachos',
            'controller': 'DespachosPageController',
            'group': 'bus_control',
            'title': 'Despacho',
            'icon': 'pli-map-2',
            'edit': false
            },{
            'id': 'clientes',
            'path': '/clientes',
            'template' : '/static/forms/clientes',
            'controller': 'ClientesPageController',
            'group': 'bus_control',
            'title': 'Clientes',
            'icon': 'pli-address-book',
            'edit': false
            },
            {
            'id': 'usuarios',
            'path': '/usuarios',
            'template' : '/static/forms/usuarios',
            'controller': 'UsuariosPageController',
            'group': 'bus_control',
            'title': 'Usuários',
            'icon': 'pli-male',
            'edit': false
            },
            {
            'id': 'entregadores',
            'path': '/entregadores',
            'template' : '/static/forms/entregadores',
            'controller': 'EntregadoresPageController',
            'group': 'bus_control',
            'title': 'Entregadores',
            'icon': 'pli-motorcycle',
            'edit': false
            },{
            'id': 'relatorios',
            'path': '/relatorios',
            'template' : '/static/forms/relatorios',
            'controller': 'RelatoriosPageController',
            'group': 'bus_control',
            'title': 'Relatórios',
            'icon': 'pli-file-text-image',
            'edit': false
            },
            {
            'id': 'configuracoes',
            'path': '/configuracoes',
            'template' : '/static/forms/configuracoes',
            'controller': 'ConfiguracoesPageController',
            'group': 'bus_control',
            'title': 'Configurações',
            'icon': 'pli-gear',
            'edit': false
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