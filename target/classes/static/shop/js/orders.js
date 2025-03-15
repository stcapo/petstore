document.addEventListener('DOMContentLoaded', function() {
    // 检查用户是否已登录
    if (!requireAuth()) {
        return;
    }
    
    // 加载用户订单数据
    loadUserOrders();
});

// 加载用户订单
function loadUserOrders() {
    const userId = localStorage.getItem('userId');
    
    fetch(`/api/orders/user/${userId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('加载订单失败');
        }
        return response.json();
    })
    .then(orders => {
        displayOrders(orders);
    })
    .catch(error => {
        console.error('加载订单错误:', error);
        document.getElementById('ordersContainer').innerHTML = '<p class="error-message">加载订单数据失败，请稍后重试</p>';
    });
}

// 显示订单列表
function displayOrders(orders) {
    const ordersContainer = document.getElementById('ordersContainer');
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = '<div class="no-orders">您还没有订单，去<a href="/static/shop/pets.html">选购宠物</a>吧！</div>';
        return;
    }
    
    // 按照ID倒序排列，最新的订单显示在前面
    orders.sort((a, b) => b.id - a.id);
    
    // 清空容器
    ordersContainer.innerHTML = '';
    
    // 创建一个Map来存储宠物信息，避免重复请求
    const petInfoPromises = new Map();
    
    // 为每个订单创建一个元素
    orders.forEach(order => {
        // 如果尚未获取该宠物信息，则发起请求
        if (!petInfoPromises.has(order.petId)) {
            petInfoPromises.set(
                order.petId, 
                fetch(`/api/pets/${order.petId}`).then(res => res.json())
            );
        }
        
        // 获取宠物信息并创建订单元素
        petInfoPromises.get(order.petId).then(pet => {
            const orderContainer = document.createElement('div');
            orderContainer.className = 'order-container';
            
            // 格式化订单日期
            const orderDate = new Date(order.orderDate);
            const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
            
            // 根据状态设置样式
            const statusClass = order.status === '已创建' ? 'status-created' : 'status-cancelled';
            
            // 决定表情符号
            let emoji = '🐾'; // 默认
            if (pet.species.includes('狗')) emoji = '🐶';
            else if (pet.species.includes('猫')) emoji = '🐱';
            else if (pet.species.includes('兔')) emoji = '🐰';
            else if (pet.species.includes('鸟')) emoji = '🐦';
            else if (pet.species.includes('鱼')) emoji = '🐠';
            
            // 创建订单HTML
            orderContainer.innerHTML = `
                <div class="order-header">
                    <span class="order-id">订单号: ${order.id}</span>
                    <span class="order-date">${formattedDate}</span>
                    <span class="order-status ${statusClass}">${order.status}</span>
                </div>
                <div class="order-body">
                    <div class="order-item">
                        <div class="pet-info-mini">
                            <div class="pet-emoji">${emoji}</div>
                            <div class="pet-details">
                                <h4>${pet.name}</h4>
                                <p>${pet.species}</p>
                            </div>
                        </div>
                        <div class="order-price">¥${pet.price.toFixed(2)}</div>
                    </div>
                </div>
                <div class="order-footer">
                    <div class="order-total">总计: ¥${pet.price.toFixed(2)}</div>
                    <div class="order-actions">
                        ${order.status === '已创建' ? 
                            `<button class="btn-secondary cancel-order" data-id="${order.id}">取消订单</button>` : 
                            ''}
                    </div>
                </div>
            `;
            
            // 添加到容器中
            ordersContainer.appendChild(orderContainer);
            
            // 如果有取消订单按钮，添加事件监听
            const cancelBtn = orderContainer.querySelector('.cancel-order');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    const orderId = this.getAttribute('data-id');
                    cancelOrder(orderId);
                });
            }
        });
    });
}

// 取消订单
function cancelOrder(orderId) {
    if (!confirm('确定要取消这个订单吗？')) {
        return;
    }
    
    fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('取消订单失败');
        }
        return response.json();
    })
    .then(() => {
        alert('订单已成功取消');
        // 重新加载订单列表
        loadUserOrders();
    })
    .catch(error => {
        console.error('取消订单错误:', error);
        alert('取消订单失败，请稍后重试');
    });
} 