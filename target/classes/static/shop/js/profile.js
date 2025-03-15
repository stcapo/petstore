document.addEventListener('DOMContentLoaded', function() {
    // 检查用户是否已登录
    if (!requireAuth()) {
        return;
    }
    
    // 加载用户信息
    loadUserProfile();
    
    // 设置密码更新按钮事件
    document.getElementById('updatePasswordBtn').addEventListener('click', updatePassword);
});

// 加载用户信息
function loadUserProfile() {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');
    
    document.getElementById('profileUsername').value = username;
    document.getElementById('profileRole').value = userRole === 'admin' ? '管理员' : '普通用户';
    
    // 也可以从服务器获取更多用户信息
    fetch(`/api/users/${userId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('获取用户信息失败');
        }
        return response.json();
    })
    .then(user => {
        // 更新用户信息 (如果有其他字段需要显示)
    })
    .catch(error => {
        console.error('获取用户信息错误:', error);
    });
}

// 更新密码
function updatePassword() {
    const userId = localStorage.getItem('userId');
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const profileMessage = document.getElementById('profileMessage');
    
    // 验证输入
    if (!currentPassword) {
        profileMessage.textContent = '请输入当前密码';
        return;
    }
    
    if (!newPassword) {
        profileMessage.textContent = '请输入新密码';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        profileMessage.textContent = '两次输入的新密码不一致';
        return;
    }
    
    if (newPassword.length < 6) {
        profileMessage.textContent = '新密码长度至少为6个字符';
        return;
    }
    
    // 清空错误信息
    profileMessage.textContent = '';
    
    // 先验证当前密码
    verifyCurrentPassword(userId, currentPassword)
    .then(isValid => {
        if (!isValid) {
            throw new Error('当前密码不正确');
        }
        
        // 更新密码
        return updateUserPassword(userId, newPassword);
    })
    .then(() => {
        profileMessage.textContent = '密码更新成功';
        profileMessage.style.color = '#27ae60';
        
        // 清空密码输入框
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    })
    .catch(error => {
        console.error('更新密码错误:', error);
        profileMessage.textContent = error.message || '更新密码失败，请稍后重试';
        profileMessage.style.color = '#e74c3c';
    });
}

// 验证当前密码
function verifyCurrentPassword(userId, password) {
    // 这里使用登录API验证密码
    const username = localStorage.getItem('username');
    
    return fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        return response.ok;
    })
    .catch(() => {
        return false;
    });
}

// 更新用户密码
function updateUserPassword(userId, newPassword) {
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');
    
    return fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: parseInt(userId),
            username: username,
            password: newPassword,
            role: userRole
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('更新密码失败');
        }
        return response.json();
    });
} 