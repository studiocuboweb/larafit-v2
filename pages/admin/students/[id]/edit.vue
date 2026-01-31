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

          <!-- Professor -->
          <div>
            <label for="teacher" class="block text-sm font-medium text-gray-700">
              Professor *
            </label>
            <select
              id="teacher"
              v-model="form.teacherId"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option value="">Selecione um professor</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.user.name }}
              </option>
            </select>
          </div>

          <!-- Telefone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              id="phone"
              v-model="phoneDisplay"
              @input="handlePhoneInput"
              type="tel"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              placeholder="(11) 99425-3218"
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
const { applyMask } = useMask()

const studentId = route.params.id as string
const isEditing = computed(() => studentId && studentId !== 'new')

const form = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  birthDate: '',
  teacherId: '',
  active: true,
  observations: ''
})

const phoneDisplay = ref('')
const teachers = ref([])

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const masked = applyMask(input.value, 'phone')
  phoneDisplay.value = masked
  form.value.phone = masked.replace(/\D/g, '') // Salva apenas números
}

const loading = ref(false)
const error = ref('')
const success = ref('')

// Carregar dados do aluno se estiver editando
onMounted(async () => {
  if (isEditing.value) {
    try {
      const token = localStorage.getItem('token')

      const teacherResponse = await $fetch('/api/teachers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      teachers.value = teacherResponse

      const response = await $fetch(`/api/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (response) {
        form.value = {
          name: response.user.name,
          email: response.user.email,
          password: '',
          phone: response.phone || '',
          birthDate: response.birthDate ? new Date(response.birthDate).toISOString().split('T')[0] : '',
          teacherId: response.teacherId || '',
          active: response.user.active,
          observations: response.observations || ''
        }
        // Aplicar máscara ao telefone carregado
        if (form.value.phone) {
          phoneDisplay.value = applyMask(form.value.phone, 'phone')
        }
      }
    } catch (err) {
      error.value = 'Erro ao carregar dados do aluno'
      console.error(err)
    }
  }
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const token = localStorage.getItem('token')
    
    if (isEditing.value) {
      // Atualizar aluno existente
      await $fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          name: form.value.name,
          teacherId: form.value.teacherId,
          phone: form.value.phone,
          birthDate: form.value.birthDate || null,
          active: form.value.active,
          observations: form.value.observations
        }
      })

      success.value = 'Aluno atualizado com sucesso!'
      setTimeout(() => {
        router.push('/admin/students')
      }, 1500)
    } else {
      // Criar novo aluno
      // Primeiro criar o usuário
      const userData = await $fetch('/api/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          email: form.value.email,
          password: form.value.password,
          name: form.value.name,
          role: 'STUDENT',
          active: form.value.active
        }
      })

      // Depois criar o registro de student
      await $fetch('/api/students', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          userId: userData.id,
          teacherId: form.value.teacherId,
          phone: form.value.phone,
          birthDate: form.value.birthDate || null,
          observations: form.value.observations
        }
      })

      success.value = 'Aluno criado com sucesso!'
      setTimeout(() => {
        router.push('/admin/students')
      }, 1500)
    }
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Erro ao salvar aluno'
  } finally {
    loading.value = false
  }
}
</script>
