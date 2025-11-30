<template>
  <NuxtLayout name="student">
    <div class="px-4 sm:px-6 lg:px-8 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Loading -->
        <div v-if="!workout" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Carregando treino...</p>
        </div>

        <!-- Content -->
        <div v-else>
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

            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ workout.name }}</h1>
                <p v-if="workout.description" class="mt-2 text-gray-600">{{ workout.description }}</p>
                <div class="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <div class="flex items-center gap-1">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Professor: {{ workout.teacher?.user?.name }}</span>
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
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div class="bg-white rounded-lg shadow p-4">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ workout.exercises?.length || 0 }}</p>
                  <p class="text-xs text-gray-500">Exercícios</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-4">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-100 rounded-lg">
                  <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ estimatedTime }}</p>
                  <p class="text-xs text-gray-500">Tempo estimado</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-4">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-purple-100 rounded-lg">
                  <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ executionCount }}</p>
                  <p class="text-xs text-gray-500">Execuções</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Lista de Exercícios -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Exercícios do Treino</h2>
            </div>

            <div class="divide-y divide-gray-200">
              <div
                v-for="(exercise, index) in workout.exercises"
                :key="exercise.id"
                class="p-6 hover:bg-gray-50 transition-colors"
                :class="exercise.groupId ? 'bg-purple-50' : ''"
              >
                <div class="flex items-start gap-4">
                  <div 
                    class="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                    :class="exercise.groupId ? 'bg-purple-500' : 'bg-blue-500'"
                  >
                    {{ index + 1 }}
                  </div>

                  <div class="flex-1">
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900">{{ exercise.name }}</h3>
                        <div v-if="exercise.groupId && isFirstInGroup(exercise, index)" class="mt-1">
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {{ getGroupLabel(exercise.groupId) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="grid grid-cols-3 gap-4 text-sm">
                      <div class="flex items-center gap-2 text-gray-600">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span>{{ exercise.series }} séries</span>
                      </div>
                      <div class="flex items-center gap-2 text-gray-600">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>{{ exercise.repetitions }} reps</span>
                      </div>
                      <div class="flex items-center gap-2 text-gray-600">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{{ exercise.rest }}s rest</span>
                      </div>
                    </div>

                    <p v-if="exercise.observations" class="mt-2 text-sm text-gray-600">
                      {{ exercise.observations }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Botão mobile -->
          <div class="sm:hidden mt-6">
            <NuxtLink
              :to="`/student/workouts/${workout.id}/execute`"
              class="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Iniciar Treino
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const { formatDate } = useFormatters()

const { data: workout } = await useFetch(`/api/workouts/${route.params.id}`)

const estimatedTime = computed(() => {
  if (!workout.value?.exercises) return '0 min'
  const totalSeconds = workout.value.exercises.reduce((acc: number, ex: any) => {
    return acc + (ex.series * 45) + (ex.rest * (ex.series - 1))
  }, 0)
  const minutes = Math.round(totalSeconds / 60)
  return `${minutes} min`
})

const executionCount = computed(() => {
  // Aqui você pode buscar do banco de dados
  return 0
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
