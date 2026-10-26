import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/components/Navbar.jsx', 'src/components/ProductCard.jsx', 'src/context/CartContext.jsx', 'src/pages/Carrito.jsx'],
      exclude: ['src/main.jsx', 'src/App.jsx', 'src/**/*.test.{js,jsx}'],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 }
    }
  }
})