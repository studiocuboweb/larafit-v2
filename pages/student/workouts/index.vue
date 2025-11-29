<template>
  <NuxtLayout name="student">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center mb-6">
        <div class="sm:flex-auto">
          <h1 class="text-3xl font-bold text-gray-900">Meus Treinos</h1>
          <p class="mt-2 text-sm text-gray-700">Acompanhe seus treinos e progresso</p>
        </div>
      </div>

      <!-- Workouts List -->
      <div v-if="workouts.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum treino encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">Entre em contato com seu professor para criar seu treino.</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="workout in workouts" :key="workout.id" class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">{{ workout.name }}</h3>
              <span :class="[
                workout.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
                'px-2 py-1 text-xs font-medium rounded-full'
              ]">
                {{ workout.status === 'ACTIVE' ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
            
            <p v-if="workout.description" class="text-sm text-gray-500 mb-4">
              {{ workout.description }}
            </p>

            <div class="text-sm text-gray-500 mb-4">
              <p>Professor: {{ workout.teacher?.user?.name || 'N/A' }}</p>
              <p>Exercícios: {{ workout.exercises?.length || 0 }}</p>
            </div>

            <NuxtLink :to="`/student/workouts/${workout.id}`" class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Ver Treino
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
// Mock data - depois virá da API
const workouts = ref([
  {
    id: '1',
    name: 'Treino A - Peito e Tríceps',
    description: 'Foco em força e hipertrofia',
    status: 'ACTIVE',
    teacher: {
      user: {
        name: 'João Silva'
      }
    },
    exercises: [1, 2, 3, 4, 5] // Mock
  },
  {
    id: '2',
    name: 'Treino B - Costas e Bíceps',
    description: 'Trabalho de puxada',
    status: 'ACTIVE',
    teacher: {
      user: {
        name: 'João Silva'
      }
    },
    exercises: [1, 2, 3, 4] // Mock
  },
  {
    id: '3',
    name: 'Treino C - Pernas',
    description: 'Treino completo de membros inferiores',
    status: 'ACTIVE',
    teacher: {
      user: {
        name: 'João Silva'
      }
    },
    exercises: [1, 2, 3, 4, 5, 6] // Mock
  }
])

// Buscar treinos do aluno
onMounted(async () => {
  try {
    // TODO: Implementar chamada real à API
    // const { data } = await useFetch('/api/workouts?studentId=STUDENT_ID')
    // workouts.value = data.value
  } catch (error) {
    console.error('Erro ao carregar treinos:', error)
  }
})
</script>
