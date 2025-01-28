// stores/productStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [],
    filteredProducts: [],
    loading: false,
    error: null,
    filter: {
      brand: '',
      category: '',
      price: null,
    },
  }),
  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/photos/')
        this.products = response.data
        this.filteredProducts = response.data
      } catch (error) {
        this.error = 'Ошибка загрузки данных'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    filterProducts() {
      this.filteredProducts = this.products.filter(product => {
        const matchesBrand = this.filter.brand
          ? product.title.toLowerCase().includes(this.filter.brand.toLowerCase())
          : true
        const matchesCategory = this.filter.category
          ? product.title.toLowerCase().includes(this.filter.category.toLowerCase())
          : true
        return matchesBrand && matchesCategory
      })
    }
  },
})
