angular.module('vdo.spa').provider('fusioncharts', function() {
    this.$get = function() {
        return {
            render: function(options) {
                console.log('FusionCharts render called with options:', options);
            }
        };
    };
});

