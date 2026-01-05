<template>
  <div class="done-page">
    <TodoHeader
      :pageContext="'Completed'"
      :category="currentCategory"
      navLink="/todos"
      navText="View Active"
    />

    <div v-if="categories.length > 0" class="category-filter">
      <h3>Filter by Category:</h3>
      <div class="category-buttons">
        <router-link 
          to="/done" 
          class="category-btn"
          :class="{ active: !currentCategory }"
        >
          All Categories
        </router-link>
        
        <router-link 
          v-for="category in categories" 
          :key="category.id"
          :to="`/done/${category.name}`"
          class="category-btn"
          :class="{ active: currentCategory === category.name }"
        >
          {{ category.name }}
        </router-link>
      </div>
    </div>
    
    <div class="completed-todos">
      <TodoList
        :todos="completedTodos"
        :show-done-button="false"
        :empty-message="emptyMessage"
        @toggle-todo="handleToggleTodo"
        @delete-todo="handleDeleteTodo"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebaseConfig.js'
import { collection, query, where, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { useCollection, useCurrentUser } from 'vuefire'
import TodoList from '../components/TodoList.vue'
import TodoHeader from '../components/TodoHeader.vue'

export default {
  name: 'DonePage',
  components: { TodoList, TodoHeader },

  setup() {
    const route = useRoute()
    const user = useCurrentUser() 

    const todosQuery = computed(() => {
      if (!user.value) return null
      return query(
        collection(db, 'todos'),
        where('userId', '==', user.value.uid),
        orderBy('createdAt', 'desc')
      )
    })
    const { data: todos } = useCollection(todosQuery)

    const categoriesQuery = computed(() => {
      if (!user.value) return null
      return query(
        collection(db, 'categories'),
        where('userId', '==', user.value.uid),
        orderBy('name')
      )
    })
    const { data: categories } = useCollection(categoriesQuery)

    const currentCategory = computed(() => {
      return route.params.category                   
    })

    const completedTodos = computed(() => {
      if (!todos.value) return []
      let completed = todos.value.filter(t => t.done)

      if (currentCategory.value === 'no-category') {
        completed = completed.filter(t => !t.category)
      } else if (currentCategory.value) {
        completed = completed.filter(t => t.category === currentCategory.value)
      }

      return completed.sort((a, b) => {
        const getDate = t => t.completedAt?.seconds
          ? new Date(t.completedAt.seconds * 1000)
          : t.completedAt ? new Date(t.completedAt) : new Date(0)
        return getDate(b) - getDate(a)
      })
    })

    const emptyMessage = computed(() => {
      if (currentCategory.value && completedTodos.value.length === 0) {
        return `No completed todos in "${currentCategory.value}".`
      }
      return 'No completed todos yet.'
    })

    const handleToggleTodo = async (id) => {
      const todoRef = doc(db, 'todos', id)
      const todo = todos.value?.find(t => t.id === id)
      if (!todo) return
      const newDone = !todo.done
      await updateDoc(todoRef, { done: newDone, completedAt: newDone ? new Date() : null })
    }

    const handleDeleteTodo = async (id) => {
      const todoRef = doc(db, 'todos', id)
      await deleteDoc(todoRef)
    }

    return {
      todos,
      categories,
      currentCategory,
      completedTodos,
      emptyMessage,
      handleToggleTodo,
      handleDeleteTodo
    }
  }
}
</script>

<style scoped>
.done-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff0f3ff 0%, #ffccd5ff 45%, #ffb3c1ff 100%);
  padding: 1rem 2rem;
}

.category-filter {
  max-width: 800px;
  margin: 0 auto 2rem auto;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(255, 77, 109, 0.1);
  border: 2px solid #ffccd5ff;
}

.category-filter h3 {
  color: #c9184aff;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.category-btn {
  padding: 0.75rem 1.5rem;
  background: #ffccd5ff;
  border: 2px solid #ff4d6dff;
  border-radius: 25px;
  text-decoration: none;
  color: #ff4d6dff;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.category-btn:hover {
  background: #ff4d6dff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.3);
}

.category-btn.active {
  background: #ff4d6dff;
  color: white;
  border-color: #ff4d6dff;
}

.completed-todos {
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.9;
}
</style>