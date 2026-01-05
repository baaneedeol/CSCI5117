<template>
  <form @submit.prevent="submitTodo" class="todo-form">
    <div class="input-group">
      <input
        v-model="content"
        type="text"
        placeholder="What needs to be done?"
        required
        class="todo-input"
      />
      <select 
        v-model="selectedCategory" 
        class="category-select"
        :disabled="!!currentCategory"
      >
        <option value="">No Category</option>
        <option v-for="category in categories" :key="category.id" :value="category.name">
          {{ category.name }}
        </option>
        <option value="new-category">+ New Category</option>
      </select>
      <input
        v-if="selectedCategory === 'new-category' && !currentCategory"
        v-model="newCategoryName"
        placeholder="Enter category name"
        class="new-category-input"
      />
      <button type="submit" class="add-btn">
        {{ currentCategory ? `Add to ${displayCategory(currentCategory)}` : 'Add Todo' }}
      </button>
    </div>
    <div v-if="currentCategory" class="category-notice">
      <small>Todo will be added to: <strong>{{ displayCategory(currentCategory) }}</strong></small>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  currentCategory: { type: String, default: '' }
})

const emit = defineEmits(['add-todo', 'create-category'])

const content = ref('')
const selectedCategory = ref('')
const newCategoryName = ref('')

watch(() => props.currentCategory, (newVal) => {
  if (!newVal || newVal === 'no-category') {
    selectedCategory.value = ''
  } else {
    selectedCategory.value = newVal
  }
})

function displayCategory(category) {
  if (!category || category === 'no-category') return 'No Category'
  return category
}

function submitTodo() {
  if (!content.value.trim()) return

  let finalCategory = selectedCategory.value

  if (props.currentCategory) {
    finalCategory = props.currentCategory
  } else if (selectedCategory.value === 'new-category' && newCategoryName.value.trim()) {
    finalCategory = newCategoryName.value.trim()
    emit('create-category', finalCategory)
  }

  emit('add-todo', {
    content: content.value.trim(),
    category: (!finalCategory || finalCategory === 'no-category') ? null : finalCategory
  })

  content.value = ''
  newCategoryName.value = ''
  if (!props.currentCategory) selectedCategory.value = ''
}
</script>

<style scoped>
.todo-form {
  max-width: 700px;
  margin: 0 auto 2rem auto;
  padding: 0 1rem;
}

.input-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(255, 77, 109, 0.1);
  border: 2px solid #ffccd5ff;
}

.todo-input {
  flex: 2;
  padding: 1rem;
  border: 2px solid #ffb3c6ff;
  border-radius: 12px;
  min-width: 250px;
  background: #fff0f3ff;
  font-size: 1rem;
  transition: all 0.3s ease;
  color: #c9184aff;
}

.todo-input:focus {
  border-color: #ff4d6dff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.1);
}

.todo-input::placeholder {
  color: #ff8fa3ff;
}

.category-select {
  flex: 1;
  padding: 1rem;
  border: 2px solid #ffb3c6ff;
  border-radius: 12px;
  min-width: 180px;
  background: #fff0f3ff;
  color: #c9184aff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-select:disabled {
  background: #ffccd5ff;
  color: #ff4d6d88;
  cursor: not-allowed;
}

.new-category-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #ffb3c6ff;
  border-radius: 12px;
  min-width: 180px;
  background: #fff0f3ff;
  color: #c9184aff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.new-category-input:focus {
  border-color: #ff4d6dff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.1);
}

.add-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ff8fa3ff 0%, #ff4d6dff 100%);
  color: white;
  border: 2px solid #ff4d6dff;
  border-radius: 12px;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.3);
  min-width: 140px;
}

.add-btn:hover {
  background: linear-gradient(135deg, #ff4d6dff 0%, #c9184aff 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 77, 109, 0.4);
}

.category-notice {
  margin-top: 1rem;
  padding: 1rem;
  background: #ffccd5ff;
  border-radius: 12px;
  border-left: 4px solid #ff4d6dff;
  text-align: center;
}

.category-notice small {
  color: #c9184aff;
  font-weight: 500;
}
</style>
