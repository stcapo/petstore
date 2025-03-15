document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取宠物ID
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');
    
    if (!petId) {
        // 没有ID参数，显示错误信息
        document.getElementById('petDetailContainer').innerHTML = '<p class="error-message">未找到宠物信息</p>';
        return;
    }
    
    // 加载宠物详情
    loadPetDetail(petId);
});

// 加载宠物详情
function loadPetDetail(petId) {
    fetch(`/api/pets/${petId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('获取宠物详情失败');
        }
        return response.json();
    })
    .then(pet => {
        displayPetDetail(pet);
    })
    .catch(error => {
        console.error('加载宠物详情错误:', error);
        document.getElementById('petDetailContainer').innerHTML = '<p class="error-message">加载宠物详情失败，请稍后重试</p>';
    });
}

// 显示宠物详情
function displayPetDetail(pet) {
    const petDetailContainer = document.getElementById('petDetailContainer');
    
    // 决定表情符号
    let emoji = '🐾'; // 默认
    if (pet.species.includes('狗')) emoji = '🐶';
    else if (pet.species.includes('猫')) emoji = '🐱';
    else if (pet.species.includes('兔')) emoji = '🐰';
    else if (pet.species.includes('鸟')) emoji = '🐦';
    else if (pet.species.includes('鱼')) emoji = '🐠';
    
    // 设置状态样式
    const statusClass = pet.status === '可用' ? 'status-available' : 'status-sold';
    
    // 创建购买按钮，如果宠物已售出则禁用
    const buyButton = pet.status === '可用' 
        ? `<button id="buyPetBtn" class="btn-primary btn-buy" data-id="${pet.id}">立即购买</button>`
        : `<button class="btn-primary disabled" disabled>已售出</button>`;
    
    // 创建宠物详情HTML
    petDetailContainer.innerHTML = `
        <div class="pet-detail-container">
            <div class="pet-detail-grid">
                <div class="pet-detail-image">${emoji}</div>
                <div class="pet-detail-info">
                    <h2 class="pet-detail-name">${pet.name}</h2>
                    <p class="pet-detail-species">${pet.species}</p>
                    <div class="pet-detail-price">¥${pet.price.toFixed(2)}</div>
                    <div class="pet-detail-status ${statusClass}">${pet.status}</div>
                    <div class="pet-detail-description">
                        <p>这是一只可爱的${pet.species}，名叫${pet.name}。它性格活泼，对人友善，已经做过健康检查和疫苗接种。</p>
                        <p>适合有${pet.species}养育经验的家庭，也欢迎初次养宠物的爱心人士选择。我们提供基础的养宠知识指导和售后咨询服务。</p>
                    </div>
                    <div class="pet-detail-actions">
                        ${buyButton}
                        <a href="/static/shop/pets.html" class="btn-secondary">返回列表</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 设置页面标题
    document.title = `${pet.name} - 宠物详情 - 萌宠商店`;
    
    // 如果有购买按钮，添加事件监听
    const buyBtn = document.getElementById('buyPetBtn');
    if (buyBtn) {
        buyBtn.addEventListener('click', function() {
            // 检查用户是否已登录
            if (!checkLoginStatus()) {
                return; // auth.js中已处理未登录情况
            }
            
            // 创建订单
            createOrder(pet.id);
        });
    }
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
        
        // 重新加载宠物详情，更新状态
        loadPetDetail(petId);
    })
    .catch(error => {
        console.error('创建订单错误:', error);
        alert('购买失败，请稍后重试');
    });
} 