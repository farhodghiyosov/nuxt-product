<template>
    <div class="container mx-auto p-6">
      <h1 class="text-4xl font-bold text-center mb-8">Каталог товаров</h1>
  
      <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <input v-model="productStore.filter.brand" @input="productStore.filterProducts" placeholder="Фильтр по бренду" class="border p-2 rounded" />
        <input v-model="productStore.filter.category" @input="productStore.filterProducts" placeholder="Фильтр по категории" class="border p-2 rounded" />
      </div>
  
      <div v-if="productStore.loading" class="text-center">Загрузка...</div>
      <div v-if="productStore.error" class="text-center text-red-500">{{ productStore.error }}</div>
  
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3" v-if="!productStore.loading">
        <div v-for="product in productStore.filteredProducts" :key="product.id" class="product-card">
          <NuxtLink :to="`/product/${product.id}`" class="block">
            <img :src="product.thumbnailUrl" :alt="product.title" class="rounded-lg shadow-md" />
            <h2 class="mt-2 text-lg font-medium">{{ product.title }}</h2>
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useProductStore } from '@/stores/productStore'
  
  const productStore = useProductStore()
  
  onMounted(() => {
    productStore.fetchProducts()
  })
  </script>
  
  <style scoped>
  .product-card img {
    max-width: 100%;
    border-radius: 0.375rem;
  }
  </style>
  