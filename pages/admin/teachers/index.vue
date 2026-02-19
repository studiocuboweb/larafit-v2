<template>
  <NuxtLayout name="admin">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-[#f55139]">Professores</h1>
          <p class="mt-2 text-sm text-white">Lista de todos os professores cadastrados no sistema</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <NuxtLink
            to="/admin/teachers/new"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Novo Professor
          </NuxtLink>
        </div>
      </div>

      <!-- Filtros -->
      <div class="mt-6 bg-white shadow rounded-lg p-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label for="filterStatus" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="filterStatus"
              v-model="filters.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option value="">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          <div>
            <label for="filterSearch" class="block text-sm font-medium text-gray-700">Buscar</label>
            <input
              id="filterSearch"
              v-model="filters.search"
              type="text"
              placeholder="Nome, email ou CREF..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="w-full bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md bg-blue-50 p-3">
                  <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.total }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md bg-green-50 p-3">
                  <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Ativos</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.active }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md bg-purple-50 p-3">
                  <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Treinos Criados</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.totalWorkouts }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Nome
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Telefone
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      CREF
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Especialidades
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Treinos
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="teacher in filteredTeachers" :key="teacher.id">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {{ teacher.user.name }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ teacher.user.email }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ formatPhone(teacher.phone) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ teacher.cref || '-' }}
                    </td>
                    <td class="px-3 py-4 text-sm text-gray-500">
                      <div class="flex flex-wrap gap-1">
                        <span 
                          v-for="specialty in teacher.specialties" 
                          :key="specialty"
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {{ specialty }}
                        </span>
                        <span v-if="teacher.specialties.length === 0" class="text-gray-400">-</span>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ teacher._count.workouts }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span :class="[
                        teacher.user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                        'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                      ]">
                        {{ teacher.user.active ? 'Ativo' : 'Inativo' }}
                      </span>
                    </td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <NuxtLink :to="`/admin/teachers/${teacher.id}`" class="text-blue-600 hover:text-blue-900">
                        Editar
                      </NuxtLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const { formatPhone } = useFormatters()

const filters = ref({
  status: '',
  search: ''
})

// Buscar professores
const { data: teachers } = await useFetch('/api/teachers')

const filteredTeachers = computed(() => {
  if (!teachers.value) return []
  let result = [...teachers.value]
  
  // Filtrar por status
  if (filters.value.status === 'active') {
    result = result.filter(t => t.user.active === true)
  } else if (filters.value.status === 'inactive') {
    result = result.filter(t => t.user.active === false)
  }
  
  // Filtrar por busca (nome, email ou CREF)
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(t => 
      t.user.name.toLowerCase().includes(search) ||
      t.user.email.toLowerCase().includes(search) ||
      (t.cref && t.cref.toLowerCase().includes(search))
    )
  }
  
  return result
})

const stats = computed(() => {
  if (!teachers.value) return { total: 0, active: 0, totalWorkouts: 0 }
  
  return {
    total: teachers.value.length,
    active: teachers.value.filter(t => t.user.active).length,
    totalWorkouts: teachers.value.reduce((sum, t) => sum + t._count.workouts, 0)
  }
})

const clearFilters = () => {
  filters.value = { status: '', search: '' }
}
</script>
