angular.module('pizzariaApp').service('ToastService', ['$rootScope', function($rootScope) {
    
    function showToast(type, message) {
        const toast = {
            type: type,
            message: message,
            timestamp: new Date()
        };
        
        $rootScope.$broadcast('toast:show', toast);
    }

    return {
        success: function(message) {
            showToast('success', message);
        },

        error: function(message) {
            showToast('error', message);
        },

        warning: function(message) {
            showToast('warning', message);
        },

        info: function(message) {
            showToast('info', message);
        }
    };
}]);

