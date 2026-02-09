// Sistema de autenticação com localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Alternar entre formulários de login e registro
    const registerSection = document.getElementById('register');
    const loginSection = document.getElementById('login');
    const switchLinks = document.querySelectorAll('.switch-link');
    
    // Verificar qual formulário mostrar baseado no hash da URL
    if (window.location.hash === '#login') {
        if (registerSection) registerSection.classList.remove('active');
        if (loginSection) loginSection.classList.add('active');
    } else if (window.location.hash === '#register') {
        if (loginSection) loginSection.classList.remove('active');
        if (registerSection) registerSection.classList.add('active');
    }
    
    // Adicionar event listeners para os links de alternância
    switchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            if (target === '#login') {
                if (registerSection) registerSection.classList.remove('active');
                if (loginSection) loginSection.classList.add('active');
            } else if (target === '#register') {
                if (loginSection) loginSection.classList.remove('active');
                if (registerSection) registerSection.classList.add('active');
            }
            
            // Atualizar o hash da URL
            window.location.hash = target;
            
            // Scroll suave para o formulário
            const targetElement = document.querySelector(target);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
    
    // Sistema de armazenamento de usuários
    const STORAGE_KEY = 'zeroth_users';
    const SESSION_KEY = 'zeroth_session';
    
    // Obter usuários do localStorage
    function getUsers() {
        const users = localStorage.getItem(STORAGE_KEY);
        return users ? JSON.parse(users) : [];
    }
    
    // Salvar usuários no localStorage
    function saveUsers(users) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
    
    // Formulário de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirm').value;
            
            // Validações
            if (password !== confirmPassword) {
                alert('As senhas não coincidem.');
                return;
            }
            
            if (password.length < 8) {
                alert('A senha deve ter pelo menos 8 caracteres.');
                return;
            }
            
            const users = getUsers();
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                alert('Este e-mail já está registrado. Faça login ou use outro e-mail.');
                return;
            }
            
            // Criar hash simples da senha (em produção usar bcrypt)
            const hashedPassword = btoa(password);
            
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            saveUsers(users);
            
            // Mostrar mensagem de sucesso
            alert('Conta criada com sucesso! Agora você pode fazer login.');
            
            // Limpar formulário
            registerForm.reset();
            
            // Mudar para o formulário de login
            if (registerSection) registerSection.classList.remove('active');
            if (loginSection) loginSection.classList.add('active');
            window.location.hash = '#login';
        });
    }
    
    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;
            
            const users = getUsers();
            const user = users.find(u => u.email === email);
            
            // Verificar credenciais
            if (!user || btoa(password) !== user.password) {
                alert('E-mail ou senha incorretos.');
                return;
            }
            
            // Criar sessão
            const session = {
                userId: user.id,
                email: user.email,
                name: user.name,
                loggedIn: true,
                timestamp: Date.now()
            };
            
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
            
            // Redirecionar para pagina1.html
            alert(`Bem-vindo de volta, ${user.name}! Redirecionando...`);
            window.location.href = 'pagina1.html';
        });
    }
    
    // Verificar se já está logado
    const currentSession = sessionStorage.getItem(SESSION_KEY);
    if (currentSession) {
        const session = JSON.parse(currentSession);
        // Verificar se a sessão ainda é válida (1 hora)
        if (Date.now() - session.timestamp < 3600000) {
            console.log(`Usuário logado: ${session.name}`);
            
            // Se estiver na página inicial, sugerir redirecionamento
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                if (confirm(`Olá ${session.name}! Deseja ir para a página principal?`)) {
                    window.location.href = 'pagina1.html';
                }
            }
        } else {
            // Sessão expirada
            sessionStorage.removeItem(SESSION_KEY);
        }
    }
    
    // Smooth scroll para âncoras internas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#0') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Efeito de digitação no hero (se existir)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Iniciar após 1 segundo
        setTimeout(typeWriter, 1000);
    }
    
    // Efeito de hover nas feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
