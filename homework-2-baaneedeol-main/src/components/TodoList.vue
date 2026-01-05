<template>
  <div class="todo-list">
    <div v-if="todos.length === 0" class="empty-state">
      {{ emptyMessage }}
    </div>
    
    <div 
      v-for="todo in sortedTodos" 
      :key="todo.id"
      class="todo-item"
      :class="{ completed: todo.done }"
    >
      <div class="todo-content">
        <div class="todo-status">
          <input 
            type="checkbox" 
            :checked="todo.done" 
            @change="$emit('toggle-todo', todo.id)" 
            class="done-checkbox"
          />
        </div>

        <router-link :to="`/todo/${todo.id}`" class="todo-link">
          <span class="todo-text">{{ truncateContent(todo.content) }}</span>
        </router-link>

        <span v-if="todo.category" class="category-badge">
          {{ todo.category }}
        </span>
      </div>
      
      <div class="todo-actions">
        <button 
          @click="$emit('delete-todo', todo.id)"
          class="delete-btn"
          title="Delete todo"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  todos: { type: Array, required: true },
  emptyMessage: { type: String, default: 'No todos found.' }
})

const emit = defineEmits(['toggle-todo', 'delete-todo'])

const sortedTodos = computed(() => {
  return [...props.todos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

function truncateContent(content) {
  if (!content) return ''
  const maxLength = 50
  return content.length <= maxLength ? content : content.substring(0, maxLength) + '...'
}

// function toggleTodo(id) {
//   emit('toggle-todo', id)
// }

// function deleteTodo(id) {
//   emit('delete-todo', id)
// }
</script>


<style scoped>
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ffb3c6ff;
  border-radius: 8px;
  background: #ffe5ecff;
  transition: all 0.2s ease;
}

.todo-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.todo-item.completed {
  background: #ffe5ecff;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.todo-status {
  display: flex;
  align-items: center;
}

.done-checkbox {
  width: 20px;
  height: 20px;
  accent-color: #ff4d6dff;
  cursor: pointer;
  margin-right: 0.5rem;
}

.todo-link {
  text-decoration: none;
  color: inherit;
  flex: 1;
  transition: color 0.2s ease;
}

.todo-link:hover .todo-text {
  color: #ff4d6dff;
  text-decoration: underline;
}

.todo-text {
  word-break: break-word;
  font-size: 1.5rem;
  line-height: 1.4;
}

.category-badge {
  padding: 0.25rem 0.75rem;
  background-color: #ffccd5ff;
  color: #ff4d6dff;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid #ffb3c6ff;
}

.todo-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.completed-badge {
  padding: 0.5rem 1rem;
  background-color: #ff4d6dff;
  color: #ffe5ecff;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 80px;
  text-align: center;
}

.delete-btn {
  padding: 0.5rem 1rem;
  background-color: rgb(255, 0, 47);
  color: #ffe5ecff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  min-width: 80px;
}

.delete-btn:hover {
  background-color: rgb(182, 0, 46);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(255, 77, 109, 0.3);
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
  font-style: italic;
  background: #ffe5ecff;
  border-radius: 8px;
  border: 2px dashed #ffb3c6ff;
}
</style>
