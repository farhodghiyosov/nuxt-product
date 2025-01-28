<template>
  <div class="container mx-auto py-8 px-4">
    <div v-if="loading" class="text-center text-lg font-bold">Загрузка...</div>

    <div v-else-if="error" class="text-center text-red-500 text-lg font-bold">
      {{ error }}
    </div>

    <div v-else-if="photo" class="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="p-6">

        <img
          :src="photo?.url ? photo.url : 'https://via.placeholder.com/400x300?text=No+Image'"
          :alt="photo?.title || 'Image not available'"
          class="w-full h-80 object-cover mb-4 rounded-lg shadow-lg bg-gray-100"
        />

        <h1 class="text-3xl font-bold mb-4">{{ photo.title }}</h1>

        <div class="mb-4">
          <p class="text-lg text-gray-700">Цена: <span class="font-semibold">{{ photo.price }} сомони.</span></p>
          <p class="text-lg text-gray-700">Категория: <span class="font-semibold">{{ photo.category }}</span></p>
          <p class="text-lg text-gray-700">Бренд: <span class="font-semibold">{{ photo.brand }}</span></p>
        </div>

        <!-- Кнопка "Добавить в корзину" -->
        <button
          @click="addToCart(photo)"
          :disabled="isInCart"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          {{ isInCart ? 'Уже в корзине' : 'Добавить в корзину' }}
        </button>

        <button @click="goBack" class="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-300 ml-4">
          Назад
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const router = useRouter();
const photo = ref(null);
const loading = ref(false);
const error = ref(null);

const cartStore = useCartStore();

// Функция для проверки, есть ли товар в корзине
const isInCart = computed(() => {
  return cartStore.items.some(item => item.id === photo.value?.id);
});

function addToCart(product) {
  if (!isInCart.value) {
    cartStore.addToCart(product);
  }
}

// Загрузка данных о товаре
onMounted(async () => {
  loading.value = true;
  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/photos/${route.params.id}`);

    if (response.data) {
      photo.value = {
        ...response.data,
        price: Math.floor(Math.random() * 1000), // Генерация случайной цены
        category: 'Категория 1', // Пример категории
        brand: 'Бренд 1' // Пример бренда
      };
    } else {
      error.value = 'Товар не найден';
    }
  } catch (err) {
    error.value = 'Ошибка при загрузке данных: ' + err.message;
  } finally {
    loading.value = false;
  }
});

// Функция для перехода назад
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.container {
  background-color: #f9fafb;
  min-height: 100vh;
}

.max-w-3xl {
  background-color: #fff;
}

img {
  max-width: 100%;
  border-radius: 12px;
}

h1 {
  font-size: 2rem;
  color: #2d3748;
}

p {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #4a5568;
}
</style>
