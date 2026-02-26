// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
        }
      ]
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css'
  ],
  modules: ['@nuxtjs/tailwindcss'],
  
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
