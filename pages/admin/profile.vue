<template>
  <NuxtLayout name="admin">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p class="mt-2 text-sm text-gray-700">Atualize seus dados de cadastro e senha</p>
      </div>

      <div v-if="error" class="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {{ error }}
      </div>

      <div v-if="success" class="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700">
        {{ success }}
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white shadow rounded-lg p-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label for="name" class="block text-sm font-medium text-gray-700">Nome Completo *</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              :value="form.email"
              type="email"
              disabled
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm px-3 py-2 border"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              id="phone"
              v-model="phoneDisplay"
              @input="handlePhoneInput"
              type="tel"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              placeholder="(11) 99425-3218"
            />
          </div>

          <div>
            <label for="cref" class="block text-sm font-medium text-gray-700">CREF</label>
            <input
              id="cref"
              v-model="crefDisplay"
              @input="handleCrefInput"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              placeholder="123456-G/SP"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Especialidades</label>
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="(specialty, index) in form.specialties"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {{ specialty }}
                <button
                  type="button"
                  @click="removeSpecialty(index)"
                  class="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </span>
            </div>
            <div class="mt-2 flex gap-2">
              <input
                v-model="newSpecialty"
                type="text"
                placeholder="Digite uma especialidade"
                @keyup.enter="addSpecialty"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              />
              <button
                type="button"
                @click="addSpecialty"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Adicionar
              </button>
            </div>
          </div>

          <div class="sm:col-span-2">
            <label for="password" class="block text-sm font-medium text-gray-700">Nova Senha (opcional)</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Deixe em branco para manter a senha atual"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="loading">Salvando...</span>
            <span v-else>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { user, fetchUser } = useAuthUser()
const { applyMask } = useMask()

const form = ref({
  name: '',
  email: '',
  phone: '',
  cref: '',
  specialties: [] as string[],
  password: ''
})

const phoneDisplay = ref('')
const crefDisplay = ref('')
const newSpecialty = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const getAuthHeaders = (): Record<string, string> => {
  if (!process.client) return {}
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const masked = applyMask(input.value, 'phone')
  phoneDisplay.value = masked
  form.value.phone = masked.replace(/\D/g, '')
}

const handleCrefInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const masked = applyMask(input.value, 'cref')
  crefDisplay.value = masked
  form.value.cref = masked
}

const addSpecialty = () => {
  const value = newSpecialty.value.trim()
  if (!value) return
  form.value.specialties.push(value)
  newSpecialty.value = ''
}

const removeSpecialty = (index: number) => {
  form.value.specialties.splice(index, 1)
}

const loadProfile = async () => {
  const teacher = await $fetch<any>('/api/teachers/profile', {
    headers: getAuthHeaders()
  })

  form.value = {
    name: teacher.user.name || '',
    email: teacher.user.email || '',
    phone: teacher.phone || '',
    cref: teacher.cref || '',
    specialties: teacher.specialties || [],
    password: ''
  }

  phoneDisplay.value = form.value.phone ? applyMask(form.value.phone, 'phone') : ''
  crefDisplay.value = form.value.cref
}

onMounted(async () => {
  try {
    if (!user.value) {
      await fetchUser()
    }

    if (user.value?.role !== 'TEACHER') {
      await navigateTo('/admin')
      return
    }

    await loadProfile()
  } catch (err: any) {
    error.value = err?.data?.message || 'Erro ao carregar perfil'
  }
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await $fetch('/api/teachers/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: {
        name: form.value.name,
        phone: form.value.phone,
        cref: form.value.cref,
        specialties: form.value.specialties,
        password: form.value.password?.trim() || undefined
      }
    })

    await fetchUser()
    form.value.password = ''
    success.value = 'Perfil atualizado com sucesso!'
  } catch (err: any) {
    error.value = err?.data?.message || 'Erro ao atualizar perfil'
  } finally {
    loading.value = false
  }
}
</script>
