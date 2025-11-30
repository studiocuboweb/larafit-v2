<template>
  <NuxtLayout name="student">
    <div class="px-4 sm:px-6 lg:px-8">
      <div v-if="pending" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Carregando treino...</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600">Erro ao carregar treino</p>
      </div>

      <div v-else-if="workout">
        <!-- Header -->
        <div class="mb-6">
          <NuxtLink to="/student/workouts" class="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </NuxtLink>
          
          <h1 class="text-3xl font-bold text-gray-900 mt-2">{{ workout.name }}</h1>
          <p v-if="workout.description" class="mt-2 text-gray-600">{{ workout.description }}</p>
          
          <div class="mt-4 flex items-center text-sm text-gray-500">
            <span class="mr-4">
              <strong>Professor:</strong> {{ workout.teacher?.user?.name || 'N/A' }}
            </span>
            <span :class="[
              workout.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
              'px-2 py-1 text-xs font-medium rounded-full'
            ]">
              {{ workout.status === 'ACTIVE' ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
        </div>

        <!-- Exercises List -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">
              Exercícios ({{ workout.exercises?.length || 0 }})
            </h2>
          </div>

          <ul class="divide-y divide-gray-200">
            <li v-for="exercise in workout.exercises" :key="exercise.id" class="p-6 hover:bg-gray-50">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center">
                    <span class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium text-sm mr-3">
                      {{ exercise.order }}
                    </span>
                    <h3 class="text-lg font-medium text-gray-900">{{ exercise.name }}</h3>
                  </div>

                  <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 ml-11">
                    <div>
                      <p class="text-xs text-gray-500 uppercase">Séries</p>
                      <p class="text-lg font-semibold text-gray-900">{{ exercise.sets }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase">Repetições</p>
                      <p class="text-lg font-semibold text-gray-900">{{ exercise.reps }}</p>
                    </div>
                    <div v-if="exercise.weight">
                      <p class="text-xs text-gray-500 uppercase">Carga</p>
                      <p class="text-lg font-semibold text-gray-900">{{ exercise.weight }}</p>
                    </div>
                    <div v-if="exercise.rest">
                      <p class="text-xs text-gray-500 uppercase">Descanso</p>
                      <p class="text-lg font-semibold text-gray-900">{{ exercise.rest }}s</p>
                    </div>
                  </div>

                  <div v-if="exercise.notes" class="mt-3 ml-11">
                    <p class="text-sm text-gray-600">
                      <strong>Obs:</strong> {{ exercise.notes }}
                    </p>
                  </div>

                  <div v-if="exercise.videoUrl" class="mt-3 ml-11">
                    <a :href="exercise.videoUrl" target="_blank" class="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ver vídeo explicativo
                    </a>
                  </div>
                </div>

                <div class="ml-4">
                  <input
                    type="checkbox"
                    class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    :id="`exercise-${exercise.id}`"
                  />
                  <label :for="`exercise-${exercise.id}`" class="sr-only">Marcar como concluído</label>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Complete Button -->
        <div class="mt-6 flex justify-center">
          <button
            type="button"
            class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
          >
            ✓ Treino Completo
          </button>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-600">Treino não encontrado</p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const workoutId = route.params.id as string

// Buscar treino específico
const { data: workout, pending, error } = await useFetch(`/api/workouts/${workoutId}`)
</script>
