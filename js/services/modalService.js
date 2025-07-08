angular.module('pizzariaApp').service('ModalService', ['$q', function($q) {
    
    // Função para criar modal de confirmação
    function createConfirmModal(title, message, confirmText, cancelText, type) {
        const deferred = $q.defer();
        
        // Criar overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-in-out;
        `;
        
        // Criar modal
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 0;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
            overflow: hidden;
        `;
        
        // Definir cores baseadas no tipo
        const typeColors = {
            danger: { bg: '#dc3545', text: 'white' },
            warning: { bg: '#ffc107', text: '#212529' },
            info: { bg: '#17a2b8', text: 'white' },
            success: { bg: '#28a745', text: 'white' },
            primary: { bg: '#007bff', text: 'white' }
        };
        
        const colors = typeColors[type] || typeColors.primary;
        
        // Criar conteúdo do modal
        modal.innerHTML = `
            <div class="modal-header" style="
                background: ${colors.bg};
                color: ${colors.text};
                padding: 20px;
                text-align: center;
            ">
                <h4 style="margin: 0; font-weight: 600;">${title}</h4>
            </div>
            <div class="modal-body" style="
                padding: 30px 20px;
                text-align: center;
                color: #333;
                line-height: 1.5;
            ">
                <p style="margin: 0; font-size: 16px;">${message}</p>
            </div>
            <div class="modal-footer" style="
                padding: 20px;
                display: flex;
                gap: 10px;
                justify-content: center;
                border-top: 1px solid #eee;
            ">
                <button class="btn-cancel" style="
                    padding: 10px 20px;
                    border: 2px solid #6c757d;
                    background: white;
                    color: #6c757d;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                ">${cancelText}</button>
                <button class="btn-confirm" style="
                    padding: 10px 20px;
                    border: 2px solid ${colors.bg};
                    background: ${colors.bg};
                    color: ${colors.text};
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                ">${confirmText}</button>
            </div>
        `;
        
        // Adicionar estilos de animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { 
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            .btn-cancel:hover {
                background: #6c757d !important;
                color: white !important;
            }
            .btn-confirm:hover {
                opacity: 0.9;
                transform: translateY(-1px);
            }
        `;
        document.head.appendChild(style);
        
        // Adicionar eventos
        const btnCancel = modal.querySelector('.btn-cancel');
        const btnConfirm = modal.querySelector('.btn-confirm');
        
        btnCancel.addEventListener('click', function() {
            closeModal();
            deferred.resolve(false);
        });
        
        btnConfirm.addEventListener('click', function() {
            closeModal();
            deferred.resolve(true);
        });
        
        // Fechar ao clicar no overlay
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal();
                deferred.resolve(false);
            }
        });
        
        // Fechar com ESC
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                closeModal();
                deferred.resolve(false);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        function closeModal() {
            document.removeEventListener('keydown', escHandler);
            overlay.style.animation = 'fadeOut 0.2s ease-in-out';
            modal.style.animation = 'slideOut 0.2s ease-in';
            
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 200);
        }
        
        // Adicionar ao DOM
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        return deferred.promise;
    }
    
    return {
        // Modal de confirmação de exclusão/cancelamento
        confirmDelete: function(itemName) {
            return createConfirmModal(
                'Confirmar Cancelamento',
                `Tem certeza que deseja cancelar ${itemName}?<br><br>Esta ação não pode ser desfeita.`,
                'Sim, Cancelar',
                'Não',
                'danger'
            );
        },
        
        // Modal de confirmação de ação
        confirmAction: function(title, message, confirmText, cancelText, type) {
            return createConfirmModal(
                title || 'Confirmar Ação',
                message || 'Tem certeza que deseja continuar?',
                confirmText || 'Confirmar',
                cancelText || 'Cancelar',
                type || 'primary'
            );
        },
        
        // Modal de confirmação para finalizar pedido
        confirmFinish: function(orderNumber) {
            return createConfirmModal(
                'Finalizar Pedido',
                `Marcar pedido #${orderNumber} como pronto?<br><br>O pedido será movido para a coluna "Prontos".`,
                'Sim, Finalizar',
                'Cancelar',
                'success'
            );
        },
        
        // Modal de confirmação para despachar pedido
        confirmDispatch: function(orderNumber) {
            return createConfirmModal(
                'Despachar Pedido',
                `Despachar pedido #${orderNumber} para entrega?<br><br>O pedido será marcado como "Despachado".`,
                'Sim, Despachar',
                'Cancelar',
                'info'
            );
        },
        
        // Modal de confirmação para entregar pedido
        confirmDeliver: function(orderNumber) {
            return createConfirmModal(
                'Confirmar Entrega',
                `Confirmar entrega do pedido #${orderNumber}?<br><br>O pedido será marcado como "Entregue".`,
                'Sim, Entregue',
                'Cancelar',
                'success'
            );
        },
        
        // Modal de aviso
        alert: function(title, message, type) {
            const deferred = $q.defer();
            
            createConfirmModal(
                title,
                message,
                'OK',
                '',
                type || 'info'
            ).then(function() {
                deferred.resolve();
            });
            
            return deferred.promise;
        }
    };
}]);

