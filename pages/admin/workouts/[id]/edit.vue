<template>
  <NuxtLayout name="admin">
    <div class="px-4 sm:px-6 lg:px-8">
      <div v-if="workout" class="space-y-6">
      <!-- Header -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ workout.name }}</h1>
          <p class="mt-2 text-sm text-gray-700">
            Aluno: {{ workout.student.user.name }} | Professor: {{ workout.teacher.user.name }}
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <NuxtLink
            to="/admin/workouts"
            class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            ← Voltar
          </NuxtLink>
        </div>
      </div>

      <!-- Dados do Treino -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Dados do Treino</h2>

        <div
          v-if="workoutFeedback.message"
          :class="[
            'mb-4 rounded-md p-3 text-sm',
            workoutFeedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          ]"
        >
          {{ workoutFeedback.message }}
        </div>

        <form @submit.prevent="updateWorkout" class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nome do Treino</label>
              <input
                v-model="workoutForm.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select
                v-model="workoutForm.status"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              >
                <option value="DRAFT">Rascunho</option>
                <option value="ACTIVE">Ativo</option>
                <option value="INACTIVE">Inativo</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              v-model="workoutForm.description"
              rows="2"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Data Início</label>
              <input
                v-model="workoutForm.startDate"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Data Término</label>
              <input
                v-model="workoutForm.endDate"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="savingWorkout"
              class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
            >
              {{ savingWorkout ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Exercícios -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">
            Exercícios ({{ exercises.length }})
          </h2>
          <div class="flex gap-2">
            <button
              v-if="selectedExercises.length >= 2"
              @click="groupSelected"
              class="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
            >
              🔗 Agrupar Selecionados ({{ selectedExercises.length }})
            </button>
            <button
              @click="showLibraryModal = true"
              class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            >
              📚 Adicionar da Biblioteca
            </button>
            <button
              @click="openExerciseModal()"
              class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              + Criar Novo Exercício
            </button>
          </div>
        </div>

        <!-- Lista de exercícios -->
        <div v-if="exercises.length > 0" class="space-y-2">
          <div
            v-for="(exercise, index) in exercises"
            :key="exercise.id"
            class="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            :class="{
              'border-l-4 border-l-purple-500 bg-purple-50': exercise.groupId && isFirstInGroup(exercise, index),
              'border-l-4 border-l-purple-300 bg-purple-25 ml-4': exercise.groupId && !isFirstInGroup(exercise, index),
              'border-gray-200': !exercise.groupId
            }"
          >
            <div class="flex items-start gap-4">
              <!-- Checkbox para seleção -->
              <input
                type="checkbox"
                :value="exercise.id"
                v-model="selectedExercises"
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />

              <!-- Número de ordem -->
              <div class="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                {{ exercise.order }}
              </div>

              <!-- Conteúdo do exercício -->
              <div class="flex-1 min-w-0">
                <!-- Badge de grupo -->
                <div v-if="exercise.groupId && isFirstInGroup(exercise, index)" class="mb-2">
                  <span class="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                    📦 {{ getGroupLabel(exercise.groupId) }}
                  </span>
                </div>

                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-sm font-semibold text-gray-900">{{ exercise.name }}</h3>
                    <div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span>{{ exercise.sets }} séries</span>
                      <span>{{ exercise.reps }} reps</span>
                      <span v-if="exercise.weight">{{ exercise.weight }}</span>
                      <span v-if="exercise.rest">Descanso: {{ exercise.rest }}s</span>
                    </div>
                    <p v-if="exercise.notes" class="mt-1 text-sm text-gray-600">{{ exercise.notes }}</p>
                  </div>

                  <!-- Ações -->
                  <div class="flex items-center gap-1 ml-4">
                    <button
                      @click="moveExercise(exercise.id, 'up')"
                      :disabled="index === 0"
                      class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Mover para cima"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      @click="moveExercise(exercise.id, 'down')"
                      :disabled="index === exercises.length - 1"
                      class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Mover para baixo"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      @click="openExerciseModal(exercise)"
                      class="p-1 text-blue-400 hover:text-blue-600"
                      title="Editar"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      v-if="exercise.groupId"
                      @click="ungroupExercise(exercise.id)"
                      class="p-1 text-purple-400 hover:text-purple-600"
                      title="Desagrupar"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    </button>
                    <button
                      @click="confirmDeleteExercise(exercise)"
                      class="p-1 text-red-400 hover:text-red-600"
                      title="Excluir"
                    >
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-500">
          <p>Nenhum exercício adicionado ainda</p>
          <p class="text-sm mt-1">Clique em "Adicionar da Biblioteca" ou "Criar Novo Exercício"</p>
        </div>
      </div>
    </div>

    <!-- Modal de Exercício -->
    <div v-if="showExerciseModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ editingExercise ? 'Editar Exercício' : 'Novo Exercício' }}
          </h3>

          <form @submit.prevent="saveExercise" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nome do Exercício *</label>
              <input
                v-model="exerciseForm.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Séries *</label>
                <input
                  v-model.number="exerciseForm.sets"
                  type="number"
                  min="1"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Repetições *</label>
                <input
                  v-model="exerciseForm.reps"
                  type="text"
                  required
                  placeholder="Ex: 12 ou 10-12"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Peso</label>
                <input
                  v-model="exerciseForm.weight"
                  type="text"
                  placeholder="Ex: 20kg ou peso corporal"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Descanso (segundos)</label>
                <input
                  v-model.number="exerciseForm.rest"
                  type="number"
                  min="0"
                  placeholder="Ex: 60"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Observações</label>
              <textarea
                v-model="exerciseForm.notes"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">URL do Vídeo</label>
              <input
                v-model="exerciseForm.videoUrl"
                type="url"
                placeholder="https://youtube.com/..."
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeExerciseModal"
                class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="savingExercise"
                class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
              >
                {{ savingExercise ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Biblioteca -->
    <div v-if="showLibraryModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Biblioteca de Exercícios</h3>

          <!-- Filtros da biblioteca -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Categoria</label>
              <select
                v-model="libraryFilters.category"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border text-sm"
              >
                <option value="">Todas</option>
                <option v-for="cat in libraryCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Equipamento</label>
              <select
                v-model="libraryFilters.equipment"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border text-sm"
              >
                <option value="">Todos</option>
                <option v-for="eq in libraryEquipment" :key="eq" :value="eq">{{ eq }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Buscar</label>
              <input
                v-model="libraryFilters.search"
                type="text"
                placeholder="Nome do exercício..."
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border text-sm"
              />
            </div>
          </div>

          <!-- Lista de exercícios da biblioteca -->
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div
              v-for="exercise in filteredLibraryExercises"
              :key="exercise.id"
              @click="addFromLibrary(exercise)"
              class="border rounded-lg p-4 hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="text-sm font-semibold text-gray-900">{{ exercise.name }}</h4>
                  <p class="text-xs text-gray-500 mt-1">{{ exercise.description }}</p>
                  <div class="flex gap-2 mt-2">
                    <span class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                      {{ exercise.category }}
                    </span>
                    <span class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                      {{ exercise.equipment }}
                    </span>
                  </div>
                </div>
                <div class="text-xs text-gray-500">
                  {{ exercise.defaultSets }}x{{ exercise.defaultReps }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              @click="showLibraryModal = false"
              class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">

const route = useRoute()
const workoutId = route.params.id as string

// Estados
const workout = ref<any>(null)
const exercises = ref<any[]>([])
const selectedExercises = ref<string[]>([])
const savingWorkout = ref(false)
const savingExercise = ref(false)
const showExerciseModal = ref(false)
const showLibraryModal = ref(false)
const editingExercise = ref<any>(null)
const workoutFeedback = ref<{ type: 'success' | 'error'; message: string }>({
  type: 'success',
  message: ''
})
let workoutFeedbackTimeout: ReturnType<typeof setTimeout> | null = null

// Formulários
const workoutForm = ref({
  name: '',
  description: '',
  status: 'DRAFT',
  startDate: '',
  endDate: ''
})

const exerciseForm = ref({
  name: '',
  sets: 3,
  reps: '12',
  weight: '',
  rest: 60,
  notes: '',
  videoUrl: ''
})

// Biblioteca
const libraryExercises = ref<any[]>([])
const libraryCategories = ref<string[]>([])
const libraryEquipment = ref<string[]>([])
const libraryFilters = ref({
  category: '',
  equipment: '',
  search: ''
})

const getAuthHeaders = (): Record<string, string> => {
  if (!process.client) return {}
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Buscar dados iniciais
const loadWorkout = async () => {
  const data = await $fetch<any>(`/api/workouts/${workoutId}`, {
    headers: getAuthHeaders()
  })
  workout.value = data
  exercises.value = data.exercises || []
  
  workoutForm.value = {
    name: data.name,
    description: data.description || '',
    status: data.status,
    startDate: data.startDate?.split('T')[0] || '',
    endDate: data.endDate?.split('T')[0] || ''
  }
}

const loadLibrary = async () => {
  const data = await $fetch<any>('/api/exercises/library', {
    headers: getAuthHeaders()
  })
  libraryExercises.value = data.exercises
  libraryCategories.value = data.categories
  libraryEquipment.value = data.equipmentTypes
}

onMounted(async () => {
  await Promise.all([loadWorkout(), loadLibrary()])
})

const filteredLibraryExercises = computed(() => {
  let filtered = libraryExercises.value

  if (libraryFilters.value.category) {
    filtered = filtered.filter(e => e.category === libraryFilters.value.category)
  }

  if (libraryFilters.value.equipment) {
    filtered = filtered.filter(e => e.equipment === libraryFilters.value.equipment)
  }

  if (libraryFilters.value.search) {
    const search = libraryFilters.value.search.toLowerCase()
    filtered = filtered.filter(e => 
      e.name.toLowerCase().includes(search) ||
      e.description.toLowerCase().includes(search)
    )
  }

  return filtered
})

// Funções de grupos
const isFirstInGroup = (exercise: any, index: number) => {
  if (!exercise.groupId) return false
  if (index === 0) return true
  return exercises.value[index - 1].groupId !== exercise.groupId
}

const getGroupLabel = (groupId: string) => {
  const count = exercises.value.filter(e => e.groupId === groupId).length
  const labels: Record<number, string> = {
    2: 'BISET',
    3: 'TRISET',
    4: 'QUADRISET'
  }
  return labels[count] || `SUPERSET (${count})`
}

// CRUD de treino
const updateWorkout = async () => {
  try {
    savingWorkout.value = true
    workoutFeedback.value.message = ''

    await $fetch(`/api/workouts/${workoutId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: workoutForm.value
    })
    await loadWorkout()

    workoutFeedback.value = {
      type: 'success',
      message: 'Treino atualizado com sucesso.'
    }

    if (workoutFeedbackTimeout) clearTimeout(workoutFeedbackTimeout)
    workoutFeedbackTimeout = setTimeout(() => {
      workoutFeedback.value.message = ''
    }, 3500)
  } catch (error) {
    workoutFeedback.value = {
      type: 'error',
      message: 'Erro ao atualizar treino. Tente novamente.'
    }
  } finally {
    savingWorkout.value = false
  }
}

// CRUD de exercícios
const openExerciseModal = (exercise?: any) => {
  if (exercise) {
    editingExercise.value = exercise
    exerciseForm.value = {
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight || '',
      rest: exercise.rest || 60,
      notes: exercise.notes || '',
      videoUrl: exercise.videoUrl || ''
    }
  } else {
    editingExercise.value = null
    exerciseForm.value = {
      name: '',
      sets: 3,
      reps: '12',
      weight: '',
      rest: 60,
      notes: '',
      videoUrl: ''
    }
  }
  showExerciseModal.value = true
}

const closeExerciseModal = () => {
  showExerciseModal.value = false
  editingExercise.value = null
}

const saveExercise = async () => {
  try {
    savingExercise.value = true

    if (editingExercise.value) {
      // Editar
      await $fetch(`/api/exercises/${editingExercise.value.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: exerciseForm.value
      })
    } else {
      // Criar
      await $fetch(`/api/workouts/${workoutId}/exercises`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: exerciseForm.value
      })
    }

    await loadWorkout()
    closeExerciseModal()
  } catch (error) {
    alert('Erro ao salvar exercício')
  } finally {
    savingExercise.value = false
  }
}

const addFromLibrary = async (template: any) => {
  try {
    await $fetch(`/api/workouts/${workoutId}/exercises`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: {
        name: template.name,
        sets: template.defaultSets,
        reps: template.defaultReps,
        rest: template.defaultRest,
        weight: '',
        notes: template.description,
        videoUrl: template.videoUrl || ''
      }
    })
    await loadWorkout()
    showLibraryModal.value = false
  } catch (error) {
    alert('Erro ao adicionar exercício')
  }
}

const confirmDeleteExercise = async (exercise: any) => {
  if (confirm(`Excluir "${exercise.name}"?`)) {
    try {
      await $fetch(`/api/exercises/${exercise.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      await loadWorkout()
    } catch (error) {
      alert('Erro ao excluir exercício')
    }
  }
}

const moveExercise = async (exerciseId: string, direction: 'up' | 'down') => {
  try {
    const data = await $fetch(`/api/exercises/${exerciseId}/reorder`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { direction }
    })
    exercises.value = data
  } catch (error) {
    alert('Erro ao reordenar exercício')
  }
}

// Agrupamento
const groupSelected = async () => {
  if (selectedExercises.value.length < 2) {
    alert('Selecione pelo menos 2 exercícios para agrupar')
    return
  }

  try {
    await $fetch(`/api/exercises/${selectedExercises.value[0]}/group`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { exerciseIds: selectedExercises.value }
    })
    selectedExercises.value = []
    await loadWorkout()
  } catch (error: any) {
    alert(error.data?.message || 'Erro ao agrupar exercícios')
  }
}

const ungroupExercise = async (exerciseId: string) => {
  try {
    await $fetch(`/api/exercises/${exerciseId}/group`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: { ungroup: true }
    })
    await loadWorkout()
  } catch (error) {
    alert('Erro ao desagrupar exercício')
  }
}
</script>
