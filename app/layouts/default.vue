<template>
  <div class="site-shell">
    <AppSkipLink />
    <AppHeader />
    <main
      id="main-content"
      class="site-main"
      tabindex="-1"
    >
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
