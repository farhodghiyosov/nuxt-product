<template>
  <div>
   <!-- Поиск и Фильтры в одной линии с отступами -->
<div class="search-filters-container flex flex-col lg:flex-row items-center justify-between mb-8 gap-8 lg:gap-12 px-4 lg:px-8">
  
  <!-- Поиск -->
  <div class="search flex items-center w-full lg:w-auto">
    <label class="flex flex-row items-center w-full">
      <span class="text-lg font-medium mr-4">Поиск по названию:</span>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Введите название товара"
        class="border border-gray-300 rounded-lg p-3 w-full lg:w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </label>
  </div>

  <!-- Фильтры -->
  <div class="filters flex flex-wrap items-center gap-4 lg:gap-8">
    
    <!-- Категория -->
    <div class="flex flex-col">
      <label class="text-lg font-medium mb-2">Категория:</label>
      <select
        v-model="selectedCategory"
        class="border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="">Все</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
    </div>

    <!-- Бренд -->
    <div class="flex flex-col">
      <label class="text-lg font-medium mb-2">Бренд:</label>
      <select
        v-model="selectedBrand"
        class="border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="">Все</option>
        <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
      </select>
    </div>

    <!-- Мин. цена -->
    <div class="flex flex-col">
      <label class="text-lg font-medium mb-2">Мин. цена:</label>
      <input
        type="number"
        v-model.number="priceMin"
        class="border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    <!-- Макс. цена -->
    <div class="flex flex-col">
      <label class="text-lg font-medium mb-2">Макс. цена:</label>
      <input
        type="number"
        v-model.number="priceMax"
        class="border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
    
  </div>
</div>



    <!-- Список товаров -->
    <div v-if="filteredPhotos.length > 0" class="grid grid-cols-3 gap-4 lg:gap-12 px-4 lg:px-8">
      <div v-for="photo in filteredPhotos" :key="photo.id" class="photo-card border p-4">
        
        <!-- <img :src="photo.thumbnailUrl" :alt="photo.title" class="mb-2" /> -->
        <img
          :src="photo.thumbnailUrl || 'https://via.placeholder.com/150?text=No+Image'"
          :alt="photo.title || 'Image not available'"
          class="mb-2 rounded-lg shadow-lg object-cover w-full h-48 bg-gray-100"
        />
        <router-link :to="`/product/${photo.id}`">
          <h2 class="text-lg font-bold mb-2">{{ photo.title }}</h2>
        </router-link>
        <p>Цена: {{ photo.price }} сомони.</p>
        <p>Категория: {{ photo.category }}</p>
        <p>Бренд: {{ photo.brand }}</p>

      </div>
    </div>

    <!-- Кнопка для подгрузки еще данных -->
    <button v-if="!loading && !allLoaded" @click="loadMore" class="load-more-btn bg-blue-500 text-white p-2 mt-4">
      Загрузить еще
    </button>

    <!-- Индикатор загрузки -->
    <div v-if="loading">Загрузка данных...</div>

    <!-- Сообщение об ошибке -->
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Данные
const photos = ref([]);
const loading = ref(false);
const error = ref(null);
const allLoaded = ref(false);
let limit = 20;
let start = 0;

// Фильтры и поиск
const priceMin = ref(null);
const priceMax = ref(null);
const selectedCategory = ref('');
const selectedBrand = ref('');
const searchQuery = ref(''); // Поиск

// Категории и бренды
const categories = ['Категория 1', 'Категория 2', 'Категория 3'];
const brands = ['Бренд 1', 'Бренд 2', 'Бренд 3'];

// Фильтрация товаров
const filteredPhotos = computed(() => {
  return photos.value
    .filter(photo => {
      const inPriceRange = (!priceMin.value || photo.price >= priceMin.value) &&
                           (!priceMax.value || photo.price <= priceMax.value);
      const matchesCategory = !selectedCategory.value || photo.category === selectedCategory.value;
      const matchesBrand = !selectedBrand.value || photo.brand === selectedBrand.value;
      const matchesSearch = !searchQuery.value || photo.title.toLowerCase().includes(searchQuery.value.toLowerCase()); // Фильтрация по названию
      return inPriceRange && matchesCategory && matchesBrand && matchesSearch;
    });
});

// Загрузка данных
const loadMore = async () => {
  if (loading.value) return;
  loading.value = true;

  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/photos?_limit=${limit}&_start=${start}`);
    
    if (response.data.length < limit) {
      allLoaded.value = true;
    }

    response.data.forEach(photo => {
      photo.price = Math.floor(Math.random() * 1000); // Генерация случайной цены
      photo.category = categories[Math.floor(Math.random() * categories.length)];
      photo.brand = brands[Math.floor(Math.random() * brands.length)];
    });
    
    photos.value.push(...response.data);
    start += limit;
  } catch (err) {
    error.value = 'Ошибка при загрузке данных: ' + err.message;
  } finally {
    loading.value = false;
  }
};

// Первая загрузка
onMounted(() => {
  loadMore();
});
</script>

<style scoped>
.filters, .search {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.photo-card {
  margin-bottom: 20px;
}

.load-more-btn {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #3490dc;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.load-more-btn:hover {
  background-color: #2779bd;
}
</style>
