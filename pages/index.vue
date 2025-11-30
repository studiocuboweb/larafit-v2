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
        <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
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
          <p class="text-xs text-center text-gray-500 mb-3">Acesso rápido (desenvolvimento):</p>
          <div class="grid grid-cols-2 gap-3">
            <NuxtLink
              to="/admin"
              class="text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Admin
            </NuxtLink>
            <NuxtLink
              to="/student/workouts"
              class="text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Aluno
            </NuxtLink>
          </div>
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
