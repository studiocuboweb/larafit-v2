<template>
  <NuxtLayout name="admin">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <NuxtLink to="/admin/payments" class="text-blue-600 hover:text-blue-800 inline-flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para lista
        </NuxtLink>
        <h1 class="text-2xl font-bold text-[#f55139] mt-2">{{ isEditing ? 'Editar Pagamento' : 'Registrar Pagamento' }}</h1>
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
          <!-- Aluno -->
          <div class="sm:col-span-2">
            <label for="studentId" class="block text-sm font-medium text-gray-700">
              Aluno *
            </label>
            <select
              id="studentId"
              v-model="form.studentId"
              required
              :disabled="isEditing"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border disabled:bg-gray-100"
            >
              <option value="">Selecione um aluno</option>
              <option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.user.name }}
              </option>
            </select>
          </div>

          <!-- Mês de Referência -->
          <div>
            <label for="referenceMonth" class="block text-sm font-medium text-gray-700">
              Mês de Referência *
            </label>
            <input
              id="referenceMonth"
              v-model="form.referenceMonth"
              type="month"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          <!-- Valor -->
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">
              Valor (R$) *
            </label>
            <input
              id="amount"
              v-model.number="form.amount"
              type="number"
              step="0.01"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              placeholder="150.00"
            />
          </div>

          <!-- Data de Vencimento -->
          <div>
            <label for="dueDate" class="block text-sm font-medium text-gray-700">
              Data de Vencimento *
            </label>
            <input
              id="dueDate"
              v-model="form.dueDate"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
          </div>

          <!-- Data de Pagamento -->
          <div>
            <label for="paymentDate" class="block text-sm font-medium text-gray-700">
              Data de Pagamento
            </label>
            <input
              id="paymentDate"
              v-model="form.paymentDate"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            />
            <p class="mt-1 text-sm text-gray-500">Deixe em branco se ainda não foi pago</p>
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="status"
              v-model="form.status"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option value="PENDING">Pendente</option>
              <option value="PAID">Pago</option>
              <option value="OVERDUE">Atrasado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>

          <!-- Método de Pagamento -->
          <div>
            <label for="method" class="block text-sm font-medium text-gray-700">
              Método de Pagamento
            </label>
            <select
              id="method"
              v-model="form.method"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
            >
              <option value="">Selecione</option>
              <option value="CASH">Dinheiro</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="DEBIT_CARD">Cartão de Débito</option>
              <option value="PIX">PIX</option>
              <option value="BANK_TRANSFER">Transferência Bancária</option>
            </select>
          </div>

          <!-- Descrição -->
          <div class="sm:col-span-2">
            <label for="description" class="block text-sm font-medium text-gray-700">
              Descrição / Observações
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              placeholder="Informações adicionais sobre o pagamento..."
            ></textarea>
          </div>
        </div>

        <!-- Buttons -->
        <div class="mt-6 flex justify-end space-x-3">
          <NuxtLink
            to="/admin/payments"
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
            <span v-else>{{ isEditing ? 'Atualizar' : 'Registrar' }} Pagamento</span>
          </button>
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const paymentId = route.params.id as string
const isEditing = computed(() => paymentId && paymentId !== 'new')

// Buscar alunos para o select
const { data: students } = await useFetch('/api/students')

const form = ref({
  studentId: '',
  amount: 0,
  dueDate: '',
  paymentDate: '',
  status: 'PENDING',
  method: '',
  description: '',
  referenceMonth: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

// Carregar dados do pagamento se estiver editando
if (isEditing.value) {
  const { data: payment } = await useFetch(`/api/payments/${paymentId}`)
  
  if (payment.value) {
    form.value = {
      studentId: payment.value.studentId,
      amount: payment.value.amount,
      dueDate: new Date(payment.value.dueDate).toISOString().split('T')[0],
      paymentDate: payment.value.paymentDate ? new Date(payment.value.paymentDate).toISOString().split('T')[0] : '',
      status: payment.value.status,
      method: payment.value.method || '',
      description: payment.value.description || '',
      referenceMonth: new Date(payment.value.referenceMonth).toISOString().substring(0, 7)
    }
  }
} else {
  // Valores padrão para novo pagamento
  const now = new Date()
  form.value.referenceMonth = now.toISOString().substring(0, 7)
  form.value.dueDate = new Date(now.getFullYear(), now.getMonth(), 10).toISOString().split('T')[0]
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // Preparar dados
    const paymentData = {
      ...form.value,
      amount: Number(form.value.amount),
      referenceMonth: form.value.referenceMonth + '-01',
      paymentDate: form.value.paymentDate || null,
      method: form.value.method || null
    }

    if (isEditing.value) {
      // Atualizar pagamento existente
      const { error: updateError } = await useFetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        body: paymentData
      })

      if (updateError.value) {
        error.value = updateError.value.data?.message || 'Erro ao atualizar pagamento'
        return
      }

      success.value = 'Pagamento atualizado com sucesso!'
    } else {
      // Criar novo pagamento
      const { error: createError } = await useFetch('/api/payments', {
        method: 'POST',
        body: paymentData
      })

      if (createError.value) {
        error.value = createError.value.data?.message || 'Erro ao criar pagamento'
        return
      }

      success.value = 'Pagamento registrado com sucesso!'
    }

    setTimeout(() => {
      router.push('/admin/payments')
    }, 1500)
  } catch (err: any) {
    error.value = err.message || 'Erro ao salvar pagamento'
  } finally {
    loading.value = false
  }
}
</script>
