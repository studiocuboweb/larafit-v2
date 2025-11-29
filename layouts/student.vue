<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-blue-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-white">LaraFit</h1>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/student/workouts" class="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium">
              Meus Treinos
            </NuxtLink>
            <NuxtLink to="/student/profile" class="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium">
              Perfil
            </NuxtLink>
            <button class="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
