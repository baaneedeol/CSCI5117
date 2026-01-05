<template>
  <div class="page-wrapper">
    <div class="todos-page">
      <TodoHeader
        pageContext=""
        navLink="/done"
        navText="View Completed"
        @logout="logout"
      />

      <CategoryManager
        :categories="categoriesList"
        :current-category="currentCategory"
        @create-category="createCategory"
        @delete-category="deleteCategory"
      />

      <TodoForm
        :categories="categoriesList"
        :current-category="currentCategory"
        @add-todo="addTodo"
        @create-category="createCategory"
      />

      <TodoList
        :todos="filteredTodos"
        :show-done-button="true"
        :empty-message="emptyMessage"
        @toggle-todo="toggleTodo"
        @delete-todo="deleteTodo"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { db, auth } from '../firebaseConfig.js'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore'
import { useCollection, useCurrentUser } from 'vuefire'

import TodoForm from '../components/TodoForm.vue'
import TodoList from '../components/TodoList.vue'
import CategoryManager from '../components/CategoryManager.vue'
import TodoHeader from '../components/TodoHeader.vue'
import { useRoute, useRouter } from 'vue-router'

const user = useCurrentUser()

const todos = useCollection(
  () => user.value 
    ? query(
        collection(db, 'todos'),
        where('userId', '==', user.value.uid),
        orderBy('createdAt', 'desc')
      )
    : undefined,
  { idField: 'id' }
)

const categories = useCollection(
  () => user.value
    ? query(
        collection(db, 'categories'),
        where('userId', '==', user.value.uid),
        orderBy('name')
      )
    : undefined,
  { idField: 'id' }
)
const route = useRoute()
const router = useRouter()

const currentCategory = computed(() => route.params.category || '')

const categoriesList = computed(() => categories.value || [])

const filteredTodos = computed(() => {
  const allTodos = todos.value || []
  let list = allTodos.filter(t => !t.done)

  if (!currentCategory.value) {
    return list
  } else if (currentCategory.value === 'no-category') {
    return list.filter(t => !t.category)
  } else {
    return list.filter(t => t.category === currentCategory.value)
  }
})

const emptyMessage = computed(() => {
  if (currentCategory.value && filteredTodos.value.length === 0) {
    return `No active todos in "${currentCategory.value}".`
  }
  return 'No active todos. Add one above!'
})

async function addTodo(todoData) {
  if (user.value){
    await addDoc(collection(db, 'todos'), {
      ...todoData,
      userId: user.value.uid,
      createdAt: new Date()
    })
  }
}

async function toggleTodo(id) {
  if (user.value) {
    const todo = todos.value?.find(t => t.id === id)
    if (todo) {
      const updated = {
        done: !todo.done,
        completedAt: !todo.done ? new Date() : null
      }

      Object.assign(todo, updated)
      await updateDoc(doc(db, 'todos', id), updated)
    }
  }
}

async function deleteTodo(id) {
  if (user.value) {
    if (confirm('Delete this todo?')) {
      await deleteDoc(doc(db, 'todos', id))
    }
  }
}

async function createCategory(name) {
  if (!user.value) return
  const exists = categoriesList.value.find(c => c.name === name)
  if (exists) {
    alert('A category with this name already exists!')
    return
  }

  await addDoc(collection(db, 'categories'), {
    name,
    userId: user.value.uid,
    createdAt: new Date()
  })
}

async function deleteCategory(categoryId) {
  if (!user.value) return

  const categoryToDelete = categoriesList.value.find(c => c.id === categoryId)
  if (!categoryToDelete) {
    alert('Category not found!')
    return
  }

  if (!confirm(`Are you sure you want to delete "${categoryToDelete.name}"? Todos will lose this category but not be deleted.`)) {
    return
  }

  try {
    await deleteDoc(doc(db, 'categories', categoryId))

    const todosInCategory = todos.value?.filter(t => t.category === categoryToDelete.name) || []
    await Promise.all(todosInCategory.map(t =>
      updateDoc(doc(db, 'todos', t.id), { category: null })
    ))
  } catch (err) {
    console.error('Error deleting category:', err)
    alert('Error deleting category. Try again.')
  }
}

async function logout() {
  await auth.signOut()
  router.push('/')
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff0f3ff 0%, #ffccd5ff 45%, #ffb3c1ff 100%);
  margin: 0;
  padding: 0;
}
.todos-page {
  max-width: 800px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 12px;
}
</style>
