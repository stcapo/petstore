document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');

    loginBtn.addEventListener('click', function() {
        // 清空之前的消息
        loginMessage.textContent = '';
        
        // 获取用户输入
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // 简单表单验证
        if (!username || !password) {
            loginMessage.textContent = '用户名和密码不能为空';
            return;
        }
        
        // 登录请求数据
        const loginData = {
            username: username,
            password: password
        };
        
        // 发送登录请求
        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('登录失败，用户名或密码错误');
            }
            return response.json();
        })
        .then(data => {
            // 保存用户信息到 sessionStorage
            sessionStorage.setItem('userId', data.id);
            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('userRole', data.role);
            
            // 登录成功，跳转到主页
            window.location.href = '/static/index.html';
        })
        .catch(error => {
            console.error('登录错误:', error);
            loginMessage.textContent = error.message || '登录失败，请稍后重试';
        });
    });

    // 添加键盘事件，支持回车登录
    passwordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            loginBtn.click();
        }
    });
}); 