// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss'],

  app: {
    head: {
      title: 'Larafit',
      meta: [
        { name: 'theme-color', content: '#0B0F1A' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'Larafit' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/img/icons/icon-180.png' }
      ]
    }
  },
  
  runtimeConfig: {
    // Private keys (server-side only)
    databaseUrl: process.env.DATABASE_URL,
    
    // Public keys (exposed to client)
    public: {
      apiBase: '/api'
    }
  },

  // Configuração do servidor
  nitro: {
    experimental: {
      openAPI: true
    }
  }
})
