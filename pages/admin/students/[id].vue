<template>
  <NuxtLayout name="admin">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <NuxtLink to="/admin/students" class="text-blue-600 hover:text-blue-800 inline-flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para lista
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-900 mt-2">{{ isEditing ? 'Editar Aluno' : 'Novo Aluno' }}</h1>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="success" class="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
        {{ success }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="bg-white shadow rounded-lg p-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Nome -->
          <div class="sm:col-span-2">
            <label for="name" class="block text-sm font-medium text-gray-700">
              Nome Completo *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              :disabled="isEditing"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border disabled:bg-gray-100"
            />
          </div>

          <!-- Senha -->
          <div v-if="!isEditing">
            <label for="password" class="block text-sm font-medium text-gray-700">
              Senha *
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              :required="!isEditing"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          <!-- Telefone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              placeholder="(11) 99999-9999"
            />
          </div>

          <!-- Data de Nascimento -->
          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-700">
              Data de Nascimento
            </label>
            <input
              id="birthDate"
              v-model="form.birthDate"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          <!-- Status -->
          <div>
            <label for="active" class="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="active"
              v-model="form.active"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option :value="true">Ativo</option>
              <option :value="false">Inativo</option>
            </select>
          </div>

          <!-- Observações -->
          <div class="sm:col-span-2">
            <label for="observations" class="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              id="observations"
              v-model="form.observations"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              placeholder="Informações adicionais sobre o aluno..."
            ></textarea>
          </div>
        </div>

        <!-- Buttons -->
        <div class="mt-6 flex justify-end space-x-3">
          <NuxtLink
            to="/admin/students"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </NuxtLink>
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="loading">Salvando...</span>
            <span v-else>{{ isEditing ? 'Atualizar' : 'Criar' }} Aluno</span>
          </button>
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const studentId = route.params.id as string
const isEditing = computed(() => studentId && studentId !== 'new')

const form = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  birthDate: '',
  active: true,
  observations: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

// Carregar dados do aluno se estiver editando
if (isEditing.value) {
  const { data: student } = await useFetch(`/api/students/${studentId}`)
  
  if (student.value) {
    form.value = {
      name: student.value.user.name,
      email: student.value.user.email,
      password: '',
      phone: student.value.phone || '',
      birthDate: student.value.birthDate ? new Date(student.value.birthDate).toISOString().split('T')[0] : '',
      active: student.value.user.active,
      observations: student.value.observations || ''
    }
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    if (isEditing.value) {
      // Atualizar aluno existente
      const { error: updateError } = await useFetch(`/api/students/${studentId}`, {
        method: 'PUT',
        body: {
          name: form.value.name,
          phone: form.value.phone,
          birthDate: form.value.birthDate || null,
          active: form.value.active,
          observations: form.value.observations
        }
      })

      if (updateError.value) {
        error.value = updateError.value.data?.message || 'Erro ao atualizar aluno'
        return
      }

      success.value = 'Aluno atualizado com sucesso!'
      setTimeout(() => {
        router.push('/admin/students')
      }, 1500)
    } else {
      // Criar novo aluno
      // Primeiro criar o usuário
      const { data: userData, error: userError } = await useFetch('/api/users', {
        method: 'POST',
        body: {
          email: form.value.email,
          password: form.value.password,
          name: form.value.name,
          role: 'STUDENT',
          active: form.value.active
        }
      })

      if (userError.value) {
        error.value = userError.value.data?.message || 'Erro ao criar usuário'
        return
      }

      // Depois criar o registro de student
      const { error: studentError } = await useFetch('/api/students', {
        method: 'POST',
        body: {
          userId: userData.value.id,
          phone: form.value.phone,
          birthDate: form.value.birthDate || null,
          observations: form.value.observations
        }
      })

      if (studentError.value) {
        error.value = studentError.value.data?.message || 'Erro ao criar aluno'
        return
      }

      success.value = 'Aluno criado com sucesso!'
      setTimeout(() => {
        router.push('/admin/students')
      }, 1500)
    }
  } catch (err: any) {
    error.value = err.message || 'Erro ao salvar aluno'
  } finally {
    loading.value = false
  }
}
</script>
