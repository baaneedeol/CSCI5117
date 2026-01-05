<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <router-link to="/" class="home-link">Go to Todos</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(180deg, #fff0f3ff 0%, #ffccd5ff 45%, #ffb3c1ff 100%);
  padding: 2rem;
}

.not-found-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 77, 109, 0.15);
  border: 2px solid #ffccd5ff;
  max-width: 500px;
  width: 100%;
}

.not-found h1 {
  color: #c9184aff;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.not-found p {
  color: #a4133cff;
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.home-link {
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ff8fa3ff 0%, #ff4d6dff 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 77, 109, 0.3);
}

.home-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 77, 109, 0.4);
  background: linear-gradient(135deg, #ff4d6dff 0%, #c9184aff 100%);
}
</style>