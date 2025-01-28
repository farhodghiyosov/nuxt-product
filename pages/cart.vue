<template>
    <div class="cart-page max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold mb-6 text-center">Корзина</h1>
      <div v-if="cartItems.length" class="space-y-6">
        
        <!-- Список товаров в корзине -->
        <div v-for="item in cartItems" :key="item.id" class="flex flex-col sm:flex-row items-center justify-between border-b pb-4">
          <!-- Информация о товаре -->
          <div class="flex items-center space-x-4">
            <img
              :src="item.url || 'path_to_placeholder_image.jpg'"
              alt="Товар"
              class="w-24 h-24 object-cover rounded-lg shadow"
            />
            <div>
              <h2 class="text-xl font-semibold">{{ item.title }}</h2>
              <p class="text-gray-600">{{ item.price }} сомони</p>
            </div>
          </div>
  
          <!-- Количество и удаление -->
          <div class="flex items-center space-x-4 mt-4 sm:mt-0">
            <div class="flex items-center border border-gray-300 rounded-lg">
              <button
                @click="updateQuantity(item.id, item.quantity - 1)"
                class="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-l-lg"
                :disabled="item.quantity <= 1"
              >
                -
              </button>
              <input
                type="number"
                v-model.number="item.quantity"
                @change="updateQuantity(item.id, item.quantity)"
                class="w-16 text-center border-0 focus:outline-none focus:ring-0"
              />
              <button
                @click="updateQuantity(item.id, item.quantity + 1)"
                class="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-r-lg"
              >
                +
              </button>
            </div>
            <button
              @click="removeFromCart(item.id)"
              class="text-red-500 hover:text-red-600 transition"
            >
              Удалить
            </button>
          </div>
        </div>
  
        <!-- Итого -->
        <div class="flex justify-between items-center border-t pt-4">
          <p class="text-lg font-semibold">Итого:</p>
          <p class="text-2xl font-bold">{{ cartTotal }} сомони</p>
        </div>
  
        <!-- Оформление заказа -->
        <button
          @click="checkout"
          class="w-full bg-green-500 hover:bg-green-600 text-white text-lg font-bold py-3 rounded-lg transition"
        >
          Оформить заказ
        </button>
      </div>
      
      <!-- Сообщение о пустой корзине -->
      <p v-else class="text-center text-gray-500">Ваша корзина пуста.</p>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue';
  import { useCartStore } from '@/stores/cart';
  
  const cartStore = useCartStore();
  const cartItems = ref(cartStore.items);  // Используем ref для реактивного обновления
  
  // Обновляем итоговую сумму при изменении товаров в корзине
  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0); // начальное значение для total — 0
  });
  
  // Функция удаления товара из корзины
  function removeFromCart(id) {
    if (confirm('Вы уверены, что хотите удалить этот товар из корзины?')) {
      cartStore.removeFromCart(id);
      cartItems.value = cartStore.items;  // Обновляем список товаров в корзине после удаления
    }
  }
  
  // Функция обновления количества товара
  function updateQuantity(id, quantity) {
    if (quantity >= 1) {
      cartStore.updateQuantity(id, quantity);
      cartItems.value = cartStore.items;  // Обновляем список товаров в корзине после изменения количества
    }
  }
  
  // Функция для оформления заказа
  function checkout() {
    alert('Спасибо за заказ! Ваш заказ успешно оформлен.');
    cartStore.clearCart(); // Очистить корзину после оформления заказа
    cartItems.value = [];  // Визуально очистить корзину
  }
  </script>
  
  <style scoped>
  .cart-page {
    background-color: #f9fafb;
  }
  
  input[type="number"] {
    -moz-appearance: textfield;
  }
  
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  </style>
  