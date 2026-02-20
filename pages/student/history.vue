<template>
  <div class="sm:px-6 lg:px-8 pb-8">
    <div class="w-80">
      <!-- Header -->
      <div class="flex items-center justify-center mb-6">
        <div class="flex items-center">
          <img class="h-12 w-auto" src="/img/stripes.webp" alt="LaraFit Logo" />
          <h1 class="text-2xl font-bold text-white">Histórico de Treinos</h1>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        ></div>
        <p class="mt-4 text-gray-600">Carregando histórico...</p>
      </div>

      <!-- Conteúdo -->
      <div v-else>
        <!-- Estatísticas -->
        <div
          v-if="workoutSessions.length > 0"
          class="mb-8 grid grid-cols-3 gap-4"
        >
          <!-- Card 1: Total de Treinos -->
          <div class="bg-white rounded-lg shadow p-2">
            <div class="flex flex-col items-center">
              <!-- Ícone -->
              <div class="p-3 rounded-full bg-blue-100 text-green">
                <svg
                  class="w-6 h-6"
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
              <!-- Bloco de Texto -->
              <div class="mt-2 text-center">
                <p class="text-sm text-gray-500">Treinos</p>
                <p class="text-xl font-bold text-gray-900">
                  {{ workoutSessions.length }}
                </p>
              </div>
            </div>
          </div>

          <!-- Card 2: Exercícios -->
          <div class="bg-white rounded-lg shadow p-2">
            <div class="flex flex-col items-center">
              <!-- Ícone -->
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <!-- Bloco de Texto -->
              <div class="mt-2 text-center">
                <p class="text-sm text-gray-500">Exercícios</p>
                <p class="text-xl font-bold text-gray-900">
                  {{ totalExercises }}
                </p>
              </div>
            </div>
          </div>

          <!-- Card 3: Tempo Total -->
          <div class="bg-white rounded-lg shadow p-2">
            <div class="flex flex-col items-center">
              <!-- Ícone -->
              <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <!-- Bloco de Texto -->
              <div class="mt-2 text-center">
                <p class="text-sm text-gray-500">Tempo</p>
                <p class="text-xl font-bold text-gray-900">
                  {{ formatTotalTime(totalDuration) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de Sessões -->
        <div v-if="workoutSessions.length > 0" class="space-y-4">
          <div
            v-for="session in workoutSessions"
            :key="session.date"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <!-- Header da Sessão -->
            <div
              class="p-2"
              :class="expandedSessions.has(session.date) ? 'border-b border-gray-200' : ''"
            >
              <div
                class="flex flex-col sm:flex-row sm:items-start sm:justify-between"
              >
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-bold text-gray-900">
                    {{ session.workoutName }}
                  </h3>
                  <div
                    class="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600"
                  >
                    <div class="flex items-center gap-1">
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{{ formatDate(session.date) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{{ formatDuration(session.duration) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>{{ session.exercises.length }} exercícios</span>
                    </div>
                  </div>
                </div>
                <button
                  @click="toggleSession(session.date)"
                  class="self-start sm:ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    class="w-6 h-6 text-gray-400 transition-transform duration-200"
                    :class="
                      expandedSessions.has(session.date)
                        ? 'transform rotate-180'
                        : ''
                    "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Exercícios da Sessão -->
            <div
              v-show="expandedSessions.has(session.date)"
              class="p-6 bg-cyan-900"
            >
              <div class="space-y-4">
                <div
                  v-for="(exercise, index) in session.exercises"
                  :key="exercise.id"
                  class="rounded-lg p-2 border border-gray-200 bg-white shadow-sm border-green"
                >
                  <div class="flex items-start gap-4">
                    <!-- Coluna 1: O Número (Fixa à esquerda) -->
                    <div class="flex-shrink-0">
                      <div
                        class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700 font-bold shadow-sm"
                      >
                        {{ index + 1 }}
                      </div>
                    </div>

                    <!-- Coluna 2: Todo o Conteúdo (Flexível à direita) -->
                    <div class="flex-1 min-w-0">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                        <h4 class="font-bold text-gray-900 text-lg leading-tight">{{ exercise.name }}</h4>

                        <!-- Selo de Concluído -->
                        <div class="flex-shrink-0">
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            <svg
                              class="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                              />
                            </svg>
                            Concluído
                          </span>
                        </div>
                      </div>

                      <!-- Linha de Detalhes Técnicos -->
                      <div
                        class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600"
                      >
                        <span class="font-semibold text-gray-800"
                          >{{ exercise.setsDone }} séries</span
                        >
                        <span class="text-gray-300">•</span>
                        <span>{{ exercise.reps }} reps</span>
                        <span class="text-gray-300">•</span>
                        <span
                          class="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium"
                          >{{ exercise.weight }}</span
                        >
                      </div>

                      <!-- Bloco de Anotações -->
                      <div
                        v-if="exercise.notes"
                        class="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400"
                      >
                        <p class="text-sm text-gray-700">
                          <span
                            class="block font-bold text-blue-800 text-xs uppercase tracking-wider mb-1"
                            >Minhas Anotações:</span
                          >
                          {{ exercise.notes }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="workoutSessions.length === 0" class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            Nenhum treino realizado
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Comece a treinar para ver seu histórico aqui!
          </p>
          <div class="mt-6">
            <NuxtLink
              to="/student/workouts"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Ver Meus Treinos
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "student",
});

const { formatDate } = useFormatters();

const loading = ref(true);
const executions = ref<any[]>([]);
const expandedSessions = ref(new Set<string>());

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigateTo("/");
    return;
  }

  try {
    const response = await $fetch("/api/executions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    executions.value = response;
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
  } finally {
    loading.value = false;
  }
});

// Agrupar execuções por sessão de treino (data + workout)
const workoutSessions = computed(() => {
  if (!executions.value || executions.value.length === 0) return [];

  // Agrupar por data e workout
  const sessions = new Map();

  executions.value.forEach((execution: any) => {
    const date = new Date(execution.completedAt).toLocaleDateString("pt-BR");
    const workoutId = execution.exercise.workout.id;
    const key = `${date}-${workoutId}`;

    if (!sessions.has(key)) {
      sessions.set(key, {
        date: execution.completedAt,
        workoutId: workoutId,
        workoutName: execution.exercise.workout.name,
        exercises: [],
        duration: execution.duration,
      });
    }

    const session = sessions.get(key);
    session.exercises.push({
      id: execution.id,
      name: execution.exercise.name,
      setsDone: execution.setsDone,
      reps: execution.exercise.reps,
      weight: execution.exercise.weight,
      notes: execution.notes,
    });
  });

  // Converter Map para array e ordenar por data
  return Array.from(sessions.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

const totalExercises = computed(() => {
  return executions.value.length;
});

const totalDuration = computed(() => {
  return workoutSessions.value.reduce(
    (sum, session) => sum + session.duration,
    0
  );
});

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}h ${m}min`;
  } else if (m > 0) {
    return `${m}min ${s}s`;
  }
  return `${s}s`;
};

const formatTotalTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (h > 0) {
    return `${h}h ${m}min`;
  }
  return `${m}min`;
};

const toggleSession = (date: string) => {
  if (expandedSessions.value.has(date)) {
    expandedSessions.value.delete(date);
  } else {
    expandedSessions.value.add(date);
  }
};
</script>
