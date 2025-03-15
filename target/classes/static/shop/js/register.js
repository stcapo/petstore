document.addEventListener('DOMContentLoaded', function() {
    // 如果用户已登录，则重定向到首页
    const userId = localStorage.getItem('userId');
    if (userId) {
        window.location.href = '/static/shop/index.html';
        return;
    }
    
    // 获取注册表单并添加事件监听
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        const registerMessage = document.getElementById('registerMessage');
        
        // 验证表单
        if (!username || !password || !confirmPassword) {
            registerMessage.textContent = '所有字段都必须填写';
            return;
        }
        
        if (password !== confirmPassword) {
            registerMessage.textContent = '两次输入的密码不一致';
            return;
        }
        
        if (password.length < 6) {
            registerMessage.textContent = '密码长度至少为6个字符';
            return;
        }
        
        // 清空错误信息
        registerMessage.textContent = '';
        
        // 准备注册数据
        const registerData = {
            username: username,
            password: password,
            role: 'user' // 默认为普通用户
        };
        
        // 发送注册请求
        fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        })
        .then(response => {
            if (response.status === 400) {
                throw new Error('用户名已存在，请选择其他用户名');
            }
            if (!response.ok) {
                throw new Error('注册失败，请稍后重试');
            }
            return response.json();
        })
        .then(data => {
            // 注册成功，显示成功消息
            registerMessage.textContent = '注册成功！即将跳转到登录页面...';
            registerMessage.style.color = '#27ae60';
            
            // 3秒后跳转到登录页面
            setTimeout(function() {
                window.location.href = '/static/shop/login.html';
            }, 3000);
        })
        .catch(error => {
            console.error('注册错误:', error);
            registerMessage.textContent = error.message || '注册失败，请稍后重试';
        });
    });
}); 