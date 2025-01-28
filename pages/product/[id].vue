<template>
    <div class="container mx-auto p-6">
      <NuxtLink to="/" class="text-blue-500">← Назад</NuxtLink>
  
      <div v-if="product" class="mt-8">
        <img :src="product.url" alt="product.title" class="rounded-lg shadow-lg mx-auto" />
        <h1 class="mt-4 text-2xl font-bold">{{ product.title }}</h1>
      </div>
  
      <div v-else class="text-center">
        <p>Загрузка данных о товаре...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  
  const route = useRoute()
  const product = ref(null)
  
  onMounted(async () => {
    const id = route.params.id
    const response = await axios.get(`https://jsonplaceholder.typicode.com/photos/${id}`)
    product.value = response.data
  })
  </script>
  