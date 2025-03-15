document.addEventListener('DOMContentLoaded', function() {
    // 如果用户已登录，则重定向到首页
    const userId = localStorage.getItem('userId');
    if (userId) {
        window.location.href = '/static/shop/index.html';
        return;
    }
    
    // 获取登录表单并添加事件监听
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const loginMessage = document.getElementById('loginMessage');
        
        // 验证表单
        if (!username || !password) {
            loginMessage.textContent = '用户名和密码不能为空';
            return;
        }
        
        // 清空错误信息
        loginMessage.textContent = '';
        
        // 准备登录数据
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
            // 登录成功，保存用户信息到localStorage
            localStorage.setItem('userId', data.id);
            localStorage.setItem('username', data.username);
            localStorage.setItem('userRole', data.role);
            
            // 跳转到首页
            window.location.href = '/static/shop/index.html';
        })
        .catch(error => {
            console.error('登录错误:', error);
            loginMessage.textContent = error.message || '登录失败，请稍后重试';
        });
    });
}); 