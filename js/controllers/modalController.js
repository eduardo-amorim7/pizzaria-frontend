angular.module('pizzariaApp').controller('ModalController', ['$scope', function($scope) {
    // Estado dos modais
    $scope.modals = {
        novoPedido: false,
        acoesPedido: false,
        detalhePedido: false
    };

    // Dados do pedido selecionado
    $scope.pedidoSelecionado = null;

    // Abrir modal de novo pedido
    $scope.abrirNovoPedido = function() {
        $scope.modals.novoPedido = true;
        document.body.classList.add('modal-open');
    };

    // Abrir modal de ações do pedido
    $scope.abrirAcoesPedido = function(pedido) {
        $scope.pedidoSelecionado = pedido;
        $scope.modals.acoesPedido = true;
        document.body.classList.add('modal-open');
    };

    // Abrir modal de detalhes do pedido
    $scope.abrirDetalhePedido = function(pedido) {
        $scope.pedidoSelecionado = pedido;
        $scope.modals.detalhePedido = true;
        document.body.classList.add('modal-open');
    };

    // Fechar todos os modais
    $scope.fecharModal = function() {
        $scope.modals.novoPedido = false;
        $scope.modals.acoesPedido = false;
        $scope.modals.detalhePedido = false;
        $scope.pedidoSelecionado = null;
        document.body.classList.remove('modal-open');
    };

    // Fechar modal ao clicar no overlay
    $scope.fecharModalOverlay = function(event) {
        if (event.target.classList.contains('modal-overlay')) {
            $scope.fecharModal();
        }
    };

    // Ações do pedido
    $scope.alterarStatus = function(novoStatus) {
        if ($scope.pedidoSelecionado) {
            // Aqui você faria a chamada para a API para alterar o status
            console.log('Alterando status do pedido', $scope.pedidoSelecionado.numero, 'para', novoStatus);
            $scope.pedidoSelecionado.status = novoStatus;
            $scope.fecharModal();
        }
    };

    $scope.marcarPronto = function() {
        $scope.alterarStatus('pronto');
    };

    $scope.marcarDespachado = function() {
        $scope.alterarStatus('despachado');
    };

    $scope.marcarEntregue = function() {
        $scope.alterarStatus('entregue');
    };

    $scope.cancelarPedido = function() {
        if ($scope.pedidoSelecionado && confirm('Tem certeza que deseja cancelar este pedido?')) {
            $scope.alterarStatus('cancelado');
        }
    };
}]);

