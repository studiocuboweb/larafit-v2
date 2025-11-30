<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-3xl font-bold text-gray-900">Treinos</h1>
        <p class="mt-2 text-sm text-gray-700">Gerencie os treinos dos alunos</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <NuxtLink
          to="/admin/workouts/new"
          class="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          + Novo Treino
        </NuxtLink>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mt-6 bg-white shadow rounded-lg p-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label for="filterStatus" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="filterStatus"
            v-model="filters.status"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
          >
            <option value="">Todos</option>
            <option value="ACTIVE">Ativos</option>
            <option value="INACTIVE">Inativos</option>
            <option value="DRAFT">Rascunho</option>
          </select>
        </div>

        <div>
          <label for="filterStudent" class="block text-sm font-medium text-gray-700">Aluno</label>
          <select
            id="filterStudent"
            v-model="filters.studentId"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
          >
            <option value="">Todos</option>
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.user.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="filterTeacher" class="block text-sm font-medium text-gray-700">Professor</label>
          <select
            id="filterTeacher"
            v-model="filters.teacherId"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
          >
            <option value="">Todos</option>
            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
              {{ teacher.user.name }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="rounded-md bg-blue-50 p-3">
                <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total</dt>
                <dd class="text-lg font-semibold text-gray-900">{{ stats.total }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="rounded-md bg-green-50 p-3">
                <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Ativos</dt>
                <dd class="text-lg font-semibold text-gray-900">{{ stats.active }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="rounded-md bg-yellow-50 p-3">
                <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Rascunho</dt>
                <dd class="text-lg font-semibold text-gray-900">{{ stats.draft }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="rounded-md bg-purple-50 p-3">
                <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Exercícios</dt>
                <dd class="text-lg font-semibold text-gray-900">{{ stats.totalExercises }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="mt-8 flex flex-col">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Nome do Treino</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Aluno</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Professor</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th class="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">Exercícios</th>
                  <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Data Início</th>
                  <th class="relative py-3.5 pl-3 pr-4">
                    <span class="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="workout in filteredWorkouts" :key="workout.id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {{ workout.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ workout.student.user.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ workout.teacher.user.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      :class="{
                        'bg-green-100 text-green-800': workout.status === 'ACTIVE',
                        'bg-gray-100 text-gray-800': workout.status === 'INACTIVE',
                        'bg-yellow-100 text-yellow-800': workout.status === 'DRAFT'
                      }"
                      class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                    >
                      {{ statusLabel(workout.status) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-center">
                    {{ workout._count.exercises }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatDate(workout.startDate) }}
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium space-x-2">
                    <NuxtLink
                      :to="`/admin/workouts/${workout.id}/edit`"
                      class="text-blue-600 hover:text-blue-900"
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

            <div v-if="filteredWorkouts.length === 0" class="text-center py-12">
              <p class="text-gray-500">Nenhum treino encontrado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const { formatDate } = useFormatters()

const filters = ref({
  status: '',
  studentId: '',
  teacherId: ''
})

// Buscar dados
const { data: workouts, refresh } = await useFetch('/api/workouts')
const { data: students } = await useFetch('/api/students')
const { data: teachers } = await useFetch('/api/teachers')

const filteredWorkouts = computed(() => {
  if (!workouts.value) return []
  return workouts.value
})

const stats = computed(() => {
  if (!workouts.value) return { total: 0, active: 0, draft: 0, totalExercises: 0 }
  
  return {
    total: workouts.value.length,
    active: workouts.value.filter(w => w.status === 'ACTIVE').length,
    draft: workouts.value.filter(w => w.status === 'DRAFT').length,
    totalExercises: workouts.value.reduce((sum, w) => sum + (w._count?.exercises || 0), 0)
  }
})

const clearFilters = () => {
  filters.value = { status: '', studentId: '', teacherId: '' }
}

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    DRAFT: 'Rascunho'
  }
  return labels[status] || status
}

const confirmDelete = async (workout: any) => {
  if (confirm(`Tem certeza que deseja excluir o treino "${workout.name}"?`)) {
    try {
      await $fetch(`/api/workouts/${workout.id}`, { method: 'DELETE' })
      refresh()
    } catch (error) {
      alert('Erro ao excluir treino')
    }
  }
}

// Watch filters and update query
watch(filters, async (newFilters) => {
  const query: any = {}
  if (newFilters.status) query.status = newFilters.status
  if (newFilters.studentId) query.studentId = newFilters.studentId
  if (newFilters.teacherId) query.teacherId = newFilters.teacherId
  
  const { data } = await useFetch('/api/workouts', { query })
  if (data.value) workouts.value = data.value
}, { deep: true })
</script>
