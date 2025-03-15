document.addEventListener('DOMContentLoaded', function() {
    // 加载所有宠物
    loadPets();
    
    // 筛选按钮事件
    document.getElementById('applyFilterBtn').addEventListener('click', function() {
        loadPets();
    });
});

// 获取所有宠物并应用筛选
function loadPets() {
    // 获取筛选值
    const speciesFilter = document.getElementById('speciesFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const priceSort = document.getElementById('priceSort').value;
    
    fetch('/api/pets')
    .then(response => response.json())
    .then(pets => {
        // 应用筛选条件
        let filteredPets = pets;
        
        if (speciesFilter) {
            filteredPets = filteredPets.filter(pet => pet.species.includes(speciesFilter));
        }
        
        if (statusFilter) {
            filteredPets = filteredPets.filter(pet => pet.status === statusFilter);
        }
        
        // 应用排序
        if (priceSort) {
            filteredPets = filteredPets.sort((a, b) => {
                if (priceSort === 'asc') {
                    return a.price - b.price;
                } else {
                    return b.price - a.price;
                }
            });
        }
        
        displayPets(filteredPets);
    })
    .catch(error => {
        console.error('加载宠物数据错误:', error);
        document.getElementById('petsList').innerHTML = '<p class="error-message">加载宠物数据失败，请稍后重试</p>';
    });
}

// 显示宠物列表
function displayPets(pets) {
    const petsListContainer = document.getElementById('petsList');
    
    if (pets.length === 0) {
        petsListContainer.innerHTML = '<p class="no-results">没有找到符合条件的宠物</p>';
        return;
    }
    
    // 清空现有内容
    petsListContainer.innerHTML = '';
    
    // 添加宠物卡片
    pets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        
        // 决定表情符号
        let emoji = '🐾'; // 默认
        if (pet.species.includes('狗')) emoji = '🐶';
        else if (pet.species.includes('猫')) emoji = '🐱';
        else if (pet.species.includes('兔')) emoji = '🐰';
        else if (pet.species.includes('鸟')) emoji = '🐦';
        else if (pet.species.includes('鱼')) emoji = '🐠';
        
        // 创建购买按钮，如果宠物已售出则禁用
        const buyButton = pet.status === '可用' 
            ? `<button class="btn-primary btn-buy" data-id="${pet.id}">立即购买</button>`
            : `<button class="btn-primary disabled" disabled>已售出</button>`;
        
        petCard.innerHTML = `
            <div class="pet-image">${emoji}</div>
            <div class="pet-info">
                <h3 class="pet-name">${pet.name}</h3>
                <p class="pet-species">${pet.species}</p>
                <p class="pet-price">¥${pet.price.toFixed(2)}</p>
                <p class="pet-status">${pet.status}</p>
                <div class="pet-actions">
                    <a href="/static/shop/pet-detail.html?id=${pet.id}" class="btn-secondary">查看详情</a>
                    ${buyButton}
                </div>
            </div>
        `;
        
        petsListContainer.appendChild(petCard);
    });
    
    // 处理购买按钮点击事件
    setupBuyButtons();
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
        loadPets();
    })
    .catch(error => {
        console.error('创建订单错误:', error);
        alert('购买失败，请稍后重试');
    });
} 