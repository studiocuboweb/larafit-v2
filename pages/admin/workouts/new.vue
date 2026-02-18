<template>
  <NuxtLayout name="admin">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-3xl font-bold text-gray-900">Novo Treino</h1>
        <p class="mt-2 text-sm text-gray-700">Crie um novo treino para um aluno</p>
      </div>
    </div>

    <div class="mt-8 max-w-3xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Card do formulário -->
        <div class="bg-white shadow rounded-lg p-6 space-y-6">
          <!-- Nome do Treino -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Nome do Treino *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Ex: Treino A - Peito e Tríceps"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          <!-- Descrição -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="Descreva o objetivo do treino..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            ></textarea>
          </div>

          <!-- Aluno -->
          <div>
            <label for="studentId" class="block text-sm font-medium text-gray-700">
              Aluno *
            </label>
            <select
              id="studentId"
              v-model="form.studentId"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option value="">Selecione um aluno</option>
              <option v-for="student in studentOptions" :key="student.id" :value="student.id">
                {{ getStudentLabel(student) }}
              </option>
            </select>
          </div>

          <!-- Professor -->
          <div>
            <label for="teacherId" class="block text-sm font-medium text-gray-700">
              Professor *
            </label>
            <input
              id="teacherId"
              :value="selectedTeacherName"
              type="text"
              disabled
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-700 shadow-sm px-3 py-2 border"
            />
            <p class="mt-1 text-sm text-gray-500">
              O professor é definido automaticamente com base no aluno selecionado.
            </p>
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              v-model="form.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option value="DRAFT">Rascunho (você pode adicionar exercícios depois)</option>
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </select>
            <p class="mt-1 text-sm text-gray-500">
              Recomendamos criar como Rascunho e ativar após adicionar os exercícios
            </p>
          </div>

          <!-- Datas -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700">
                Data de Início
              </label>
              <input
                id="startDate"
                v-model="form.startDate"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              />
            </div>

            <div>
              <label for="endDate" class="block text-sm font-medium text-gray-700">
                Data de Término (opcional)
              </label>
              <input
                id="endDate"
                v-model="form.endDate"
                type="date"
                :min="form.startDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              />
            </div>
          </div>
        </div>

        <!-- Mensagem de erro -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
            </div>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex justify-end gap-3">
          <NuxtLink
            to="/admin/workouts"
            class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancelar
          </NuxtLink>
          <button
            type="submit"
            :disabled="loading"
            class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Criando...' : 'Criar Treino' }}
          </button>
        </div>
      </form>
    </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">

const router = useRouter()
const { user, fetchUser } = useAuthUser()

const form = ref({
  name: '',
  description: '',
  studentId: '',
  teacherId: '',
  status: 'DRAFT',
  startDate: new Date().toISOString().split('T')[0],
  endDate: ''
})

const loading = ref(false)
const error = ref('')

// Buscar alunos
const studentOptions = ref<any[]>([])

const getAuthHeaders = (): Record<string, string> => {
  if (!process.client) return {}
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

onMounted(async () => {
  if (!user.value) {
    await fetchUser()
  }

  const data = await $fetch<any[]>('/api/students', {
    headers: getAuthHeaders()
  })
  studentOptions.value = Array.isArray(data) ? data : []
})

const getStudentLabel = (student: any) => {
  if (user.value?.role === 'ADMIN') {
    const teacherName = student?.teacher?.user?.name || 'Sem professor'
    return `${student.user.name} - ${teacherName}`
  }

  return student.user.name
}

const selectedStudent = computed(() => {
  return studentOptions.value.find((student: any) => student.id === form.value.studentId) || null
})

const selectedTeacherName = computed(() => {
  return selectedStudent.value?.teacher?.user?.name || 'Selecione um aluno primeiro'
})

watch(() => form.value.studentId, () => {
  form.value.teacherId = selectedStudent.value?.teacherId || ''
})

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''

    const payload = {
      name: form.value.name,
      description: form.value.description || null,
      studentId: form.value.studentId,
      teacherId: form.value.teacherId,
      status: form.value.status,
      startDate: form.value.startDate,
      endDate: form.value.endDate || null
    }

    const workout: any = await $fetch('/api/workouts', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: payload
    })

    // Redirecionar para edição para adicionar exercícios
    router.push(`/admin/workouts/${workout.id}/edit`)
  } catch (err: any) {
    error.value = err.data?.message || 'Erro ao criar treino. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>
