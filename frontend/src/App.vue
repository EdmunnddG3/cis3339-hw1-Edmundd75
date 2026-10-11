
<script setup>
</script>

<template>
  <div class="app">
    <header>
      <h1>Student Management System</h1>

      <nav>
        <RouterLink to="/">Students</RouterLink>
        <RouterLink to="/courses">Courses</RouterLink>
        <RouterLink to="/enrollments">Enrollments</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f4f6f8;
  color: #222;
}

header {
  padding: 24px;
  background: #24476b;
  color: white;
}

header h1 {
  margin: 0 0 16px;
}

nav {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a.router-link-active {
  text-decoration: underline;
  font-weight: bold;
}

main {
  padding: 24px;
}
</style>
