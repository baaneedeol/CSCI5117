<template>
  <div class="category-manager">
    <div class="category-header">
      <h3>Categories</h3>
      <div class="category-actions">
        <button @click="toggleAddForm" class="toggle-btn">
          {{ showAddForm ? 'Cancel' : 'Add Category' }}
        </button>
      </div>
    </div>
    
    <div v-if="showAddForm" class="add-category-form">
      <input 
        v-model="newCategoryName"
        @keyup.enter="addCategory"
        placeholder="Enter category name..."
        class="category-input"
      />
      <button @click="addCategory" class="add-btn">Add</button>
    </div>
    
    <div class="categories-list">
      <router-link 
        to="/todos"
        class="category-link"
        :class="{ active: !currentCategory }"
      >
        All Categories
      </router-link>

      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-item"
      >
        <router-link 
          :to="currentCategory === category.name ? '/todos' : `/todos/${category.name}`"
          class="category-link"
          :class="{ active: currentCategory === category.name }"
        >
          {{ category.name }}
        </router-link>
        <button 
          @click="deleteCategory(category.id)"
          class="delete-btn"
          title="Delete category"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  currentCategory: { type: String, default: '' }
})

const emit = defineEmits(['create-category', 'delete-category'])

const showAddForm = ref(false)
const newCategoryName = ref('')

function toggleAddForm() {
  showAddForm.value = !showAddForm.value
}

function addCategory() {
  if (!newCategoryName.value.trim()) return
  emit('create-category', newCategoryName.value.trim())
  newCategoryName.value = ''
  showAddForm.value = false
}

function deleteCategory(categoryId) {
  if (confirm('Delete this category? Todos in this category will not be deleted.')) {
    emit('delete-category', categoryId)
  }
}
</script>

<style scoped>
.category-manager {
  max-width: 800px;
  margin: 0 auto 2rem auto;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(255, 77, 109, 0.1);
  border: 2px solid #ffccd5ff;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.category-header h3 {
  color: #c9184aff;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.category-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.toggle-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ff8fa3ff 0%, #ff4d6dff 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.3);
}

.toggle-btn:hover {
  background: linear-gradient(135deg, #ff4d6dff 0%, #c9184aff 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 77, 109, 0.4);
}

.add-category-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.category-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #ffb3c6ff;
  border-radius: 12px;
  background: #fff0f3ff;
  color: #c9184aff;
  font-size: 1rem;
  min-width: 200px;
  transition: all 0.3s ease;
}

.category-input:focus {
  border-color: #ff4d6dff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.1);
}

.category-input::placeholder {
  color: #ff8fa3ff;
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ffccd5ff 0%, #ffb3c6ff 100%);
  color: #c9184aff;
  border: 2px solid #ff4d6dff;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.2);
}

.add-btn:hover {
  background: linear-gradient(135deg, #ff4d6dff 0%, #c9184aff 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 77, 109, 0.3);
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-link {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ffccd5ff 0%, #ffb3c6ff 100%);
  border: 2px solid #ff4d6dff;
  border-radius: 25px;
  text-decoration: none;
  color: #c9184aff;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 77, 109, 0.2);
}

.category-link:hover {
  background: linear-gradient(135deg, #ff4d6dff 0%, #c9184aff 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.3);
}

.category-link.active {
  background: linear-gradient(135deg, #ff4d6dff 0%, #c9184aff 100%);
  color: white;
  border-color: #ff4d6dff;
}

.delete-btn {
  padding: 0.4rem 0.6rem;
  background: linear-gradient(135deg, #c9184aff 0%, #a4133cff 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(201, 24, 74, 0.3);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #a4133cff 0%, #800f2fff 100%);
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(201, 24, 74, 0.4);
}
</style>