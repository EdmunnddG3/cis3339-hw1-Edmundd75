```vue
<script setup>
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="CampusFlow home">
        <span class="brand-icon" aria-hidden="true">C</span>
        <span class="brand-text">
          <strong>CampusFlow</strong>
          <small>STUDENT MANAGEMENT</small>
        </span>
      </a>

      <nav class="main-nav" aria-label="Main navigation">
        <RouterLink to="/" class="nav-link">
          <span class="nav-icon" aria-hidden="true">◈</span>
          Students
        </RouterLink>

        <RouterLink to="/courses" class="nav-link">
          <span class="nav-icon" aria-hidden="true">▤</span>
          Courses
        </RouterLink>

        <RouterLink to="/enrollments" class="nav-link">
          <span class="nav-icon" aria-hidden="true">◎</span>
          Enrollments
        </RouterLink>
      </nav>

      <div class="topbar-note">
        <span class="status-dot" aria-hidden="true"></span>
        Academic Portal
      </div>
    </header>

    <main id="main-content" class="main-content">
      <div class="welcome-banner">
        <div>
          <p class="eyebrow">CAMPUS ADMINISTRATION</p>
          <h1>Make every student count.</h1>
          <p class="welcome-description">
            Your space to manage students, courses, and enrollments.
          </p>
        </div>

        <div class="banner-decoration" aria-hidden="true">
          <span class="decoration-circle circle-one"></span>
          <span class="decoration-circle circle-two"></span>
          <span class="decoration-symbol">✳</span>
        </div>
      </div>

      <div class="page-content">
        <RouterView />
      </div>
    </main>

    <footer class="app-footer">
      <span>CampusFlow</span>
      <span>Student success starts here.</span>
    </footer>
  </div>
</template>

<style>
:root {
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  color: #202d40;
  background: #f4f7f8;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  --navy: #14283f;
  --navy-light: #203b56;
  --mint: #a8f0d0;
  --page-bg: #f4f7f8;
  --muted: #738195;
  --border: #e3eaf0;
}

* {
  box-sizing: border-box;
}

html {
  min-width: 320px;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: var(--page-bg);
}

button,
input,
select,
textarea {
  font: inherit;
}

button,
a {
  -webkit-tap-highlight-color: transparent;
}

a:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid #40b98c;
  outline-offset: 3px;
}

.app-shell {
  min-height: 100vh;
}

.topbar {
  min-height: 88px;
  padding: 18px 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  background: var(--navy);
  color: white;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  color: white;
  text-decoration: none;
}

.brand-icon {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  border-radius: 14px;
  background: var(--mint);
  color: var(--navy);
  font-size: 25px;
  font-weight: 900;
}

.brand-text {
  display: grid;
  gap: 4px;
}

.brand-text strong {
  font-size: 20px;
  letter-spacing: -0.6px;
}

.brand-text small {
  color: #b9c8d6;
  font-size: 9px;
  letter-spacing: 1.5px;
}

.main-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex-wrap: wrap;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 15px;
  border-radius: 10px;
  color: #d0dbe5;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 160ms ease, color 160ms ease;
}

.nav-link:hover {
  background: var(--navy-light);
  color: white;
}

.nav-link.router-link-active {
  background: var(--mint);
  color: var(--navy);
}

.nav-icon {
  font-size: 18px;
}

.topbar-note {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d0dbe5;
  font-size: 12px;
  white-space: nowrap;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--mint);
}

.main-content {
  width: min(1180px, 92%);
  margin: 0 auto;
  padding: 34px 0 48px;
}

.welcome-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 190px;
  overflow: hidden;
  padding: 34px 38px;
  border-radius: 22px;
  background: linear-gradient(115deg, #e2f8ef 0%, #eef7f5 62%, #d8eee8 100%);
}

.eyebrow {
  margin: 0 0 12px;
  color: #318364;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
}

.welcome-banner h1 {
  margin: 0;
  color: var(--navy);
  font-size: clamp(26px, 3vw, 36px);
  line-height: 1.2;
  letter-spacing: -1.2px;
}

.welcome-description {
  margin: 12px 0 0;
  color: #596d79;
  font-size: 14px;
  line-height: 1.6;
}

.banner-decoration {
  position: relative;
  width: 160px;
  height: 130px;
  flex-shrink: 0;
}

.decoration-circle {
  position: absolute;
  display: block;
  border-radius: 50%;
}

.circle-one {
  top: 0;
  right: 6px;
  width: 112px;
  height: 112px;
  background: #b6ead7;
}

.circle-two {
  right: 70px;
  bottom: 0;
  width: 66px;
  height: 66px;
  border: 10px solid #fff;
  background: #f1b7a0;
}

.decoration-symbol {
  position: absolute;
  top: 17px;
  right: 35px;
  color: var(--navy);
  font-size: 66px;
  line-height: 1;
}

.page-content {
  margin-top: 28px;
  min-width: 0;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 5%;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 12px;
}

.app-footer span:first-child {
  color: var(--navy);
  font-weight: 800;
}

@media (max-width: 900px) {
  .topbar {
    flex-wrap: wrap;
    gap: 18px;
  }

  .main-nav {
    order: 3;
    width: 100%;
    justify-content: flex-start;
  }

  .topbar-note {
    margin-left: auto;
  }
}

@media (max-width: 520px) {
  .topbar {
    padding: 18px 4%;
  }

  .brand-icon {
    width: 38px;
    height: 38px;
  }

  .brand-text strong {
    font-size: 18px;
  }

  .brand-text small {
    font-size: 8px;
  }

  .topbar-note {
    display: none;
  }

  .main-nav {
    gap: 5px;
  }

  .nav-link {
    flex: 1;
    justify-content: center;
    gap: 5px;
    padding: 11px 8px;
    font-size: 12px;
  }

  .nav-icon {
    font-size: 15px;
  }

  .main-content {
    width: 92%;
    padding-top: 20px;
  }

  .welcome-banner {
    min-height: 165px;
    padding: 25px 20px;
    border-radius: 16px;
  }

  .welcome-banner h1 {
    font-size: 26px;
    max-width: 290px;
  }

  .welcome-description {
    max-width: 270px;
    font-size: 13px;
  }

  .banner-decoration {
    display: none;
  }

  .page-content {
    margin-top: 20px;
  }

  .app-footer {
    flex-direction: column;
    padding: 20px 4%;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
```