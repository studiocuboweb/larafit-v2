<template>
  <div
    class="min-h-screen bg-[#0f222d] relative overflow-hidden flex items-center justify-center p-4"
    id="login-page"
  >
    <div
      class="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-indigo-500 opacity-30 blur-[150px] rounded-full"
    ></div>
    <div
      class="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-green-500 opacity-30 blur-[150px] rounded-full"
    ></div>
    <div
      class="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-sky-500 opacity-20 blur-[150px] rounded-full"
    ></div>

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto pb-6 sm:px-6 z-10">
      <slot />
    </main>

    <!-- Barra de Navegação Inferior Fixa -->
    <nav
      class="fixed bottom-0 left-0 right-0 bg-[#0f222d] border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50"
    >
      <div class="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        <NuxtLink
          to="/student/workouts"
          class="flex flex-col items-center justify-center text-white transition-colors"
          active-class="text-blue-600"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span class="text-[10px] mt-1 font-medium">Treinos</span>
        </NuxtLink>

        <NuxtLink
          to="/student/history"
          class="flex flex-col items-center justify-center text-white transition-colors"
          active-class="text-blue-600"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-[10px] mt-1 font-medium">Histórico</span>
        </NuxtLink>
        <NuxtLink
          to="/student/profile"
          class="flex flex-col items-center justify-center text-white transition-colors"
          active-class="text-blue-600"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span class="text-[10px] mt-1 font-medium">Perfil</span>
        </NuxtLink>
        <!-- Sair -->
        <button
          @click="handleLogout"
          class="flex flex-col items-center justify-center text-white hover:text-red-500 transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span class="text-[10px] mt-1 font-medium">Sair</span>
        </button>
      </div>
    </nav>
  </div>
</template>
<script setup lang="ts">
const handleLogout = () => {
  // 1. Limpa os dados de autenticação
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // 2. Redireciona o usuário para a página de login
  // No Nuxt 3, usamos o navigateTo
  navigateTo("/");
};
</script>