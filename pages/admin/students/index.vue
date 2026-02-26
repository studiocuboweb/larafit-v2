<template>
  <NuxtLayout name="admin">
    <div class="px-4 sm:px-6 lg:px-8 pt-20">
      <!-- Header -->
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-[#f55139]">Alunos</h1>
          <p class="mt-2 text-sm text-white">
            Lista de todos os alunos cadastrados no sistema
          </p>
        </div>

        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <NuxtLink
            to="/admin/students/new"
            class="inline-flex items-center justify-center rounded-md border border-transparent    px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#e14a33]"
          >
            + Novo Aluno
          </NuxtLink>
        </div>
      </div>

      <!-- Filtros -->
      <div class="mt-6 bg-white shadow rounded-lg p-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              v-model="filters.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
            >
              <option value="">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Buscar
            </label>

            <input
              v-model="filters.search"
              type="text"
              placeholder="Nome ou email..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"
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

      <!-- Estatísticas (NOVO LAYOUT) -->
      <div class="mt-6 grid grid-cols-3 gap-5">
        <!-- TOTAL -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex flex-col items-center text-center">
            <div class="rounded-full bg-blue-100 p-4 mb-3">
              <svg
                class="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>

            <span class="text-sm text-gray-500"> Total </span>

            <span class="text-2xl font-bold text-gray-900">
              {{ stats.total }}
            </span>
          </div>
        </div>

        <!-- ATIVOS -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex flex-col items-center text-center">
            <div class="rounded-full bg-green-100 p-4 mb-3">
              <svg
                class="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <span class="text-sm text-gray-500"> Ativos </span>

            <span class="text-2xl font-bold text-gray-900">
              {{ stats.active }}
            </span>
          </div>
        </div>

        <!-- INATIVOS -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex flex-col items-center text-center">
            <div class="rounded-full bg-red-100 p-4 mb-3">
              <svg
                class="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span class="text-sm text-gray-500"> Inativos </span>
            <span class="text-2xl font-bold text-gray-900">
              {{ stats.inactive }}
            </span>
          </div>
        </div>
      </div>

      <!-- Students Table -->
      <div class="mt-8 flex flex-col">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
          >
            <div
              class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
            >
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Nome
                    </th>
                    <th
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Telefone
                    </th>
                    <th
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Professor
                    </th>
                    <th
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      class="relative py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-6"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="student in filteredStudents" :key="student.id">
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                    >
                      {{ student.user.name }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ student.user.email }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ formatPhone(student.phone) }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {{ student.teacher?.user?.name || "N/A" }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        :class="
                          student.user.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        "
                        class="inline-flex rounded-full px-2 text-xs font-semibold"
                      >
                        {{ student.user.active ? "Ativo" : "Inativo" }}
                      </span>
                    </td>
                    <td
                      class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                    >
                      <NuxtLink
                        :to="`/admin/students/${student.id}/edit`"
                        class="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </NuxtLink>
                      <NuxtLink
                        :to="`/admin/students/${student.id}/workouts`"
                        class="text-green-600 hover:text-green-900"
                      >
                        Treinos
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
const { formatPhone } = useFormatters();

const filters = ref({
  status: "",
  search: "",
});

const students = ref([]);

onMounted(async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigateTo("/");
    return;
  }

  try {
    const response = await $fetch("/api/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    students.value = response;
  } catch (error) {
    console.error(error);
  }
});

const filteredStudents = computed(() => {
  let result = [...students.value];

  if (filters.value.status === "active") {
    result = result.filter((s) => s.user.active);
  }

  if (filters.value.status === "inactive") {
    result = result.filter((s) => !s.user.active);
  }

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();

    result = result.filter(
      (s) =>
        s.user.name.toLowerCase().includes(search) ||
        s.user.email.toLowerCase().includes(search)
    );
  }

  return result;
});

const stats = computed(() => {
  return {
    total: students.value.length,

    active: students.value.filter((s) => s.user.active).length,

    inactive: students.value.filter((s) => !s.user.active).length,
  };
});

const clearFilters = () => {
  filters.value = {
    status: "",
    search: "",
  };
};
</script>