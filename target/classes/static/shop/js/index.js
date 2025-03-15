document.addEventListener('DOMContentLoaded', function() {
    // 加载精选宠物
    loadFeaturedPets();
});

// 获取精选宠物
function loadFeaturedPets() {
    fetch('/api/pets')
    .then(response => response.json())
    .then(pets => {
        const featuredPets = document.getElementById('featuredPets');
        
        // 只显示状态为"可用"的宠物，最多显示4个
        const availablePets = pets.filter(pet => pet.status === '可用').slice(0, 4);
        
        if (availablePets.length === 0) {
            featuredPets.innerHTML = '<p class="no-pets">暂无可用宠物</p>';
            return;
        }
        
        // 清空现有内容
        featuredPets.innerHTML = '';
        
        // 添加宠物卡片
        availablePets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'pet-card';
            
            // 决定表情符号
            let emoji = '🐾'; // 默认
            if (pet.species.includes('狗')) emoji = '🐶';
            else if (pet.species.includes('猫')) emoji = '🐱';
            else if (pet.species.includes('兔')) emoji = '🐰';
            else if (pet.species.includes('鸟')) emoji = '🐦';
            else if (pet.species.includes('鱼')) emoji = '🐠';
            
            petCard.innerHTML = `
                <div class="pet-image">${emoji}</div>
                <div class="pet-info">
                    <h3 class="pet-name">${pet.name}</h3>
                    <p class="pet-species">${pet.species}</p>
                    <p class="pet-price">¥${pet.price.toFixed(2)}</p>
                    <p class="pet-status">${pet.status}</p>
                    <div class="pet-actions">
                        <a href="/static/shop/pet-detail.html?id=${pet.id}" class="btn-secondary">查看详情</a>
                        <button class="btn-primary btn-buy" data-id="${pet.id}">立即购买</button>
                    </div>
                </div>
            `;
            
            featuredPets.appendChild(petCard);
        });
        
        // 处理购买按钮点击事件
        setupBuyButtons();
    })
    .catch(error => {
        console.error('加载宠物数据错误:', error);
        document.getElementById('featuredPets').innerHTML = '<p class="error-message">加载宠物数据失败，请稍后重试</p>';
    });
}

// 设置购买按钮事件
function setupBuyButtons() {
    const buyButtons = document.querySelectorAll('.btn-buy');
    
    buyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const petId = this.getAttribute('data-id');
            
            // 检查用户是否已登录
            if (!checkLoginStatus()) {
                return; // auth.js中已处理未登录情况
            }
            
            // 创建订单
            createOrder(petId);
        });
    });
}

// 创建订单
function createOrder(petId) {
    const userId = localStorage.getItem('userId');
    
    const orderData = {
        petId: parseInt(petId),
        userId: parseInt(userId),
        quantity: 1
    };
    
    fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('创建订单失败');
        }
        return response.json();
    })
    .then(data => {
        alert('购买成功！您可以在"我的订单"中查看订单详情。');
        
        // 刷新宠物列表，更新状态
        loadFeaturedPets();
    })
    .catch(error => {
        console.error('创建订单错误:', error);
        alert('购买失败，请稍后重试');
    });
} 