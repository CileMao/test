<template>
  <div class="user-manage">
    <van-nav-bar
      title="用户管理"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    
    <van-search
      v-model="searchKeyword"
      placeholder="搜索用户"
      shape="round"
      @search="searchUsers"
    />
    
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="fetchUsers"
    >
      <van-cell v-for="user in filteredUsers" :key="user.id">
        <div class="user-item">
          <div class="user-info">
            <van-icon name="user-circle-o" size="24px" class="user-icon" />
            <div>
              <div class="username">{{ user.username }}</div>
              <div class="user-role">{{ user.roles.join(', ') }}</div>
            </div>
          </div>
          
          <div class="user-actions">
            <van-button 
              size="small" 
              type="primary" 
              plain
              @click="editUser(user)"
            >
              编辑
            </van-button>
            <van-button 
              size="small" 
              type="danger" 
              plain
              @click="deleteUser(user.id)"
              v-if="currentUser?.id !== user.id"
            >
              删除
            </van-button>
          </div>
        </div>
      </van-cell>
    </van-list>
    
    <van-floating-bubble
      v-model:offset="offset"
      axis="xy"
      magnetic="x"
      @click="showAddUser = true"
      style="--van-floating-bubble-size: 48px;"
    >
      <van-icon name="plus" size="24" />
    </van-floating-bubble>
    
    <!-- 添加/编辑用户弹窗 -->
    <van-popup 
      v-model:show="showUserForm" 
      position="bottom"
      round
      :style="{ height: '70%' }"
    >
      <van-form @submit="saveUser">
        <van-cell title="用户信息" />
        
        <van-field
          v-model="currentEditUser.username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        
        <van-field
          v-model="currentEditUser.password"
          :type="showPassword ? 'text' : 'password'"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: !currentEditUser.id, message: '请填写密码' }]"
        >
          <template #button>
            <van-icon 
              :name="showPassword ? 'eye-o' : 'closed-eye'" 
              @click="showPassword = !showPassword"
            />
          </template>
        </van-field>
        
        <van-field
          v-model="currentEditUser.email"
          label="邮箱"
          placeholder="请输入邮箱"
          :rules="[{ type: 'email', message: '请输入正确的邮箱格式' }]"
        />
        
        <van-field
          v-model="currentEditUser.phone"
          label="手机号"
          placeholder="请输入手机号"
        />
        
        <van-field
          name="roles"
          label="角色"
        >
          <template #input>
            <van-checkbox-group 
              v-model="currentEditUser.roles" 
              direction="horizontal"
            >
              <van-checkbox name="user">普通用户</van-checkbox>
              <van-checkbox name="admin">管理员</van-checkbox>
            </van-checkbox-group>
          </template>
        </van-field>
        
        <div style="margin: 16px;">
          <van-button 
            round 
            block 
            type="primary" 
            native-type="submit"
          >
            保存
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { showConfirmDialog, showSuccessToast, showFailToast } from 'vant';

// 获取当前登录用户信息
const authStore = useAuthStore();
const currentUser = authStore.userInfo;

// 用户数据
const users = ref([]);
const loading = ref(false);
const finished = ref(false);
const searchKeyword = ref('');

// 用户表单相关
const showUserForm = ref(false);
const showPassword = ref(false);
const currentEditUser = reactive({
  id: null,
  username: '',
  password: '',
  email: '',
  phone: '',
  roles: ['user']
});

// 过滤后的用户列表
const filteredUsers = computed(() => {
  if (!searchKeyword.value) return users.value;
  
  return users.value.filter(user => 
    user.username.includes(searchKeyword.value) ||
    (user.email && user.email.includes(searchKeyword.value)) ||
    (user.phone && user.phone.includes(searchKeyword.value))
  );
});

// 加载用户数据
const fetchUsers = async () => {
  try {
    loading.value = true;
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 实际项目中替换为真实API调用
    // const response = await axios.get('/api/users');
    // users.value = response.data;
    
    // 模拟数据
    users.value = [
      { id: 1, username: 'admin', email: 'admin@example.com', roles: ['admin', 'user'] },
      { id: 2, username: 'user1', email: 'user1@example.com', roles: ['user'] },
      { id: 3, username: 'gis_operator', email: 'operator@example.com', roles: ['user'] },
      { id: 4, username: 'soil_expert', email: 'expert@example.com', roles: ['user'] },
    ];
    
    finished.value = true;
  } catch (error) {
    showFailToast('加载用户数据失败');
    console.error('加载用户数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 搜索用户
const searchUsers = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 300);
};

// 编辑用户
const editUser = (user) => {
  Object.assign(currentEditUser, {
    id: user.id,
    username: user.username,
    password: '',
    email: user.email || '',
    phone: user.phone || '',
    roles: [...user.roles]
  });
  
  showPassword.value = false;
  showUserForm.value = true;
};

// 删除用户
const deleteUser = (userId) => {
  showConfirmDialog({
    title: '删除用户',
    message: '确定要删除该用户吗？此操作不可恢复。',
  }).then(async () => {
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 实际项目中替换为真实API调用
      // await axios.delete(`/api/users/${userId}`);
      
      users.value = users.value.filter(user => user.id !== userId);
      showSuccessToast('用户删除成功');
    } catch (error) {
      showFailToast('删除用户失败');
      console.error('删除用户失败:', error);
    }
  });
};

// 保存用户
const saveUser = async () => {
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (currentEditUser.id) {
      // 更新用户
      // await axios.put(`/api/users/${currentEditUser.id}`, currentEditUser);
      
      const index = users.value.findIndex(u => u.id === currentEditUser.id);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...currentEditUser };
      }
    } else {
      // 创建用户
      // const response = await axios.post('/api/users', currentEditUser);
      
      const newUser = {
        id: Math.max(...users.value.map(u => u.id), 0) + 1,
        ...currentEditUser
      };
      
      users.value.push(newUser);
    }
    
    showSuccessToast('保存成功');
    showUserForm.value = false;
    resetForm();
  } catch (error) {
    showFailToast('保存用户信息失败');
    console.error('保存用户信息失败:', error);
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(currentEditUser, {
    id: null,
    username: '',
    password: '',
    email: '',
    phone: '',
    roles: ['user']
  });
};

// 初始化
onMounted(fetchUsers);
</script>

<style scoped>
.user-manage {
  padding-bottom: 60px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-icon {
  color: #07c160;
}

.username {
  font-weight: 500;
  margin-bottom: 2px;
}

.user-role {
  font-size: 12px;
  color: #969799;
}

.user-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 480px) {
  .user-actions {
    flex-direction: column;
  }
}
</style>