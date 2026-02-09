// ===== CONFIGURAÇÃO INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar loading screen
    initLoadingScreen();
    
    // Inicializar partículas
    initParticles();
    
    // Inicializar animações
    initAnimations();
    
    // Sistema de login/registro
    initAuthSystem();
    
    // Sistema de navegação
    initNavigation();
    
    // Efeitos especiais
    initSpecialEffects();
});

// ===== SISTEMA DE AUTENTICAÇÃO ATUALIZADO =====
function initAuthSystem() {
    const STORAGE_KEY = 'zeroth_users';
    const SESSION_KEY = 'currentUser'; // Chave atualizada
    
    // Elementos do DOM
    const registerSection = document.getElementById('register');
    const loginSection = document.getElementById('login');
    const switchLinks = document.querySelectorAll('.switch-link');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    // Alternar entre formulários
    if (switchLinks) {
        switchLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                if (this.getAttribute('href') === '#login') {
                    hideElement(registerSection);
                    showElement(loginSection);
                } else {
                    hideElement(loginSection);
                    showElement(registerSection);
                }
                scrollToElement(registerSection);
            });
        });
    }
    
    // Funções de animação
    function hideElement(element) {
        if (!element) return;
        element.classList.remove('active');
    }
    
    function showElement(element) {
        if (!element) return;
        element.classList.add('active');
    }
    
    function scrollToElement(element) {
        if (!element) return;
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    // Gerenciamento de usuários
    function getUsers() {
        const users = localStorage.getItem(STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    }
    
    function saveUsers(users) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
    
    // Formulário de registro
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';
            submitBtn.disabled = true;
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirm').value;
            
            // Validações
            if (password !== confirmPassword) {
                alert('❌ As senhas não coincidem!');
                resetButton(submitBtn, originalText);
                return;
            }
            
            if (password.length < 8) {
                alert('❌ A senha deve ter pelo menos 8 caracteres!');
                resetButton(submitBtn, originalText);
                return;
            }
            
            const users = getUsers();
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                alert('⚠️ Este e-mail já está registrado!');
                resetButton(submitBtn, originalText);
                return;
            }
            
            // Criar novo usuário
            const hashedPassword = btoa(password);
            const newUser = {
                id: generateId(),
                name,
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                plan: 'free',
                status: 'active'
            };
            
            users.push(newUser);
            saveUsers(users);
            
            alert('🎉 Conta criada com sucesso!');
            registerForm.reset();
            
            // Salvar sessão automaticamente (login automático)
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({
                userId: newUser.id,
                email: newUser.email,
                name: newUser.name,
                loggedIn: true,
                timestamp: Date.now()
            }));
            
            // Redirecionar para chat.html
            setTimeout(() => {
                document.body.style.opacity = '0.7';
                document.body.style.transform = 'scale(0.95)';
                document.body.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    window.location.href = 'chat.html'; // REDIRECIONAMENTO PARA CHAT
                }, 500);
                
                resetButton(submitBtn, originalText);
            }, 2000);
        });
    }
    
    // Formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
            submitBtn.disabled = true;
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;
            
            const users = getUsers();
            const user = users.find(u => u.email === email);
            
            if (!user || btoa(password) !== user.password) {
                alert('❌ E-mail ou senha incorretos!');
                resetButton(submitBtn, originalText);
                return;
            }
            
            // Salvar sessão
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({
                userId: user.id,
                email: user.email,
                name: user.name,
                loggedIn: true,
                timestamp: Date.now()
            }));
            
            alert(`✅ Bem-vindo de volta, ${user.name}!`);
            
            // Efeito de transição
            document.body.style.opacity = '0.7';
            document.body.style.transform = 'scale(0.95)';
            document.body.style.transition = 'all 0.5s ease';
            
            // Redirecionar para chat.html
            setTimeout(() => {
                window.location.href = 'chat.html'; // REDIRECIONAMENTO PARA CHAT
            }, 1000);
        });
    }
    
    // Verificar sessão atual
    const currentSession = sessionStorage.getItem(SESSION_KEY);
    if (currentSession && !window.location.pathname.endsWith('index.html')) {
        const session = JSON.parse(currentSession);
        if (Date.now() - session.timestamp < 3600000) {
            console.log(`Usuário logado: ${session.name}`);
        }
    }
}

// ===== FUNÇÕES AUXILIARES =====
function resetButton(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ===== FUNÇÕES BÁSICAS =====
function initLoadingScreen() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = `
        <div class="loader"></div>
    `;
    document.body.appendChild(loading);
    
    setTimeout(() => {
        loading.classList.add('hidden');
        setTimeout(() => {
            loading.remove();
        }, 500);
    }, 1500);
}

function initAnimations() {
    // Observer para animar elementos quando entram na viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .form-section, .content-section, .tech-item').forEach(el => {
        observer.observe(el);
    });
}

function initNavigation() {
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#0') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Ativar link atual na navegação
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function initSpecialEffects() {
    // Efeito de hover nas cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 20px 40px rgba(0, 255, 213, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
}

function initParticles() {
    // Configuração básica de partículas
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#00ffd5" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00ffd5",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }
}
