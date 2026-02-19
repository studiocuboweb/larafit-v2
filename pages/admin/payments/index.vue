<template>
  <NuxtLayout name="admin">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-[#f55139]">Pagamentos</h1>
          <p class="mt-2 text-sm text-white">Gestão de mensalidades e pagamentos dos alunos</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <NuxtLink
            to="/admin/payments/new"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Registrar Pagamento
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
              @change="applyFilters"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option value="">Todos</option>
              <option value="PENDING">Pendente</option>
              <option value="PAID">Pago</option>
              <option value="OVERDUE">Atrasado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>

          <div>
            <label for="filterStudent" class="block text-sm font-medium text-gray-700">Aluno</label>
            <select
              id="filterStudent"
              v-model="filters.studentId"
              @change="applyFilters"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option value="">Todos os alunos</option>
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.user.name }}
              </option>
            </select>
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
      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
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
                  <dt class="text-sm font-medium text-gray-500 truncate">Pagos</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.paid }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md bg-yellow-50 p-3">
                  <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Pendentes</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.pending }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md bg-red-50 p-3">
                  <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Atrasados</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.overdue }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="rounded-md bg-blue-50 p-3">
                  <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Recebido</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ formatCurrency(stats.totalPaid) }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabela de Pagamentos -->
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Aluno
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Mês Ref.
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Vencimento
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Valor
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Método
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
                  <tr v-for="payment in filteredPayments" :key="payment.id">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {{ payment.student.user.name }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ formatMonth(payment.referenceMonth) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ formatDate(payment.dueDate) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                      {{ formatCurrency(payment.amount) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {{ formatPaymentMethod(payment.method) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      <span :class="[
                        getStatusClass(payment.status),
                        'inline-flex rounded-full px-2 text-xs font-semibold leading-5'
                      ]">
                        {{ formatStatus(payment.status) }}
                      </span>
                    </td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <NuxtLink :to="`/admin/payments/${payment.id}`" class="text-blue-600 hover:text-blue-900 mr-4">
                        Editar
                      </NuxtLink>
                      <button
                        v-if="payment.status === 'PENDING'"
                        @click="markAsPaid(payment.id)"
                        class="text-green-600 hover:text-green-900"
                      >
                        Marcar Pago
                      </button>
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
const { formatDate, formatCurrency } = useFormatters()

const filters = ref({
  status: '',
  studentId: ''
})

const payments = ref([])
const students = ref([])

// Buscar dados no cliente
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    navigateTo('/')
    return
  }

  try {
    const [paymentsResponse, studentsResponse] = await Promise.all([
      $fetch('/api/payments', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      $fetch('/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
    payments.value = paymentsResponse
    students.value = studentsResponse
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  }
})

const refreshPayments = async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const queryParams = new URLSearchParams()
    if (filters.value.status) queryParams.append('status', filters.value.status)
    if (filters.value.studentId) queryParams.append('studentId', filters.value.studentId)
    
    const url = `/api/payments${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await $fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    payments.value = response
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error)
  }
}

const filteredPayments = computed(() => {
  if (!payments.value) return []
  let result = [...payments.value]
  
  // Aplicar filtros localmente também para garantir
  if (filters.value.status) {
    result = result.filter(p => p.status === filters.value.status)
  }
  
  if (filters.value.studentId) {
    result = result.filter(p => p.studentId === filters.value.studentId)
  }
  
  return result
})

const stats = computed(() => {
  if (!payments.value) return { paid: 0, pending: 0, overdue: 0, totalPaid: 0 }
  
  // Calcular stats com base em todos os pagamentos (não filtrados)
  return {
    paid: payments.value.filter(p => p.status === 'PAID').length,
    pending: payments.value.filter(p => p.status === 'PENDING').length,
    overdue: payments.value.filter(p => p.status === 'OVERDUE').length,
    totalPaid: payments.value
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0)
  }
})

const applyFilters = async () => {
  await refreshPayments()
}

const clearFilters = () => {
  filters.value = { status: '', studentId: '' }
  refreshPayments()
}

const markAsPaid = async (paymentId: string) => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    await $fetch(`/api/payments/${paymentId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        status: 'PAID',
        paymentDate: new Date().toISOString()
      }
    })
    refreshPayments()
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error)
  }
}

const formatMonth = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

const formatPaymentMethod = (method: string | null) => {
  const methods: Record<string, string> = {
    'CASH': 'Dinheiro',
    'CREDIT_CARD': 'Cartão Crédito',
    'DEBIT_CARD': 'Cartão Débito',
    'PIX': 'PIX',
    'BANK_TRANSFER': 'Transferência'
  }
  return method ? methods[method] || method : '-'
}

const formatStatus = (status: string) => {
  const statuses: Record<string, string> = {
    'PENDING': 'Pendente',
    'PAID': 'Pago',
    'OVERDUE': 'Atrasado',
    'CANCELLED': 'Cancelado'
  }
  return statuses[status] || status
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'PAID': 'bg-green-100 text-green-800',
    'OVERDUE': 'bg-red-100 text-red-800',
    'CANCELLED': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>
