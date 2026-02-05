<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-blue-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/student/workouts" class="text-2xl font-bold text-white">
              LaraFit
            </NuxtLink>
          </div>
          
          <div class="flex items-center">
            <!-- Desktop Menu -->
            <div class="hidden sm:flex sm:items-center sm:space-x-6">
              <!-- User Info -->
              <div v-if="user" class="flex items-center space-x-3 border-r border-blue-500 pr-6">
                <div class="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-white">{{ user.name }}</p>
                  <p class="text-xs text-blue-100">Aluno</p>
                </div>
              </div>
              
              <NuxtLink 
                to="/student/workouts" 
                class="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium"
                active-class="bg-blue-700"
              >
                Meus Treinos
              </NuxtLink>
              <NuxtLink 
                to="/student/history" 
                class="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium"
                active-class="bg-blue-700"
              >
                Histórico
              </NuxtLink>
              <NuxtLink 
                to="/student/profile" 
                class="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium"
                active-class="bg-blue-700"
              >
                Perfil
              </NuxtLink>
              <button 
                @click="handleLogout" 
                class="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800"
              >
                Sair
              </button>
            </div>
            
            <!-- Mobile menu button -->
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen" 
              type="button" 
              class="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-100 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span class="sr-only">Abrir menu</span>
              <svg v-if="!mobileMenuOpen" class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-show="mobileMenuOpen" class="sm:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <NuxtLink 
            to="/student/workouts" 
            @click="mobileMenuOpen = false"
            class="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-blue-700"
          >
            Meus Treinos
          </NuxtLink>
          <NuxtLink 
            to="/student/history" 
            @click="mobileMenuOpen = false"
            class="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-blue-700"
          >
            Histórico
          </NuxtLink>
          <NuxtLink 
            to="/student/profile" 
            @click="mobileMenuOpen = false"
            class="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-blue-700"
          >
            Perfil
          </NuxtLink>
          <button 
            @click="handleLogout" 
            class="w-full text-left text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, fetchUser } = useAuthUser()
const mobileMenuOpen = ref(false)

onMounted(() => {
  fetchUser()
})

const handleLogout = () => {
  // Remover token e dados do usuário
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  
  // Redirecionar para login
  navigateTo('/')
}
</script>
