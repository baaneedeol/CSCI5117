<template>
  <nav class="todo-header">
    <h1>{{ headerTitle }}</h1>
    <div class="header-actions">
      <router-link
        v-if="navLink && navText"
        :to="navLink"
        class="nav-link"
      >
        {{ navText }}
      </router-link>
      <button class="logout-btn" @click="logout">Log Out</button>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebaseConfig.js'

const props = defineProps({
  pageContext: { type: String, default: '' },
  category: { type: String, default: '' },
  navLink: { type: String, default: '' },
  navText: { type: String, default: '' }
})

const router = useRouter()
const firstName = ref('')

onMounted(() => {
  const user = auth.currentUser
  if (user && user.displayName) {
    firstName.value = user.displayName.split(' ')[0]
  }
})

const headerTitle = computed(() => {
  let base = firstName.value ? `${firstName.value}'s Todos` : 'My Todos'
  if (props.pageContext) base = `${props.pageContext} Todos`
  if (props.category) base += ` - ${props.category}`
  return base
})

async function logout() {
  try {
    await auth.signOut()
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 3px solid #ffccd5ff;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  box-shadow: 0 4px 20px rgba(255, 77, 109, 0.1);
  border-radius: 16px;
}

.todo-header h1 {
  font-size: 2rem;
  color: #c9184aff;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(255, 77, 109, 0.1);
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-link {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ffccd5ff 0%, #ffb3c6ff 100%);
  color: #c9184aff;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid #ff4d6dff;
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.2);
}

.nav-link:hover {
  background: linear-gradient(135deg, #ff4d6dff 0%, #c9184aff 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 77, 109, 0.3);
}

.logout-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #c9184aff 0%, #a4133cff 100%);
  color: white;
  border: 2px solid #c9184aff;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(201, 24, 74, 0.3);
}

.logout-btn:hover {
  background: linear-gradient(135deg, #a4133cff 0%, #800f2fff 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(201, 24, 74, 0.4);
}
</style>
