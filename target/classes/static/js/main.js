document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    const userId = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('username');
    const userRole = sessionStorage.getItem('userRole');

    if (!userId || !username) {
        // 未登录，跳转到登录页面
        window.location.href = '/static/login.html';
        return;
    }

    // 设置用户信息
    document.getElementById('currentUsername').textContent = username;
    document.getElementById('userRole').textContent = userRole === 'admin' ? '管理员' : '普通用户';

    // 导航菜单切换
    const navItems = document.querySelectorAll('.nav-item');
    const pageContents = document.querySelectorAll('.page-content');
    const pageTitle = document.getElementById('pageTitle');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            navItems.forEach(navItem => navItem.classList.remove('active'));
            pageContents.forEach(content => content.classList.remove('active'));
            
            // 添加active类
            this.classList.add('active');
            const targetPage = this.getAttribute('data-page');
            document.getElementById(targetPage).classList.add('active');
            
            // 更新页面标题
            switch(targetPage) {
                case 'dashboard':
                    pageTitle.textContent = '控制面板';
                    loadDashboardData();
                    break;
                case 'pets':
                    pageTitle.textContent = '宠物管理';
                    loadPets();
                    break;
                case 'orders':
                    pageTitle.textContent = '订单管理';
                    loadOrders();
                    break;
                case 'users':
                    pageTitle.textContent = '用户管理';
                    loadUsers();
                    break;
            }
        });
    });

    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', function() {
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userRole');
        window.location.href = '/static/login.html';
    });

    // 初始化加载控制面板数据
    loadDashboardData();

    // 宠物管理功能
    setupPetManagement();
    
    // 用户管理功能
    setupUserManagement();
    
    // 订单管理功能
    setupOrderManagement();
});

// 加载控制面板数据
function loadDashboardData() {
    Promise.all([
        fetch('/api/pets').then(res => res.json()),
        fetch('/api/users').then(res => res.json()),
        fetch('/api/orders').then(res => res.json())
    ])
    .then(([pets, users, orders]) => {
        document.getElementById('totalPets').textContent = pets.length;
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalOrders').textContent = orders.length;
    })
    .catch(error => {
        console.error('加载控制面板数据错误:', error);
    });
}

// 宠物管理相关函数
function setupPetManagement() {
    const addPetBtn = document.getElementById('addPetBtn');
    const petModal = document.getElementById('petModal');
    const petForm = document.getElementById('petForm');
    const closeBtn = petModal.querySelector('.close');
    
    // 加载宠物列表
    loadPets();
    
    // 添加宠物按钮点击事件
    addPetBtn.addEventListener('click', function() {
        document.getElementById('petModalTitle').textContent = '添加宠物';
        petForm.reset();
        document.getElementById('petId').value = '';
        petModal.style.display = 'block';
    });
    
    // 关闭模态窗口
    closeBtn.addEventListener('click', function() {
        petModal.style.display = 'none';
    });
    
    // 点击模态窗口外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === petModal) {
            petModal.style.display = 'none';
        }
    });
    
    // 表单提交
    petForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const petId = document.getElementById('petId').value;
        const petData = {
            name: document.getElementById('petName').value,
            species: document.getElementById('petSpecies').value,
            price: parseFloat(document.getElementById('petPrice').value),
            status: document.getElementById('petStatus').value
        };
        
        if (petId) {
            // 更新宠物
            petData.id = parseInt(petId);
            updatePet(petData);
        } else {
            // 添加宠物
            createPet(petData);
        }
    });
}

