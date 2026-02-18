<template>
  <NuxtLayout name="admin">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-3xl font-bold text-gray-900">Novo Treino</h1>
          <p class="mt-2 text-sm text-gray-700">Crie um novo treino para o aluno</p>
        </div>
      </div>

      <!-- Nome do Aluno em Destaque -->
      <div v-if="student" class="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700">
              Criando treino para <span class="font-semibold">{{ student.user.name }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="mt-8 max-w-3xl">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="bg-white shadow rounded-lg p-6 space-y-6">
            <!-- Nome do Treino -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Nome do Treino *
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                placeholder="Ex: Treino A - Peito e Tríceps"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              />
            </div>

            <!-- Descrição -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                placeholder="Descreva o objetivo do treino..."
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              ></textarea>
            </div>

            <!-- Status -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                v-model="form.status"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              >
                <option value="DRAFT">Rascunho (você pode adicionar exercícios depois)</option>
                <option value="ACTIVE">Ativo</option>
                <option value="INACTIVE">Inativo</option>
              </select>
              <p class="mt-1 text-sm text-gray-500">
                Recomendamos criar como Rascunho e ativar após adicionar os exercícios
              </p>
            </div>

            <!-- Datas -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700">
                  Data de Início
                </label>
                <input
                  id="startDate"
                  v-model="form.startDate"
                  type="date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              </div>

              <div>
                <label for="endDate" class="block text-sm font-medium text-gray-700">
                  Data de Término (opcional)
                </label>
                <input
                  id="endDate"
                  v-model="form.endDate"
                  type="date"
                  :min="form.startDate"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              </div>
            </div>
          </div>

          <!-- Mensagem de erro -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
              </div>
            </div>
          </div>

          <!-- Botões -->
          <div class="flex justify-end gap-3">
            <NuxtLink
              :to="`/admin/students/${studentId}/workouts`"
              class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </NuxtLink>
            <button
              type="submit"
              :disabled="loading"
              class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Criando...' : 'Criar Treino' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const studentId = route.params.studentId as string
const { user, fetchUser } = useAuthUser()

const form = ref({
  name: '',
  description: '',
  studentId: studentId,
  teacherId: '',
  status: 'DRAFT',
  startDate: new Date().toISOString().split('T')[0],
  endDate: ''
})

const student = ref<any>(null)
const loading = ref(false)
const error = ref('')

const loadData = async () => {
  const token = localStorage.getItem('token')
  
  // Buscar dados do usuário logado se não estiver carregado
  if (!user.value) {
    await fetchUser()
  }

  student.value = await $fetch(`/api/students/${studentId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  // Se o usuário logado for um professor, usar seu ID
  if (user.value && user.value.role === 'TEACHER' && user.value.teacherId) {
    form.value.teacherId = user.value.teacherId
  } else if (student.value?.teacherId) {
    // Caso contrário, usar o professor vinculado ao aluno
    form.value.teacherId = student.value.teacherId
  }
}

onMounted(async () => {
  try {
    await loadData()
  } catch (err: any) {
    console.error('Erro ao carregar dados:', err)
    error.value = err.data?.message || 'Erro ao carregar dados do formulário.'
  }
})

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''

    // Validar se o teacherId foi definido
    if (!form.value.teacherId) {
      error.value = 'Não foi possível identificar o professor. Tente novamente.'
      return
    }

    const payload = {
      name: form.value.name,
      description: form.value.description || null,
      studentId: form.value.studentId,
      teacherId: form.value.teacherId,
      status: form.value.status,
      startDate: form.value.startDate,
      endDate: form.value.endDate || null
    }

    const token = localStorage.getItem('token')
    const workout = await $fetch('/api/workouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: payload
    })

    // Redirecionar para a página de edição do treino criado para adicionar exercícios
    await navigateTo(`/admin/workouts/${workout.id}/edit`)
  } catch (err: any) {
    console.error('Erro ao criar treino:', err)
    error.value = err.data?.message || err.message || 'Erro ao criar treino. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>
