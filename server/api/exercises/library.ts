import { exerciseLibrary, exerciseCategories, equipmentTypes } from '../../utils/exerciseLibrary'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    throw createError({
      statusCode: 405,
      message: 'Método não permitido'
    })
  }

  const query = getQuery(event)
  const { category, equipment, search } = query

  let filteredExercises = [...exerciseLibrary]

  // Filtrar por categoria
  if (category && typeof category === 'string') {
    filteredExercises = filteredExercises.filter(ex => 
      ex.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Filtrar por equipamento
  if (equipment && typeof equipment === 'string') {
    filteredExercises = filteredExercises.filter(ex => 
      ex.equipment.toLowerCase() === equipment.toLowerCase()
    )
  }

  // Filtrar por busca (nome ou grupos musculares)
  if (search && typeof search === 'string') {
    const searchLower = search.toLowerCase()
    filteredExercises = filteredExercises.filter(ex =>
      ex.name.toLowerCase().includes(searchLower) ||
      ex.muscleGroups.some(mg => mg.toLowerCase().includes(searchLower)) ||
      ex.description.toLowerCase().includes(searchLower)
    )
  }

  return {
    exercises: filteredExercises,
    categories: exerciseCategories,
    equipmentTypes: equipmentTypes,
    total: filteredExercises.length
  }
})
