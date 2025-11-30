<template>
  <NuxtLayout name="student">
    <div class="min-h-screen bg-gray-50 pb-20">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Carregando treino...</p>
      </div>

      <div v-else-if="workout" class="max-w-2xl mx-auto px-4 py-6">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ workout.name }}</h1>
              <p class="text-sm text-gray-500">{{ currentExerciseIndex + 1 }} de {{ workout.exercises.length }} exercícios</p>
            </div>
            <button @click="confirmExit" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="text-center py-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div class="text-5xl font-bold text-gray-900 font-mono">
              {{ formatTimer(elapsedTime) }}
            </div>
            <p class="text-sm text-gray-500 mt-2">Tempo decorrido</p>
          </div>
        </div>

        <div v-if="currentExercise" class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-start gap-4 mb-6">
            <div class="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold text-white" :class="currentExercise.groupId ? 'bg-purple-500' : 'bg-blue-500'">
              {{ currentExerciseIndex + 1 }}
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold text-gray-900">{{ currentExercise.name }}</h2>
              <div class="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                <span>{{ currentExercise.series }} séries</span>
                <span>{{ currentExercise.repetitions }} reps</span>
                <span>{{ currentExercise.rest }}s rest</span>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-700">Séries Completadas</h3>
              <span class="text-sm text-gray-600">{{ completedSets }} / {{ currentExercise.series }}</span>
            </div>
            <div class="grid grid-cols-5 gap-2">
              <button v-for="set in currentExercise.series" :key="set" @click="toggleSet(set)" class="h-12 rounded-lg font-semibold transition-all" :class="isSetCompleted(set) ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                {{ set }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button v-if="currentExerciseIndex > 0" @click="previousExercise" class="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
            ← Anterior
          </button>
          <button v-if="currentExerciseIndex < workout.exercises.length - 1" @click="nextExercise" class="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg" :disabled="completedSets === 0">
            Próximo →
          </button>
          <button v-else @click="finishWorkout" class="flex-1 bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg" :disabled="completedSets === 0">
            ✓ Finalizar
          </button>
        </div>
      </div>

      <div v-if="showExitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <h2 class="text-xl font-bold text-gray-900 mb-2">Deseja sair?</h2>
          <p class="text-gray-600 mb-6">O progresso será perdido.</p>
          <div class="flex gap-3">
            <button @click="showExitModal = false" class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold">Continuar</button>
            <button @click="exitWorkout" class="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold">Sair</button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const workout = ref<any>(null)
const currentExerciseIndex = ref(0)
const completedSetsPerExercise = ref<{ [key: number]: Set<number> }>({})
const elapsedTime = ref(0)
const showExitModal = ref(false)
let timerInterval: NodeJS.Timeout | null = null

const currentExercise = computed(() => workout.value?.exercises[currentExerciseIndex.value])
const completedSets = computed(() => completedSetsPerExercise.value[currentExerciseIndex.value]?.size || 0)

const formatTimer = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const isSetCompleted = (setNumber: number): boolean => {
  return completedSetsPerExercise.value[currentExerciseIndex.value]?.has(setNumber) || false
}

const toggleSet = (setNumber: number) => {
  if (!completedSetsPerExercise.value[currentExerciseIndex.value]) {
    completedSetsPerExercise.value[currentExerciseIndex.value] = new Set()
  }
  const sets = completedSetsPerExercise.value[currentExerciseIndex.value]
  if (sets.has(setNumber)) sets.delete(setNumber)
  else sets.add(setNumber)
}

const nextExercise = () => {
  if (completedSets.value > 0 && currentExerciseIndex.value < workout.value.exercises.length - 1) {
    currentExerciseIndex.value++
  }
}

const previousExercise = () => {
  if (currentExerciseIndex.value > 0) currentExerciseIndex.value--
}

const confirmExit = () => { showExitModal.value = true }
const exitWorkout = () => router.push('/student/workouts')

const finishWorkout = async () => {
  router.push('/student/workouts')
}

onMounted(async () => {
  try {
    const data = await $fetch(`/api/workouts/${route.params.id}`)
    workout.value = data
    timerInterval = setInterval(() => elapsedTime.value++, 1000)
  } catch (error) {
    router.push('/student/workouts')
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>
