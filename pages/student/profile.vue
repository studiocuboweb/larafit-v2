<template>
  <div class="min-h-screen">
    <div class="max-w-4xl pb-6">
        <!-- Header -->
        <div class="rounded-lg shadow-md p-2">
          <h1 class="text-2xl font-bold text-white mb-2">Meu Perfil</h1>
          <p class="text-white">Gerencie suas informações pessoais</p>
        </div>

        <!-- Informações do Usuário -->
        <div class="rounded-lg shadow-md p-2 mb-6">
          <h2 class="text-lg font-semibold text-white mb-4">Informações Pessoais</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-white mb-1">Nome</label>
              <input
                type="text"
                v-model="form.name"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-1">Email</label>
              <input
                type="email"
                v-model="form.email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                disabled
              />
              <p class="text-xs text-white mt-1">O email não pode ser alterado</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-1">Telefone</label>
              <input
                type="tel"
                v-model="form.phone"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button
              @click="saveProfile"
              :disabled="saving"
              class="px-6 py-2 bg-[#f55139] text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </div>

        <!-- Alterar Senha -->
        <div class="bg-stone-500 rounded-lg shadow-md p-6 my-10">
          <h2 class="text-lg font-semibold text-white mb-4">Alterar Senha</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-white mb-1">Senha Atual</label>
              <input
                type="password"
                v-model="passwordForm.currentPassword"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite sua senha atual"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-1">Nova Senha</label>
              <input
                type="password"
                v-model="passwordForm.newPassword"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite a nova senha"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-white mb-1">Confirmar Nova Senha</label>
              <input
                type="password"
                v-model="passwordForm.confirmPassword"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirme a nova senha"
              />
            </div>
          </div>

          <div class="mt-6">
            <button
              @click="changePassword"
              :disabled="savingPassword"
              class="px-6 py-2 bg-[#f55139] text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ savingPassword ? 'Alterando...' : 'Alterar Senha' }}
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'student'
})

const { user, fetchUser } = useAuthUser()

const form = ref({
  name: '',
  email: '',
  phone: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const saving = ref(false)
const savingPassword = ref(false)

onMounted(async () => {
  await fetchUser()
  
  if (user.value) {
    form.value.name = user.value.name || ''
    form.value.email = user.value.email || ''
    form.value.phone = user.value.student?.phone || ''
  }
})

const saveProfile = async () => {
  saving.value = true
  try {
    // TODO: Implementar chamada à API para salvar perfil
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Perfil atualizado com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar perfil:', error)
    alert('Erro ao salvar perfil')
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('As senhas não coincidem')
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    alert('A nova senha deve ter pelo menos 6 caracteres')
    return
  }

  savingPassword.value = true
  try {
    // TODO: Implementar chamada à API para alterar senha
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Senha alterada com sucesso!')
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    alert('Erro ao alterar senha')
  } finally {
    savingPassword.value = false
  }
}
</script>
