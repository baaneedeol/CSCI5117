<template>
  <div class="splash">
    <div class="splash-content">
      <h1 class="title">Baanee's Todo App</h1>
      <p class="subtitle">Stay organized. Stay inspired. Stay pink.</p>

      <button @click="handleLogin" class="login-btn" :disabled="isLoggingIn">
        <span v-if="!isLoggingIn">Login with Google</span>
        <span v-else>Signing in...</span>
      </button>

      <div v-if="loginError" class="error-message">
        {{ loginError }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { auth } from '../firebaseConfig.js'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'SplashPage',
  setup() {
    const isLoggingIn = ref(false)
    const loginError = ref('')
    const router = useRouter()

    onMounted(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("Redirecting to todos")
          router.replace('/todos')
        }
      })
    })

    const handleLogin = async () => {
      isLoggingIn.value = true
      loginError.value = ""

      try {
        const provider = new GoogleAuthProvider()
        provider.addScope("email")

        const result = await signInWithPopup(auth, provider)
        console.log("Login successful")

        router.replace('/todos')
      } catch (error) {
        console.error("Login error:", error)
        loginError.value = "Login failed. Please try again."
      } finally {
        isLoggingIn.value = false
      }
    }

    return {
      isLoggingIn,
      loginError,
      handleLogin
    }
  }
}
</script>

<style scoped>
.splash {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  background: linear-gradient(
    180deg,
    #fff0f3ff 0%,
    #ffccd5ff 45%,
    #ffb3c1ff 100%
  );

  padding: 2rem;
}

.splash-content {
  padding: 3rem 2rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(255, 77, 109, 0.15);
  width: 100%;
  max-width: 450px;
  border: 2px solid #ffccd5ff;
}

.title {
  color: #c9184aff;
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #a4133cff;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  font-weight: 500;
}

.login-btn {
  padding: 1rem 2rem;
  background-color: #ff8fa3ff;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.2);
}

.login-btn:hover:not(:disabled) {
  background-color: #ff4d6dff;
  transform: translateY(-2px);
}

.login-btn:disabled {
  background-color: #ffccd5ff;
  color: #800f2fff;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  background-color: #fff0f3ff;
  color: #800f2fff;
  border: 1px solid #ffb3c1ff;
  border-radius: 12px;
  font-weight: 500;
}
</style>
