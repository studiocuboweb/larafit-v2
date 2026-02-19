<template>
  <div class="px-4 sm:px-6 lg:px-8 pb-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-center mb-6">
        <div class="flex items-center">
          <img class="h-12 w-auto" src="/img/stripes.webp" alt="LaraFit Logo" />
          <h1 class="text-2xl font-bold text-white">
            <span v-if="user">Olá, {{ user.name.split(' ')[0] }}! 👋</span>
            <span v-else>Meus Treinos</span>
          </h1>
        </div>
      </div>
      <div class="text-center mb-8">
        <p class="text-sm text-white">Seus treinos ativos e prontos para executar</p>
      </div>

      <!-- Filtro de status -->
      <div class="mb-6">
        <div class="flex gap-2">
          <button
            @click="statusFilter = 'ACTIVE'"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              statusFilter === 'ACTIVE'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            ]"
          >
            Ativos
          </button>
          <button
            @click="statusFilter = 'ALL'"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              statusFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            ]"
          >
            Todos
          </button>
        </div>
      </div>

      <!-- Cards de treinos -->
      <div v-if="filteredWorkouts.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div
          v-for="workout in filteredWorkouts"
          :key="workout.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
          <!-- Header do card -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h3 class="text-xl font-bold text-white">{{ workout.name }}</h3>
            <p v-if="workout.description" class="text-blue-100 text-sm mt-1">
              {{ workout.description }}
            </p>
          </div>

          <!-- Conteúdo -->
          <div class="px-6 py-4 space-y-4">
            <!-- Info do treino -->
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-1">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ workout.teacher.user.name }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{{ workout._count?.exercises || 0 }} exercícios</span>
              </div>
            </div>

            <!-- Badge de status -->
            <div>
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  workout.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ workout.status === 'ACTIVE' ? 'Ativo' : 'Inativo' }}
              </span>
            </div>

            <!-- Preview de exercícios -->
            <div class="border-t pt-4">
              <p class="text-xs font-medium text-gray-500 mb-2">TREINO COMPLETO</p>
              <p class="text-sm text-gray-700">
                Este treino contém <strong>{{ workout._count?.exercises || 0 }} exercícios</strong>
              </p>
            </div>

            <!-- Última execução -->
            <div v-if="lastExecution(workout.id)" class="border-t pt-4">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Última execução: {{ formatDate(lastExecution(workout.id)) }}</span>
              </div>
            </div>
          </div>

          <!-- Botões de ação -->
          <div class="px-6 py-4 bg-gray-50 flex gap-2">
            <NuxtLink
              :to="`/student/workouts/${workout.id}`"
              class="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver Treino
            </NuxtLink>
            <NuxtLink
              :to="`/student/workouts/${workout.id}/execute`"
              class="flex-1 text-center bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              ▶ Executar
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum treino encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">Entre em contato com seu professor para criar treinos.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'student'
})

const { formatDate } = useFormatters()

// Pegar dados do usuário logado
const { user, fetchUser } = useAuthUser()

const statusFilter = ref('ACTIVE')
const workouts = ref([])
const executions = ref([])

onMounted(async () => {
  await fetchUser()
  
  const token = localStorage.getItem('token')
  if (!token) {
    navigateTo('/')
    return
  }

  try {
    const [workoutsResponse, executionsResponse] = await Promise.all([
      $fetch('/api/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      $fetch('/api/executions', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
    workouts.value = workoutsResponse
    executions.value = executionsResponse
  } catch (error) {
    console.error('Erro ao buscar treinos:', error)
  }
})

const filteredWorkouts = computed(() => {
  if (!workouts.value || !Array.isArray(workouts.value)) return []
  
  let filtered = workouts.value
  
  if (statusFilter.value === 'ACTIVE') {
    filtered = filtered.filter((w: any) => w.status === 'ACTIVE')
  }
  
  return filtered
})

const lastExecution = (workoutId: string) => {
  if (!executions.value || !Array.isArray(executions.value)) return null
  
  // Buscar a última execução de qualquer exercício deste treino
  const workoutExecutions = executions.value.filter((ex: any) => {
    // Verificar se o exercício pertence a este workout
    return ex.exercise?.workout?.id === workoutId
  })
  
  if (workoutExecutions.length === 0) return null
  
  // Retornar a execução mais recente
  const sortedExecutions = workoutExecutions.sort((a: any, b: any) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )
  
  return sortedExecutions[0].completedAt
}
</script>
