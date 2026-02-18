<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/admin" class="text-2xl font-bold text-blue-600">
                LaraFit Admin
              </NuxtLink>
            </div>
            <!-- Desktop Menu -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink 
                to="/admin" 
                class="border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
                exact
              >
                Dashboard
              </NuxtLink>
              <NuxtLink 
                to="/admin/students" 
                class="border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                Alunos
              </NuxtLink>
              <NuxtLink 
                v-if="user?.role === 'ADMIN'"
                to="/admin/teachers" 
                class="border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                Professores
              </NuxtLink>
              <NuxtLink 
                to="/admin/workouts" 
                class="border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                Treinos
              </NuxtLink>
              <NuxtLink 
                v-if="user?.role === 'ADMIN' || user?.role === 'TEACHER'"
                to="/admin/payments" 
                class="border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                Financeiro
              </NuxtLink>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- User Info -->
            <div v-if="user" class="hidden sm:flex items-center space-x-2 text-sm">
              <div class="text-right">
                <p class="font-medium text-gray-900">{{ user.name }}</p>
                <p class="text-xs text-gray-500">
                  <span v-if="user.role === 'ADMIN'" class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Admin</span>
                  <span v-else-if="user.role === 'TEACHER'" class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Professor</span>
                  <span v-else-if="user.role === 'STUDENT'" class="bg-green-100 text-green-800 px-2 py-0.5 rounded">Aluno</span>
                </p>
              </div>
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
            </div>
            
            <!-- Mobile menu button -->
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen" 
              type="button" 
              class="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              :aria-expanded="mobileMenuOpen"
            >
              <span class="sr-only">Abrir menu</span>
              <svg v-if="!mobileMenuOpen" class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <!-- Logout button -->
            <button 
              @click="handleLogout" 
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="mobileMenuOpen" class="sm:hidden" id="mobile-menu">
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink 
            to="/admin" 
            @click="mobileMenuOpen = false"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
            exact
          >
            Dashboard
          </NuxtLink>
          <NuxtLink 
            to="/admin/students" 
            @click="mobileMenuOpen = false"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            Alunos
          </NuxtLink>
          <NuxtLink 
            v-if="user?.role === 'ADMIN'"
            to="/admin/teachers" 
            @click="mobileMenuOpen = false"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            Professores
          </NuxtLink>
          <NuxtLink 
            to="/admin/workouts" 
            @click="mobileMenuOpen = false"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            Treinos
          </NuxtLink>
          <NuxtLink 
            v-if="user?.role === 'ADMIN' || user?.role === 'TEACHER'"
            to="/admin/payments" 
            @click="mobileMenuOpen = false"
            class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            active-class="bg-blue-50 border-blue-500 text-blue-700"
          >
            Financeiro
          </NuxtLink>
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
const mobileMenuOpen = ref(false)
const { user, fetchUser } = useAuthUser()

// Buscar dados do usuário ao montar o layout
onMounted(async () => {
  await fetchUser()
})

const handleLogout = () => {
  // Remover token e dados do usuário
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  
  // Redirecionar para login
  navigateTo('/')
}
</script>
