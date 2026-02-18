<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-4xl font-extrabold text-white">
          LaraFit
        </h2>
        <p class="mt-2 text-center text-sm text-blue-100">
          Sistema de Gerenciamento de Academia
        </p>
      </div>
      <div class="mt-8 bg-white rounded-lg shadow-2xl p-8">
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
            <label for="email" class="block text-sm font-medium text-gray-700">
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
            <label for="password" class="block text-sm font-medium text-gray-700">
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
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Entrando...</span>
              <span v-else>Entrar</span>
            </button>
          </div>
        </form>

        <!-- Quick Access (Desenvolvimento) -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs text-center text-gray-500 mb-3">Desenvolvido por <a href="https://studiocuboweb.com.br" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Studio Cubo Web</a></p>
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
