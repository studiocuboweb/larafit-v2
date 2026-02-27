<template>
  <!-- Container principal com padding para as barras fixas -->
  <div class="min-h-screen bg-gray-900 pb-20">
    
    <!-- 1. Barra Superior Otimizada (Fixa) -->
    <header class="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 shadow-sm z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          
          <!-- Lado Esquerdo: Logo e Informações do Usuário -->
          <div class="flex items-center gap-4">
            <NuxtLink to="/admin" class="flex-shrink-0">
              <img class="h-9 w-auto" src="/img/stripes.webp" alt="LaraFit Logo" />
            </NuxtLink>
            
            <div v-if="user" class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-r from-[#0f222d] to-[#f55139] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div class="sm:block text-left">
                <p class="text-sm font-medium text-white leading-tight">{{ user.name }}</p>
                <p class="text-xs text-gray-400 leading-tight">{{ user.role }}</p>
              </div>
            </div>
          </div>
          
          <!-- Lado Direito: Botão de Sair -->
          <div class="flex items-center">
            <button 
              @click="handleLogout" 
              class="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-700"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 2. Conteúdo Principal da Página -->
    <main class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <slot />
    </main>

    <!-- 3. Barra de Navegação Inferior Fixa (com a LÓGICA DE CLASSE CORRIGIDA) -->
    <footer class="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-40">
      <nav class="flex justify-around max-w-7xl mx-auto">
        <NuxtLink 
          v-for="item in navigation" 
          :key="item.to"
          :to="item.to" 
          class="flex-1 group flex flex-col items-center p-3 text-xs font-medium"
          :class="isActive(item.to) ? 'text-[#f55139]' : 'text-gray-400 hover:text-white'"
        >
          <svg class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" v-html="item.icon"></svg>
          <span class="truncate">{{ item.name }}</span>
        </NuxtLink>
      </nav>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthUser } from '~/composables/useAuthUser'
import { useRoute } from 'vue-router'

const { user, fetchUser } = useAuthUser()
const route = useRoute() // Importa a rota atual para usar no script

onMounted(async () => {
  await fetchUser()
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  navigateTo('/')
}

// ======================= INÍCIO DA CORREÇÃO =======================
// Função para verificar se o link está ativo
const isActive = (path: string): boolean => {
  // Se o caminho do link for a raiz '/admin', ele só estará ativo se a rota for EXATAMENTE '/admin'.
  if (path === '/admin') {
    return route.path === '/admin'
  }
  // Para todos os outros links, verificamos se a rota atual COMEÇA com o caminho do link.
  return route.path.startsWith(path)
}
// ======================== FIM DA CORREÇÃO =========================

const navigation = computed(() => {
  const navItems = [
    { name: 'Dashboard', to: '/admin', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />' },
    { name: 'Alunos', to: '/admin/students', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />' },
    { name: 'Treinos', to: '/admin/workouts', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />' },
  ]

  const userRole = user.value?.role
  if (userRole === 'ADMIN') {
    navItems.splice(3, 0, { name: 'Professores', to: '/admin/teachers', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />' })
  }
  
  if (userRole === 'ADMIN' || userRole === 'TEACHER') {
    navItems.push({ name: 'Financeiro', to: '/admin/payments', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />' })
  }

  if (userRole === 'TEACHER') {
    navItems.push({ name: 'Meu Perfil', to: '/admin/profile', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />' })
  }

  return navItems
})
</script>
