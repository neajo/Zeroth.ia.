// ===== ATUALIZAÇÃO NO script.js =====

// No formulário de LOGIN (procure por esta parte):
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
            showNotification('❌ E-mail ou senha incorretos!', 'error');
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
        
        showNotification(`✅ Bem-vindo de volta, ${user.name}!`, 'success');
        
        // Efeito de transição
        document.body.style.opacity = '0.7';
        document.body.style.transform = 'scale(0.95)';
        document.body.style.transition = 'all 0.5s ease';
        
        // ⚡ ALTERAÇÃO AQUI: Mudar de pagina1.html para chat.html
        setTimeout(() => {
            window.location.href = 'chat.html';  // Alterado!
        }, 1000);
    });
}

// No formulário de REGISTRO (procure por esta parte):
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
            showNotification('❌ As senhas não coincidem!', 'error');
            resetButton(submitBtn, originalText);
            return;
        }
        
        if (password.length < 8) {
            showNotification('❌ A senha deve ter pelo menos 8 caracteres!', 'error');
            resetButton(submitBtn, originalText);
            return;
        }
        
        const users = getUsers();
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            showNotification('⚠️ Este e-mail já está registrado!', 'warning');
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
        
        showNotification('🎉 Conta criada com sucesso!', 'success');
        registerForm.reset();
        
        // Mostrar efeito de confete
        createConfetti();
        
        // Salvar sessão automaticamente (login automático)
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            userId: newUser.id,
            email: newUser.email,
            name: newUser.name,
            loggedIn: true,
            timestamp: Date.now()
        }));
        
        // ⚡ ALTERAÇÃO AQUI: Redirecionar para chat.html após 2 segundos
        setTimeout(() => {
            document.body.style.opacity = '0.7';
            document.body.style.transform = 'scale(0.95)';
            document.body.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                window.location.href = 'chat.html';  // Alterado!
            }, 500);
            
            resetButton(submitBtn, originalText);
        }, 2000);
    });
}
