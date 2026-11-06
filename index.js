
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'neon-blue': '#00f7ff',
                'neon-cyan': '#00ffff',
                'neon-teal': '#00ffea',
                'dark-bg': '#0a0f1f',
                'glass': 'rgba(255, 255, 255, 0.1)'
            },
            fontFamily: {
                'poppins': ['Poppins', 'sans-serif']
            },
            boxShadow: {
                'neon': '0 0 15px rgba(0, 247, 255, 0.5)',
                'neon-hover': '0 0 20px rgba(0, 247, 255, 0.8)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.2)'
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' }
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let certificateTrigger = null;

    const closeCertificateModal = () => {
        const modal = document.querySelector('.certificate-modal');
        if (!modal) return;

        modal.remove();
        document.body.style.overflow = '';
        certificateTrigger?.focus();
        certificateTrigger = null;
    };

    const openCertificateModal = (path, title, trigger) => {
        closeCertificateModal();
        certificateTrigger = trigger;

        const isPdf = path.toLowerCase().endsWith('.pdf');
        const modal = document.createElement('div');
        modal.className = 'certificate-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'certificate-modal-title');

        const viewer = isPdf
            ? `<iframe src="${path}#view=FitH" title="${title}"></iframe>`
            : `<img src="${path}" alt="${title}">`;

        modal.innerHTML = `
            <div class="certificate-modal__dialog">
                <div class="certificate-modal__header">
                    <h2 id="certificate-modal-title" class="certificate-modal__title">${title}</h2>
                    <button type="button" class="certificate-modal__close" aria-label="Close certificate viewer">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="certificate-modal__body">${viewer}</div>
            </div>`;

        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeCertificateModal();
        });
        modal.querySelector('.certificate-modal__close').addEventListener('click', closeCertificateModal);
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        modal.querySelector('.certificate-modal__close').focus();
    };

    document.querySelectorAll('[data-certificate]').forEach((button) => {
        button.addEventListener('click', () => {
            openCertificateModal(button.dataset.certificate, button.dataset.title || 'Certificate', button);
        });
    });

    document.addEventListener('keydown', (event) => {
        const modal = document.querySelector('.certificate-modal');
        if (!modal) return;

        if (event.key === 'Escape') closeCertificateModal();
        if (event.key === 'Tab') {
            event.preventDefault();
            modal.querySelector('.certificate-modal__close').focus();
        }
    });
});
