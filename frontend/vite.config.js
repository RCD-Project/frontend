// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Hacer explícito el soporte para JSX
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment'
  }
});
