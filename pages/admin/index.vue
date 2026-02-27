<template>
  <NuxtLayout name="admin">
    <div class="px-4 sm:px-6 lg:px-8">
      <!-- Cabeçalho da Página -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[#f55139] pt-20">Dashboard</h1>
      </div>

      <!-- Container Principal com as duas linhas -->
      <div class="space-y-10">
        
        <!-- ======================= LINHA 1: AÇÕES RÁPIDAS ======================= -->
        <div>
          <h2 class="text-lg font-medium text-gray-300 mb-4">Ações Rápidas</h2>
          <div class="grid grid-cols-3 gap-4">
            
            <!-- Card: Novo Aluno -->
            <NuxtLink to="/admin/students/new" class="bg-gray-800 rounded-lg shadow p-2 hover:bg-gray-700 transition-colors">
              <div class="flex flex-col items-center text-center">
                <div class="p-3 rounded-full bg-blue-500 text-white mb-3">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <p class="font-semibold text-white">Novo Aluno</p>
              </div>
            </NuxtLink>

            <!-- Card: Novo Treino -->
            <NuxtLink to="/admin/workouts/new" class="bg-gray-800 rounded-lg shadow p-2 hover:bg-gray-700 transition-colors">
              <div class="flex flex-col items-center text-center">
                <div class="p-3 rounded-full bg-purple-500 text-white mb-3">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <p class="font-semibold text-white">Novo Treino</p>
              </div>
            </NuxtLink>

            <!-- Card: Registrar Pagamento -->
            <NuxtLink to="/admin/payments/new" class="bg-gray-800 rounded-lg shadow p-2 hover:bg-gray-700 transition-colors">
              <div class="flex flex-col items-center text-center">
                <div class="p-3 rounded-full bg-yellow-500 text-white mb-3">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p class="font-semibold text-white">Registrar Pagamento</p>
              </div>
            </NuxtLink>

          </div>
        </div>

        <!-- ======================= LINHA 2: ESTATÍSTICAS ======================= -->
        <div>
          <h2 class="text-lg font-medium text-gray-300 mb-4">Estatísticas</h2>
          <div class="grid grid-cols-3 gap-4">

            <!-- Card: Total de Alunos -->
            <div class="bg-white rounded-lg shadow p-2">
              <div class="flex flex-col items-center text-center">
                <div class="p-3 rounded-full bg-blue-100 text-[#f55139] mb-3">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p class="text-sm font-medium text-gray-500">Total de Alunos</p>
                <p class="text-3xl font-bold text-gray-900">{{ displayStats.students }}</p>
              </div>
            </div>

            <!-- Card: Total de Treinos -->
            <div class="bg-white rounded-lg shadow p-2">
              <div class="flex flex-col items-center text-center">
                <div class="p-3 rounded-full bg-purple-100 text-purple-600 mb-3">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p class="text-sm font-medium text-gray-500">Treinos Ativos</p>
                <p class="text-3xl font-bold text-gray-900">{{ displayStats.workouts }}</p>
              </div>
            </div>

            <!-- Card: Receita Mensal -->
            <div class="bg-white rounded-lg shadow p-2">
              <div class="flex flex-col items-center text-center">
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mb-3">
                  <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-sm font-medium text-gray-500">Receita Mensal</p>
                <p class="text-3xl font-bold text-gray-900">R$ {{ displayStats.revenue.toLocaleString('pt-BR') }}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthUser } from '~/composables/useAuthUser'

definePageMeta({
  layout: 'admin',
})

const { user, fetchUser } = useAuthUser()
const isAdmin = computed(() => user.value?.role === 'ADMIN')

const stats = ref({
  students: 0,
  teachers: 0,
  workouts: 0,
  revenue: 0
})

onMounted(async () => {
  if (!user.value) {
    await fetchUser()
  }
  const token = localStorage.getItem('token')
  if (!token) {
    navigateTo('/')
    return
  }
  try {
    const response = await $fetch('/api/stats/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
    stats.value = response
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
  }
})

const displayStats = computed(() => stats.value)
</script>
