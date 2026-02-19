<template>
  <div class="min-h-screen bg-[#0f222d] relative overflow-hidden flex items-center justify-center p-4" id="login-page">
    <div class="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-500 opacity-30 blur-[150px] rounded-full"></div>
    <div class="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-green-500 opacity-30 blur-[150px] rounded-full"></div>
    <div class="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-sky-500 opacity-20 blur-[150px] rounded-full"></div>
    <div class="max-w-md w-full space-y-8 z-10">
      <div class="flex items-center justify-center">
        <div class="flex items-center">
          <img class="h-12 w-auto" src="/img/stripes.webp" alt="LaraFit Logo" />
          <h2 class="text-4xl font-extrabold text-white">
            LaraFit
          </h2>
        </div>
      </div>
  
      <div class="mt-8 rounded-lg p-8">
        <!-- Mensagem de erro -->
        <div v-if="error" class="mb-4 px-4 py-3 rounded" :class="[
          isBlockedUser ? 'bg-yellow-50 border-2 border-yellow-400 text-yellow-800' : 'bg-red-50 border border-red-200 text-red-700'
        ]">
          <div class="flex items-start">
            <svg v-if="isBlockedUser" class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="font-semibold" :class="{ 'text-lg': isBlockedUser }">{{ error }}</p>
              <p v-if="isBlockedUser" class="mt-1 text-sm">Entre em contato com a administração da academia para reativar seu acesso.</p>
            </div>
          </div>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-white">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-white">
              Senha
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center p-2 rounded-full text-xl font-bold text-white uppercase tracking-wider bg-gradient-to-r from-[#0f222d] via-[#00629c] to-[#0f222d] border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:brightness-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="loading">Iniciando...</span>
              <span v-else>COMEÇAR</span>
            </button>
          </div>
        </form>

        <!-- Quick Access (Desenvolvimento) -->
        <div class="mt-20 pt-6 border-t border-gray-200">
          <p class="text-xs text-center text-white mb-3">Desenvolvido por <a href="https://studiocuboweb.com.br" class="text-orange-500 hover:underline" target="_blank" rel="noopener noreferrer">Studio Cubo Web</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const isBlockedUser = computed(() => error.value.includes('bloqueado'))

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { data, error: fetchError } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password
      }
    })

    if (fetchError.value) {
      error.value = fetchError.value.data?.message || 'Erro ao fazer login'
      return
    }

    if (data.value) {
      // Salvar token e dados do usuário
      localStorage.setItem('token', data.value.token)
      localStorage.setItem('user', JSON.stringify(data.value.user))
      
      // Redirecionar baseado no role
      if (data.value.user.role === 'ADMIN') {
        await navigateTo('/admin')
      } else if (data.value.user.role === 'TEACHER') {
        await navigateTo('/admin') // Professores também acessam admin
      } else if (data.value.user.role === 'STUDENT') {
        await navigateTo('/student/workouts')
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}
</script>
