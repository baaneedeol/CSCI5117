<template>
  <div class="todo-detail">
    <nav class="nav-links">
      <router-link to="/todos" class="back-link">← Back to Todos</router-link>
    </nav>

    <div class="card">
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else-if="todo">
        <div class="form-group">
          <label for="todo-content" class="form-label">Todo Content</label>
          <textarea 
            v-model="editableContent" 
            id="todo-content"
            rows="8"
            class="form-control todo-textarea"
            placeholder="Enter your todo content..."
            @input="autoResize"
            @blur="saveTodo"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="category" class="form-label">Category</label>
          <select 
            v-model="selectedCategory" 
            id="category"
            class="form-control category-select"
            @change="saveCategory"
          >
            <option value="">No Category</option>
            <option 
              v-for="category in userCategories" 
              :key="category.id" 
              :value="category.name"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="todo-actions">
          <button 
            v-if="!todo.done"
            @click="markAsDone" 
            class="btn btn-success"
          >
            Mark as Done
          </button>
          
          <button 
            v-else
            @click="markAsActive" 
            class="btn btn-warning"
          >
            Mark as Active
          </button>

          <button 
            @click="deleteTodo"
            class="btn btn-danger delete-btn"
          >
            Delete Todo
          </button>
        </div>
        
        <div class="todo-meta">
          <h3>Todo Information</h3>
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">Created:</span>
              <span class="meta-value">{{ formatDate(todo.createdAt) }}</span>
            </div>
            <div class="meta-item" v-if="todo.completedAt">
              <span class="meta-label">Completed:</span>
              <span class="meta-value">{{ formatDate(todo.completedAt) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Status:</span>
              <span class="meta-value status-badge" :class="todo.done ? 'completed' : 'active'">
                {{ todo.done ? 'Completed' : 'Active' }}
              </span>
            </div>
            <div class="meta-item" v-if="todo.category">
              <span class="meta-label">Category:</span>
              <span class="meta-value category-display">{{ todo.category }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>Todo Not Found</h3>
        <p>The todo you're looking for doesn't exist or you don't have permission to view it.</p>
        <router-link to="/todos" class="btn btn-primary">Back to Todos</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth } from '../firebaseConfig.js'
// import { signOut } from 'firebase/auth'
import { useDocument, useCollection, useFirestore } from 'vuefire'
import { doc, updateDoc, query, where, orderBy, collection, deleteDoc } from 'firebase/firestore'

export default {
  name: 'TodoDetail',
  setup() {
    const db = useFirestore()
    const route = useRoute()
    const router = useRouter()
    
    const todoId = route.params.id
    const todoRef = doc(db, 'todos', todoId)
    const todo = useDocument(todoRef)
    
    const editableContent = ref('')
    const selectedCategory = ref('')
    const loading = ref(true)
    const isSaving = ref(false)
    const showSuccess = ref(false)

    const categoriesQuery = computed(() => {
      const user = auth.currentUser
      if (user) {
        return query(
          collection(db, 'categories'),
          where('userId', '==', user.uid),
          orderBy('name')
        )
      }
      return null
    })

    const categories = useCollection(categoriesQuery)

    const userCategories = computed(() => {
      return categories.value || []
    })

    const hasChanges = computed(() => {
      return todo.value && (
        editableContent.value !== todo.value.content ||
        selectedCategory.value !== (todo.value.category || '')
      )
    })

    watch(todo, (newTodo) => {
      if (newTodo) {
        editableContent.value = newTodo.content
        selectedCategory.value = newTodo.category || ''
        loading.value = false
      }
    })

    const autoResize = (event) => {
      const textarea = event.target
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }

    const saveTodo = async () => {
      if (hasChanges.value) {
        try {
          isSaving.value = true
          await updateDoc(todoRef, {
            content: editableContent.value
          })
          setTimeout(() => {
            router.push('/todos')
          }, 1500)
        } catch (error) {
          console.error('Error updating todo:', error)
          alert('Error saving changes. Please try again.')
        } finally {
          isSaving.value = false
        }
      }
    }

    const saveCategory = async () => {
      if (todo.value) {
        try {
          await updateDoc(todoRef, {
            category: selectedCategory.value || null
          })
          showSuccess.value = true
          setTimeout(() => {
            showSuccess.value = false
          }, 2000)
        } catch (error) {
          console.error('Error updating category:', error)
        }
      }
    }

    const markAsDone = async () => {
      if (todo.value) {
        try {
          await updateDoc(todoRef, {
            done: true,
            completedAt: new Date()
          })
          // router.push('/todos')
        } catch (error) {
          console.error('Error marking todo as done:', error)
        }
      }
    }

    const markAsActive = async () => {
      if (todo.value) {
        try {
          await updateDoc(todoRef, {
            done: false,
            completedAt: null
          })
          // router.push('/todos')
        } catch (error) {
          console.error('Error marking todo as active:', error)
        }
      }
    }

    const deleteTodo = async () => {
      if (todo.value && confirm('Are you sure you want to delete this todo? This action cannot be undone.')) {
        try {
          await deleteDoc(todoRef)
          router.push('/todos')
        } catch (error) {
          console.error('Error deleting todo:', error)
          alert('Error deleting todo. Please try again.')
        }
      }
    }

    const formatDate = (timestamp) => {
      if (timestamp) {
        return new Date(timestamp.seconds * 1000).toLocaleString()
      }
      return 'N/A'
    }

    return {
      todo,
      editableContent,
      selectedCategory,
      userCategories,
      loading,
      hasChanges,
      isSaving,
      showSuccess,
      saveTodo,
      saveCategory,
      markAsDone,
      markAsActive,
      deleteTodo,
      formatDate,
      autoResize,
    }
  }
}
</script>

<style scoped>
.todo-detail {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff0f3ff 0%, #ffccd5ff 45%, #ffb3c1ff 100%);
  padding: 2rem 1rem;
}

.nav-links {
  max-width: 700px;
  margin: 0 auto 2rem auto;
  padding-bottom: 1rem;
  border-bottom: 2px solid #ffb3c6ff;
}

.back-link {
  color: #c9184aff;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: color 0.2s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
}

.back-link:hover {
  color: #ff4d6dff;
  background: rgba(255, 255, 255, 1);
}

.card {
  max-width: 700px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(255, 77, 109, 0.15);
  border: 2px solid #ffccd5ff;
}

.form-group {
  margin-bottom: 2rem;
}

.form-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #c9184aff;
  font-size: 1.1rem;
}

.form-control {
  width: 95%;
  padding: 1rem;
  border: 2px solid #ffb3c6ff;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #fff0f3ff;
}

.form-control:focus {
  outline: none;
  border-color: #ff4d6dff;
  box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.1);
}

