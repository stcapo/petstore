// 处理登录状态和用户信息的脚本
document.addEventListener('DOMContentLoaded', function() {
    // 检查用户登录状态
    checkLoginStatus();
    
    // 设置登出按钮事件
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

// 检查用户是否已登录
function checkLoginStatus() {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');
    
    const userActions = document.getElementById('userActions');
    const userProfile = document.getElementById('userProfile');
    const welcomeUser = document.getElementById('welcomeUser');
    
    if (userId && username) {
        // 用户已登录
        if (userActions) userActions.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';
            welcomeUser.textContent = `欢迎，${username}`;
        }
        
        // 权限检查 - 如果页面有需要登录才能看到的元素，可以在这里处理
        const buyButtons = document.querySelectorAll('.btn-buy');
        buyButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('disabled');
        });
    } else {
        // 用户未登录
        if (userActions) userActions.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
        
        // 禁用需要登录的功能
        const buyButtons = document.querySelectorAll('.btn-buy');
        buyButtons.forEach(btn => {
            btn.disabled = true;
            btn.classList.add('disabled');
            
            // 添加点击事件，提示用户登录
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('请先登录后再购买宠物');
                window.location.href = '/static/shop/login.html';
            });
        });
    }
    
    return !!userId; // 返回布尔值表示登录状态
}

// 登出
function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    
    // 跳转到首页
    window.location.href = '/static/shop/index.html';
}

// 检查是否需要授权才能访问的页面
function requireAuth() {
    if (!checkLoginStatus()) {
        alert('请先登录');
        window.location.href = '/static/shop/login.html';
        return false;
    }
    return true;
} 