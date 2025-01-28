<template>
  <div>
    <!-- Header (шапка) -->
    <header class="bg-blue-500 p-4 text-white text-center">
      <nav>
        <NuxtLink to="/">Главная</NuxtLink>
        <NuxtLink to="/cart" class="ml-4">Корзина</NuxtLink>
      </nav>
      <h1 class="text-3xl font-bold">Каталог товаров</h1>
    </header>

    <!-- Основной контент -->
    <main>
      <NuxtPage />
    </main>

  </div>
</template>

<script setup>
// Здесь можно разместить глобальные настройки и импорты, если необходимо.
</script>

<style scoped>
/* Добавь глобальные стили для приложения */
</style>