.todo-textarea {
  resize: vertical;
  min-height: 200px;
  line-height: 1.6;
}

.category-select {
  cursor: pointer;
}

.todo-actions {
  display: flex;
  gap: 1rem;
  margin: 2.5rem 0;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.2);
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 77, 109, 0.3);
}

.btn-success {
  background: linear-gradient(135deg, #ff8fa3ff 0%, #ff4d6dff 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff4d6dff 0%, #c9184aff 100%);
}

.btn-warning {
  background: linear-gradient(135deg, #ffb3c6ff 0%, #ff8fa3ff 100%);
  color: #c9184aff;
}

.btn-warning:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff8fa3ff 0%, #ff4d6dff 100%);
  color: white;
}

.btn-danger {
  background: linear-gradient(135deg, #c9184aff 0%, #a4133cff 100%);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #a4133cff 0%, #800f2fff 100%);
}

.todo-meta {
  border-top: 2px solid #ffccd5ff;
  padding-top: 2rem;
  margin-top: 2rem;
}

.todo-meta h3 {
  margin-bottom: 1.5rem;
  color: #c9184aff;
  font-size: 1.4rem;
  font-weight: 700;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #fff0f3ff;
  border-radius: 12px;
  border: 1px solid #ffccd5ff;
}

.meta-label {
  font-weight: 600;
  color: #ff4d6dff;
  font-size: 0.95rem;
}

.meta-value {
  color: #c9184aff;
  font-size: 1.05rem;
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-badge.active {
  background: #ffccd5ff;
  color: #ff4d6dff;
}

.status-badge.completed {
  background: #ff8fa3ff;
  color: white;
}

.category-display {
  background: #ffb3c6ff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  color: #c9184aff;
}

.loading {
  text-align: center;
  padding: 4rem;
  color: #ff4d6dff;
  font-size: 1.2rem;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #ff4d6dff;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  margin-bottom: 1rem;
  color: #c9184aff;
  font-size: 1.5rem;
}

.empty-state p {
  margin-bottom: 2.5rem;
  line-height: 1.6;
  color: #a4133cff;
}

.empty-state .btn {
  background: #ff8fa3ff;
  color: white;
}

.empty-state .btn:hover {
  background: #ff4d6dff;
}
</style>
