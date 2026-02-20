<template>
  <NuxtLayout name="admin">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <NuxtLink to="/admin/teachers" class="text-blue-600 hover:text-blue-800 inline-flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para lista
        </NuxtLink>
        <h1 class="text-2xl font-bold text-[#f55139] mt-2">{{ isEditing ? 'Editar Professor' : 'Novo Professor' }}</h1>
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

          <!-- Nova Senha (edição) -->
          <div v-else>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Nova Senha (opcional)
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Deixe em branco para manter a senha atual"
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
              v-model="phoneDisplay"
              @input="handlePhoneInput"
              type="tel"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              placeholder="(11) 99425-3218"
            />
          </div>

          <!-- CREF -->
          <div>
            <label for="cref" class="block text-sm font-medium text-gray-700">
              CREF
            </label>
            <input
              id="cref"
              v-model="crefDisplay"
              @input="handleCrefInput"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              placeholder="123456-G/SP"
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

          <!-- Especialidades -->
          <div class="sm:col-span-2">
            <label for="specialties" class="block text-sm font-medium text-gray-700">
              Especialidades
            </label>
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
            <p class="mt-1 text-sm text-gray-500">Ex: Musculação, Funcional, CrossFit, HIIT, Pilates</p>
          </div>
        </div>

        <!-- Buttons -->
        <div class="mt-6 flex justify-end space-x-3">
          <NuxtLink
            to="/admin/teachers"
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
            <span v-else>{{ isEditing ? 'Atualizar' : 'Criar' }} Professor</span>
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

const teacherId = route.params.id as string
const isEditing = computed(() => teacherId && teacherId !== 'new')

const form = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  cref: '',
  active: true,
  specialties: [] as string[]
})

const phoneDisplay = ref('')
const crefDisplay = ref('')
const newSpecialty = ref('')

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
  if (newSpecialty.value.trim()) {
    form.value.specialties.push(newSpecialty.value.trim())
    newSpecialty.value = ''
  }
}

const removeSpecialty = (index: number) => {
  form.value.specialties.splice(index, 1)
}

const loading = ref(false)
const error = ref('')
const success = ref('')

// Carregar dados do professor se estiver editando
if (isEditing.value) {
  const { data: teacher } = await useFetch(`/api/teachers/${teacherId}`)
  
  if (teacher.value) {
    form.value = {
      name: teacher.value.user.name,
      email: teacher.value.user.email,
      password: '',
      phone: teacher.value.phone || '',
      cref: teacher.value.cref || '',
      active: teacher.value.user.active,
      specialties: teacher.value.specialties || []
    }
    
    // Aplicar máscaras aos valores carregados
    if (form.value.phone) {
      phoneDisplay.value = applyMask(form.value.phone, 'phone')
    }
    if (form.value.cref) {
      crefDisplay.value = form.value.cref
    }
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    if (isEditing.value) {
      // Atualizar professor existente
      const { error: updateError } = await useFetch(`/api/teachers/${teacherId}`, {
        method: 'PUT',
        body: {
          name: form.value.name,
          password: form.value.password?.trim() || undefined,
          phone: form.value.phone,
          cref: form.value.cref,
          active: form.value.active,
          specialties: form.value.specialties
        }
      })

      if (updateError.value) {
        error.value = updateError.value.data?.message || 'Erro ao atualizar professor'
        return
      }

      success.value = 'Professor atualizado com sucesso!'
      setTimeout(() => {
        router.push('/admin/teachers')
      }, 1500)
    } else {
      // Criar novo professor
      // Primeiro criar o usuário
      const { data: userData, error: userError } = await useFetch('/api/users', {
        method: 'POST',
        body: {
          email: form.value.email,
          password: form.value.password,
          name: form.value.name,
          role: 'TEACHER',
          active: form.value.active
        }
      })

      if (userError.value) {
        error.value = userError.value.data?.message || 'Erro ao criar usuário'
        return
      }

      // Depois criar o registro de teacher
      const { error: teacherError } = await useFetch('/api/teachers', {
        method: 'POST',
        body: {
          userId: userData.value.id,
          phone: form.value.phone,
          cref: form.value.cref,
          specialties: form.value.specialties
        }
      })

      if (teacherError.value) {
        error.value = teacherError.value.data?.message || 'Erro ao criar professor'
        return
      }

      success.value = 'Professor criado com sucesso!'
      setTimeout(() => {
        router.push('/admin/teachers')
      }, 1500)
    }
  } catch (err: any) {
    error.value = err.message || 'Erro ao salvar professor'
  } finally {
    loading.value = false
  }
}
</script>
