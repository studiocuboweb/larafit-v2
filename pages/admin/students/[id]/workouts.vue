<template>
  <NuxtLayout name="admin">
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <NuxtLink
          :to="`/admin/students/${studentId}/edit`"
          class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Aluno
        </NuxtLink>

        <div v-if="student" class="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Treinos de {{ student.user.name }}</h1>
            <p class="mt-2 text-sm text-gray-700">Gerencie os treinos deste aluno</p>
          </div>
          <div class="mt-4 sm:mt-0">
            <div class="flex flex-wrap gap-2">
              <button
                @click="openCopyModal"
                class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Copiar Treino
              </button>
              <NuxtLink
                :to="`/admin/workouts/create/${studentId}`"
                class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                + Novo Treino
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-else class="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Treinos do aluno</h1>
            <p class="mt-2 text-sm text-gray-700">Aluno: {{ studentId }}</p>
          </div>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total de Treinos</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ workouts?.length || 0 }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Treinos Ativos</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ activeWorkouts }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total de Exercícios</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ totalExercises }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de treinos -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Treinos</h2>
        </div>

        <div v-if="workouts && workouts.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Treino
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Professor
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exercícios
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Início
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="workout in workouts" :key="workout.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ workout.name }}</div>
                  <div v-if="workout.description" class="text-sm text-gray-500">{{ workout.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ workout.teacher.user.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      workout.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ workout.status === 'ACTIVE' ? 'Ativo' : workout.status === 'DRAFT' ? 'Rascunho' : 'Inativo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ workout._count.exercises }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(workout.startDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <NuxtLink
                    :to="`/admin/workouts/${workout.id}/edit`"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </NuxtLink>
                  <button
                    @click="confirmDelete(workout)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum treino cadastrado</h3>
          <p class="mt-1 text-sm text-gray-500">Comece criando um novo treino para este aluno.</p>
          <div class="mt-6 flex flex-wrap justify-center gap-2">
            <button
              @click="openCopyModal"
              class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Copiar Treino
            </button>
            <NuxtLink
              :to="`/admin/workouts/create/${studentId}`"
              class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              + Novo Treino
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Copiar Treino -->
    <div v-if="showCopyModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeCopyModal"></div>
      <div class="relative w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Copiar treino existente</h3>
            <p class="text-sm text-gray-600">Selecione um treino que você já criou e associe a este aluno.</p>
          </div>
          <button
            @click="closeCopyModal"
            class="text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div class="mt-4 space-y-4">
          <div>
            <label for="copyWorkout" class="block text-sm font-medium text-gray-700">Treino</label>
            <select
              id="copyWorkout"
              v-model="copyForm.workoutId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option value="">Selecione um treino</option>
              <option v-for="workout in availableWorkouts" :key="workout.id" :value="workout.id">
                {{ workout.name }} — {{ workout.student?.user?.name || 'Aluno' }}
              </option>
            </select>
          </div>

          <div>
            <label for="copyName" class="block text-sm font-medium text-gray-700">Nome do novo treino (opcional)</label>
            <input
              id="copyName"
              v-model="copyForm.name"
              type="text"
              placeholder="Ex: Treino A - Peito e Tríceps"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          <div>
            <label for="copyStatus" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="copyStatus"
              v-model="copyForm.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option value="DRAFT">Rascunho</option>
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </select>
          </div>

          <div v-if="copyError" class="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {{ copyError }}
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button
            @click="closeCopyModal"
            class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="handleCopyWorkout"
            :disabled="copyLoading"
            class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
          >
            {{ copyLoading ? 'Copiando...' : 'Copiar Treino' }}
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const studentId = route.params.id as string
const { formatDate } = useFormatters()

const student = ref<any>(null)
const workouts = ref<any[]>([])
const availableWorkouts = ref<any[]>([])
const showCopyModal = ref(false)
const copyLoading = ref(false)
const copyError = ref('')
const copyForm = ref({
  workoutId: '',
  name: '',
  status: 'DRAFT'
})

const loadData = async () => {
  try {
    const token = localStorage.getItem('token')
    student.value = await $fetch(`/api/students/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    workouts.value = await $fetch('/api/workouts', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      query: { studentId }
    })
  } catch (error) {
    console.error('Erro ao carregar aluno/treinos:', error)
  }
}

const loadAvailableWorkouts = async () => {
  try {
    const token = localStorage.getItem('token')
    const data = await $fetch('/api/workouts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    availableWorkouts.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Erro ao carregar treinos disponíveis:', error)
    availableWorkouts.value = []
  }
}

onMounted(async () => {
  await loadData()
})

const openCopyModal = async () => {
  copyError.value = ''
  copyForm.value = { workoutId: '', name: '', status: 'DRAFT' }
  showCopyModal.value = true
  await loadAvailableWorkouts()
}

const closeCopyModal = () => {
  showCopyModal.value = false
}

const handleCopyWorkout = async () => {
  if (!copyForm.value.workoutId) {
    copyError.value = 'Selecione um treino para copiar.'
    return
  }

  try {
    copyLoading.value = true
    copyError.value = ''
    const token = localStorage.getItem('token')
    const payload: any = {
      studentId,
      status: copyForm.value.status
    }
    if (copyForm.value.name?.trim()) payload.name = copyForm.value.name.trim()

    const newWorkout = await $fetch(`/api/workouts/${copyForm.value.workoutId}/copy`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: payload
    })

    showCopyModal.value = false
    await loadData()
    await navigateTo(`/admin/workouts/${newWorkout.id}/edit`)
  } catch (error: any) {
    copyError.value = error?.data?.message || 'Erro ao copiar treino.'
  } finally {
    copyLoading.value = false
  }
}

// Estatísticas
const activeWorkouts = computed(() => {
  if (!Array.isArray(workouts.value)) return 0
  return workouts.value.filter((w: any) => w.status === 'ACTIVE').length
})

const totalExercises = computed(() => {
  if (!Array.isArray(workouts.value)) return 0
  return workouts.value.reduce((sum: number, w: any) => sum + (w._count?.exercises || 0), 0)
})

// Excluir treino
const confirmDelete = async (workout: any) => {
  if (!confirm(`Tem certeza que deseja excluir o treino "${workout.name}"?`)) {
    return
  }

  try {
    const token = localStorage.getItem('token')
    await $fetch(`/api/workouts/${workout.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    await loadData()
    alert('Treino excluído com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir treino:', error)
    alert('Erro ao excluir treino')
  }
}
</script>
