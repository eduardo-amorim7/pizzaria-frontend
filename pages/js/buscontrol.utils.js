angular.module('vdo.spa').service('BusControlUtils', function() {
    this.formatDate = function(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString('pt-BR');
    };
    
    this.formatCurrency = function(value) {
        if (!value) return 'R$ 0,00';
        return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',');
    };
});

