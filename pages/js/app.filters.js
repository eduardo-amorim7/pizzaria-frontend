angular.module('vdo.spa').filter('translate', function() {
    return function(input) {
        // Simple translation filter - returns input as is for now
        return input || '';
    };
});

