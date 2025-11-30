<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <NuxtLink
          to="/student/workouts"
          class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Meus Treinos
        </NuxtLink>

        <div v-if="workout" class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ workout.name }}</h1>
            <p v-if="workout.description" class="mt-2 text-gray-600">{{ workout.description }}</p>
            <div class="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Professor: {{ workout.teacher.user.name }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Início: {{ formatDate(workout.startDate) }}</span>
              </div>
            </div>
          </div>

          <NuxtLink
            :to="`/student/workouts/${workout.id}/execute`"
            class="hidden sm:inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors shadow-lg"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Iniciar Treino
          </NuxtLink>
        </div>
      </div>

      <!-- Estatísticas -->
      <div v-if="workout" class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center gap-3">
            <div class="bg-blue-100 rounded-full p-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total de Exercícios</p>
              <p class="text-2xl font-bold text-gray-900">{{ workout.exercises.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center gap-3">
            <div class="bg-purple-100 rounded-full p-3">
              <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Tempo Estimado</p>
              <p class="text-2xl font-bold text-gray-900">{{ estimatedTime }} min</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center gap-3">
            <div class="bg-green-100 rounded-full p-3">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Execuções</p>
              <p class="text-2xl font-bold text-gray-900">{{ executionCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de exercícios -->
      <div v-if="workout" class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Exercícios do Treino</h2>
        </div>

        <div class="divide-y divide-gray-200">
          <div
            v-for="(exercise, index) in workout.exercises"
            :key="exercise.id"
            class="px-6 py-4"
            :class="{
              'bg-purple-50': exercise.groupId && isFirstInGroup(exercise, index),
              'bg-purple-25 ml-4': exercise.groupId && !isFirstInGroup(exercise, index)
            }"
          >
            <!-- Badge de grupo -->
            <div v-if="exercise.groupId && isFirstInGroup(exercise, index)" class="mb-2">
              <span class="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                📦 {{ getGroupLabel(exercise.groupId) }} - Executar em sequência
              </span>
            </div>

            <div class="flex items-start gap-4">
              <!-- Número -->
              <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-lg font-bold text-blue-600">{{ exercise.order }}</span>
              </div>

              <!-- Conteúdo -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900">{{ exercise.name }}</h3>
                
                <!-- Especificações -->
                <div class="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <span><strong>{{ exercise.sets }}</strong> séries</span>
                  </div>

                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span><strong>{{ exercise.reps }}</strong> repetições</span>
                  </div>

                  <div v-if="exercise.weight" class="flex items-center gap-2 text-sm text-gray-600">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    <span>{{ exercise.weight }}</span>
                  </div>

                  <div v-if="exercise.rest" class="flex items-center gap-2 text-sm text-gray-600">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Descanso: <strong>{{ exercise.rest }}s</strong></span>
                  </div>
                </div>

                <!-- Observações -->
                <div v-if="exercise.notes" class="mt-3 text-sm text-gray-600 bg-gray-50 rounded-md p-3">
                  <p class="font-medium text-gray-700 mb-1">📝 Observações:</p>
                  <p>{{ exercise.notes }}</p>
                </div>

                <!-- Vídeo -->
                <div v-if="exercise.videoUrl" class="mt-3">
                  <a
                    :href="exercise.videoUrl"
                    target="_blank"
                    class="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ver vídeo explicativo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botão fixo inferior em mobile -->
      <div v-if="workout" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:hidden z-10">
        <NuxtLink
          :to="`/student/workouts/${workout.id}/execute`"
          class="flex items-center justify-center gap-2 w-full bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Iniciar Treino
        </NuxtLink>
      </div>

      <!-- Espaçamento para botão fixo mobile -->
      <div class="h-20 sm:hidden"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'student'
})

const route = useRoute()
const workoutId = route.params.id as string
const { formatDate } = useFormatters()

// Buscar treino
const { data: workout } = await useFetch(`/api/workouts/${workoutId}`)

// Buscar execuções deste treino
const user = useState<any>('user')
const studentId = computed(() => user.value?.student?.id)

const { data: executions } = await useFetch('/api/executions', {
  query: { 
    studentId: studentId.value,
    workoutId: workoutId
  }
})

const executionCount = computed(() => Array.isArray(executions.value) ? executions.value.length : 0)

const estimatedTime = computed(() => {
  if (!workout.value || !workout.value.exercises) return 0
  
  // Estimar: (séries * 45s por série) + tempo de descanso total
  const totalTime = workout.value.exercises.reduce((sum: number, ex: any) => {
    const executionTime = ex.sets * 45 // 45s por série
    const restTime = (ex.sets - 1) * (ex.rest || 60) // Descanso entre séries
    return sum + executionTime + restTime
  }, 0)
  
  return Math.round(totalTime / 60) // Converter para minutos
})

// Funções de agrupamento
const isFirstInGroup = (exercise: any, index: number) => {
  if (!exercise.groupId || !workout.value) return false
  if (index === 0) return true
  return workout.value.exercises[index - 1].groupId !== exercise.groupId
}

const getGroupLabel = (groupId: string) => {
  if (!workout.value) return ''
  const count = workout.value.exercises.filter((e: any) => e.groupId === groupId).length
  const labels: Record<number, string> = {
    2: 'BISET',
    3: 'TRISET',
    4: 'QUADRISET'
  }
  return labels[count] || `SUPERSET (${count})`
}
</script>