// 加载宠物列表
function loadPets() {
    fetch('/api/pets')
    .then(response => response.json())
    .then(pets => {
        const petsTable = document.getElementById('petsTable').querySelector('tbody');
        petsTable.innerHTML = '';
        
        pets.forEach(pet => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pet.id}</td>
                <td>${pet.name}</td>
                <td>${pet.species}</td>
                <td>¥${pet.price.toFixed(2)}</td>
                <td>${pet.status}</td>
                <td>
                    <button class="action-btn edit-pet" data-id="${pet.id}">编辑</button>
                    <button class="action-btn delete-btn delete-pet" data-id="${pet.id}">删除</button>
                </td>
            `;
            petsTable.appendChild(tr);
        });
        
        // 添加编辑和删除事件
        document.querySelectorAll('.edit-pet').forEach(btn => {
            btn.addEventListener('click', function() {
                const petId = this.getAttribute('data-id');
                editPet(petId);
            });
        });
        
        document.querySelectorAll('.delete-pet').forEach(btn => {
            btn.addEventListener('click', function() {
                const petId = this.getAttribute('data-id');
                if (confirm('确定要删除这个宠物吗？')) {
                    deletePet(petId);
                }
            });
        });
    })
    .catch(error => {
        console.error('加载宠物列表错误:', error);
    });
}

// 创建宠物
function createPet(petData) {
    fetch('/api/pets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(petData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('创建宠物失败');
        }
        return response.json();
    })
    .then(() => {
        document.getElementById('petModal').style.display = 'none';
        loadPets();
    })
    .catch(error => {
        console.error('创建宠物错误:', error);
        alert('创建宠物失败，请稍后重试');
    });
}

// 编辑宠物
function editPet(petId) {
    fetch(`/api/pets/${petId}`)
    .then(response => response.json())
    .then(pet => {
        document.getElementById('petModalTitle').textContent = '编辑宠物';
        document.getElementById('petId').value = pet.id;
        document.getElementById('petName').value = pet.name;
        document.getElementById('petSpecies').value = pet.species;
        document.getElementById('petPrice').value = pet.price;
        document.getElementById('petStatus').value = pet.status;
        
        document.getElementById('petModal').style.display = 'block';
    })
    .catch(error => {
        console.error('获取宠物详情错误:', error);
    });
}

// 更新宠物
function updatePet(petData) {
    fetch(`/api/pets/${petData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(petData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('更新宠物失败');
        }
        return response.json();
    })
    .then(() => {
        document.getElementById('petModal').style.display = 'none';
        loadPets();
    })
    .catch(error => {
        console.error('更新宠物错误:', error);
        alert('更新宠物失败，请稍后重试');
    });
}

// 删除宠物
function deletePet(petId) {
    fetch(`/api/pets/${petId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('删除宠物失败');
        }
        loadPets();
    })
    .catch(error => {
        console.error('删除宠物错误:', error);
        alert('删除宠物失败，请稍后重试');
    });
}

// 用户管理相关函数
function setupUserManagement() {
    const addUserBtn = document.getElementById('addUserBtn');
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    const closeBtn = userModal.querySelector('.close');
    
    // 加载用户列表
    loadUsers();
    
    // 添加用户按钮点击事件
    addUserBtn.addEventListener('click', function() {
        document.getElementById('userModalTitle').textContent = '添加用户';
        userForm.reset();
        document.getElementById('userId').value = '';
        document.getElementById('userPassword').disabled = false;
        userModal.style.display = 'block';
    });
    
    // 关闭模态窗口
    closeBtn.addEventListener('click', function() {
        userModal.style.display = 'none';
    });
    
    // 点击模态窗口外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === userModal) {
            userModal.style.display = 'none';
        }
    });
    
    // 表单提交
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('userId').value;
        const userData = {
            username: document.getElementById('userUsername').value,
            role: document.getElementById('userRoleSelect').value
        };
        
        // 只有在创建用户或明确修改密码时才添加密码
        const password = document.getElementById('userPassword').value;
        if (password) {
            userData.password = password;
        }
        
        if (userId) {
            // 更新用户
            userData.id = parseInt(userId);
            updateUser(userData);
        } else {
            // 添加用户
            if (!password) {
                alert('请输入密码');
                return;
            }
            createUser(userData);
        }
    });
}

// 加载用户列表
function loadUsers() {
    fetch('/api/users')
    .then(response => response.json())
    .then(users => {
        const usersTable = document.getElementById('usersTable').querySelector('tbody');
        usersTable.innerHTML = '';
        
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.role === 'admin' ? '管理员' : '普通用户'}</td>
                <td>
                    <button class="action-btn edit-user" data-id="${user.id}">编辑</button>
                    <button class="action-btn delete-btn delete-user" data-id="${user.id}">删除</button>
                </td>
            `;
            usersTable.appendChild(tr);
        });
        
        // 添加编辑和删除事件
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                editUser(userId);
            });
        });
        
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                // 不允许删除自己
                if (userId === sessionStorage.getItem('userId')) {
                    alert('不能删除当前登录用户');
                    return;
                }
                if (confirm('确定要删除这个用户吗？')) {
                    deleteUser(userId);
                }
            });
        });
    })
    .catch(error => {
        console.error('加载用户列表错误:', error);
    });
}

