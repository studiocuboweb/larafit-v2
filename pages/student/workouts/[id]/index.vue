<template>
  <NuxtLayout name="student">
    <div class="min-h-screen bg-gray-50 pb-32">
      <!-- Loading -->
      <div v-if="!workout" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Carregando treino...</p>
      </div>

      <!-- Content -->
      <div v-else class="max-w-4xl mx-auto px-4 py-6">
        <!-- Header com Cronômetro -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-0 z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="flex-1">
              <NuxtLink to="/student/workouts" class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
                <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </NuxtLink>
              <h1 class="text-2xl font-bold text-gray-900">{{ workout.name }}</h1>
              <p class="text-sm text-gray-500">{{ completedExercises }} de {{ workout.exercises.length }} exercícios</p>
            </div>

            <div class="text-center">
              <div class="text-4xl font-bold text-gray-900 font-mono">{{ formatTimer(elapsedTime) }}</div>
              <div class="flex gap-2 mt-2">
                <button
                  v-if="!timerRunning"
                  @click="startTimer"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
                >
                  ▶ Iniciar
                </button>
                <button
                  v-else
                  @click="pauseTimer"
                  class="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-semibold hover:bg-yellow-700"
                >
                  ⏸ Pausar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de Exercícios -->
        <div class="space-y-4">
          <div
            v-for="(exercise, index) in workout.exercises"
            :key="exercise.id"
            class="rounded-lg shadow-md overflow-hidden transition-all duration-200"
            :class="getExerciseCardClass(index)"
          >
            <!-- Header do Card -->
            <div class="p-4 cursor-pointer" @click="toggleExercise(index)">
              <div class="flex items-center gap-4">
                <!-- Número e Status -->
                <div class="flex items-center gap-3">
                  <div 
                    class="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                    :class="getExerciseNumberClass(index)"
                  >
                    {{ index + 1 }}
                  </div>
                  <div
                    v-if="getExerciseStatus(index) === 'completed'"
                    class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
                  >
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <!-- Info do Exercício -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-gray-900 truncate">{{ exercise.name }}</h3>
                  <div v-if="exercise.groupId && isFirstInGroup(exercise, index)" class="mt-1">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      {{ getGroupLabel(exercise.groupId) }}
                    </span>
                  </div>
                  <div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>{{ exercise.series }}x{{ exercise.repetitions }}</span>
                    <span>{{ exercise.rest }}s</span>
                  </div>
                </div>

                <!-- Botão Expandir -->
                <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg 
                    class="w-6 h-6 text-gray-400 transition-transform duration-200"
                    :class="expandedExercises.has(index) ? 'transform rotate-180' : ''"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Conteúdo Expandido -->
            <div
              v-show="expandedExercises.has(index)"
              class="border-t border-gray-200 bg-gray-50 p-4"
            >
              <!-- Botão de Conclusão -->
              <div class="mb-4">
                <button
                  @click.stop="toggleExerciseComplete(index)"
                  class="w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-md"
                  :class="isExerciseCompleted(index)
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'"
                >
                  <span v-if="!isExerciseCompleted(index)" class="flex items-center justify-center gap-2">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    Concluir Exercício
                  </span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reabrir Exercício
                  </span>
                </button>
              </div>

              <!-- Observações -->
              <div v-if="exercise.observations" class="mb-4 p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-gray-700">
                  <span class="font-semibold">Observação:</span> {{ exercise.observations }}
                </p>
              </div>

              <!-- Notas do Aluno -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Suas anotações (opcional)
                </label>
                <textarea
                  v-model="exerciseNotes[index]"
                  rows="2"
                  placeholder="Ex: Aumentei a carga, senti dificuldade..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Espaço para o footer fixo -->
        <div class="h-20"></div>
      </div>

      <!-- Footer Fixo -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
        <div class="max-w-4xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-sm font-semibold text-gray-700">Progresso</p>
              <p class="text-xs text-gray-500">{{ completedExercises }} / {{ workout?.exercises?.length || 0 }} exercícios</p>
            </div>
            <div class="flex-1 mx-6">
              <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                  :style="{ width: progressPercentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
          <button
            @click="finishWorkout"
            :disabled="completedExercises === 0"
            class="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✓ Finalizar Treino
          </button>
        </div>
      </div>

      <!-- Modal de Finalização -->
      <div v-if="showFinishModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Treino Concluído!</h2>
            <p class="text-gray-600">Parabéns pelo treino</p>
          </div>

          <div class="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Duração:</span>
              <span class="font-semibold text-gray-900">{{ formatTimer(elapsedTime) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Exercícios:</span>
              <span class="font-semibold text-gray-900">{{ completedExercises }} / {{ workout.exercises.length }}</span>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="showFinishModal = false"
              class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Continuar
            </button>
            <button
              @click="saveAndExit"
              :disabled="saving"
              class="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { formatDate } = useFormatters()

const workout = ref(null)

// Buscar treino com token
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    navigateTo('/')
    return
  }

  try {
    const response = await $fetch(`/api/workouts/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    workout.value = response
  } catch (error) {
    console.error('Erro ao buscar treino:', error)
  }
})

// Pegar ID do aluno logado
const getUserData = () => {
  if (process.client) {
    const userString = localStorage.getItem('user')
    if (userString) {
      return JSON.parse(userString)
    }
  }
  return null
}

const currentUser = getUserData()
const studentId = computed(() => {
  return currentUser?.studentId
})

// Estado do treino
const expandedExercises = ref(new Set<number>())
const completedSetsPerExercise = ref<{ [key: number]: boolean }>({})
const exerciseNotes = ref<{ [key: number]: string }>({})
const elapsedTime = ref(0)
const timerRunning = ref(false)
const showFinishModal = ref(false)
const saving = ref(false)

let timerInterval: NodeJS.Timeout | null = null

// Computed
const completedExercises = computed(() => {
  return Object.keys(completedSetsPerExercise.value).filter(key => {
    return completedSetsPerExercise.value[parseInt(key)] === true
  }).length
})

const progressPercentage = computed(() => {
  if (!workout.value?.exercises?.length) return 0
  return Math.round((completedExercises.value / workout.value.exercises.length) * 100)
})

// Funções do Timer
const formatTimer = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const startTimer = () => {
  if (!timerRunning.value) {
    timerRunning.value = true
    timerInterval = setInterval(() => {
      elapsedTime.value++
    }, 1000)
  }
}

const pauseTimer = () => {
  timerRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// Funções de Exercícios
const toggleExercise = (index: number) => {
  if (expandedExercises.value.has(index)) {
    expandedExercises.value.delete(index)
  } else {
    expandedExercises.value.add(index)
  }
}

const toggleExerciseComplete = (exerciseIndex: number) => {
  if (isExerciseCompleted(exerciseIndex)) {
    // Reabrir exercício
    delete completedSetsPerExercise.value[exerciseIndex]
  } else {
    // Concluir exercício
    completedSetsPerExercise.value[exerciseIndex] = true
    // Auto-iniciar timer no primeiro exercício
    if (!timerRunning.value && elapsedTime.value === 0) {
      startTimer()
    }
  }
}

const isExerciseCompleted = (exerciseIndex: number): boolean => {
  return completedSetsPerExercise.value[exerciseIndex] === true
}

const getExerciseStatus = (index: number): 'pending' | 'completed' => {
  return isExerciseCompleted(index) ? 'completed' : 'pending'
}

const getExerciseCardClass = (index: number) => {
  const status = getExerciseStatus(index)
  const classes: Record<string, string> = {
    'pending': 'bg-white',
    'completed': 'bg-green-50 border-2 border-green-300'
  }
  return classes[status]
}

const getExerciseNumberClass = (index: number) => {
  const status = getExerciseStatus(index)
  const exercise = workout.value?.exercises[index]
  
  if (status === 'completed') return 'bg-green-500'
  return exercise?.groupId ? 'bg-purple-400' : 'bg-gray-400'
}

// Funções de Finalização
const finishWorkout = () => {
  pauseTimer()
  showFinishModal.value = true
}

const saveAndExit = async () => {
  saving.value = true
  
  console.log('🔍 Debug - studentId:', studentId.value)
  console.log('🔍 Debug - currentUser:', currentUser)
  
  // Verificar se temos o studentId
  if (!studentId.value) {
    alert('Erro: não foi possível identificar o aluno. Faça login novamente.')
    console.error('❌ studentId está vazio!')
    saving.value = false
    return
  }
  
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Sessão expirada. Faça login novamente.')
    saving.value = false
    return
  }
  
  try {
    // Salvar execuções no banco
    for (let i = 0; i < workout.value.exercises.length; i++) {
      const isCompleted = completedSetsPerExercise.value[i]
      if (isCompleted === true) {
        await $fetch('/api/executions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: {
            exerciseId: workout.value.exercises[i].id,
            studentId: studentId.value,
            duration: elapsedTime.value,
            setsDone: workout.value.exercises[i].sets || 0,
            notes: exerciseNotes.value[i] || null
          }
        })
      }
    }
    
    router.push('/student/workouts')
  } catch (error) {
    console.error('Erro ao salvar:', error)
    alert('Erro ao salvar execução. Tente novamente.')
  } finally {
    saving.value = false
  }
}

// Funções de Agrupamento
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

// Cleanup
onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>
