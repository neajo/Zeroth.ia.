// Adicione no início do script.js existente

// Efeito de smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Validação de formulário aprimorada
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[0-9]/.test(password);
}

// Feedback visual para validação
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            this.classList.add('filled');
        } else {
            this.classList.remove('filled');
        }
    });
});

// Efeito de loading no botão
function showLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    button.disabled = true;
    return originalText;
}

function hideLoading(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}