// 创建用户
function createUser(userData) {
    fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('创建用户失败');
        }
        return response.json();
    })
    .then(() => {
        document.getElementById('userModal').style.display = 'none';
        loadUsers();
    })
    .catch(error => {
        console.error('创建用户错误:', error);
        alert('创建用户失败，请稍后重试');
    });
}

// 编辑用户
function editUser(userId) {
    fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(user => {
        document.getElementById('userModalTitle').textContent = '编辑用户';
        document.getElementById('userId').value = user.id;
        document.getElementById('userUsername').value = user.username;
        document.getElementById('userRoleSelect').value = user.role;
        
        // 编辑用户时密码为可选项
        const passwordInput = document.getElementById('userPassword');
        passwordInput.value = '';
        passwordInput.placeholder = '不修改密码请留空';
        
        document.getElementById('userModal').style.display = 'block';
    })
    .catch(error => {
        console.error('获取用户详情错误:', error);
    });
}

// 更新用户
function updateUser(userData) {
    fetch(`/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('更新用户失败');
        }
        return response.json();
    })
    .then(() => {
        document.getElementById('userModal').style.display = 'none';
        loadUsers();
    })
    .catch(error => {
        console.error('更新用户错误:', error);
        alert('更新用户失败，请稍后重试');
    });
}

// 删除用户
function deleteUser(userId) {
    fetch(`/api/users/${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('删除用户失败');
        }
        loadUsers();
    })
    .catch(error => {
        console.error('删除用户错误:', error);
        alert('删除用户失败，请稍后重试');
    });
}

// 订单管理相关函数
function setupOrderManagement() {
    // 加载订单列表
    loadOrders();
}

// 加载订单列表
function loadOrders() {
    fetch('/api/orders')
    .then(response => response.json())
    .then(orders => {
        const ordersTable = document.getElementById('ordersTable').querySelector('tbody');
        ordersTable.innerHTML = '';
        
        orders.forEach(order => {
            const tr = document.createElement('tr');
            const orderDate = new Date(order.orderDate);
            const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
            
            tr.innerHTML = `
                <td>${order.id}</td>
                <td>${order.petId}</td>
                <td>${order.userId}</td>
                <td>${order.quantity}</td>
                <td>${formattedDate}</td>
                <td>${order.status}</td>
                <td>
                    ${order.status === '已创建' ? 
                    `<button class="action-btn cancel-order" data-id="${order.id}">取消订单</button>` : ''}
                    <button class="action-btn delete-btn delete-order" data-id="${order.id}">删除</button>
                </td>
            `;
            ordersTable.appendChild(tr);
        });
        
        // 添加取消和删除事件
        document.querySelectorAll('.cancel-order').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                if (confirm('确定要取消这个订单吗？')) {
                    cancelOrder(orderId);
                }
            });
        });
        
        document.querySelectorAll('.delete-order').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                if (confirm('确定要删除这个订单吗？')) {
                    deleteOrder(orderId);
                }
            });
        });
    })
    .catch(error => {
        console.error('加载订单列表错误:', error);
    });
}

// 取消订单
function cancelOrder(orderId) {
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
        loadOrders();
    })
    .catch(error => {
        console.error('取消订单错误:', error);
        alert('取消订单失败，请稍后重试');
    });
}

// 删除订单
function deleteOrder(orderId) {
    fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('删除订单失败');
        }
        loadOrders();
    })
    .catch(error => {
        console.error('删除订单错误:', error);
        alert('删除订单失败，请稍后重试');
    });
} 