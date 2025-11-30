import prisma from '../../../utils/prisma'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  if (event.method !== 'PUT') {
    throw createError({
      statusCode: 405,
      message: 'Método não permitido'
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID do exercício é obrigatório'
    })
  }

  const body = await readBody(event)
  const { exerciseIds, ungroup } = body

  if (ungroup) {
    // Desagrupar exercício
    await prisma.exercise.update({
      where: { id },
      data: { groupId: null }
    })

    return { success: true, message: 'Exercício desagrupado com sucesso' }
  }

  if (!exerciseIds || !Array.isArray(exerciseIds) || exerciseIds.length < 2) {
    throw createError({
      statusCode: 400,
      message: 'É necessário fornecer pelo menos 2 exercícios para agrupar'
    })
  }

  // Verificar se todos os exercícios pertencem ao mesmo treino
  const exercises = await prisma.exercise.findMany({
    where: { id: { in: exerciseIds } },
    select: { id: true, workoutId: true }
  })

  if (exercises.length !== exerciseIds.length) {
    throw createError({
      statusCode: 404,
      message: 'Um ou mais exercícios não foram encontrados'
    })
  }

  const workoutIds = [...new Set(exercises.map(e => e.workoutId))]
  if (workoutIds.length > 1) {
    throw createError({
      statusCode: 400,
      message: 'Todos os exercícios devem pertencer ao mesmo treino'
    })
  }

  // Gerar novo groupId
  const groupId = randomUUID()

  // Atualizar todos os exercícios com o novo groupId
  await prisma.exercise.updateMany({
    where: { id: { in: exerciseIds } },
    data: { groupId }
  })

  // Retornar exercícios atualizados
  const updatedExercises = await prisma.exercise.findMany({
    where: { id: { in: exerciseIds } },
    orderBy: { order: 'asc' }
  })

  return {
    success: true,
    message: `${exerciseIds.length} exercícios agrupados com sucesso`,
    groupId,
    exercises: updatedExercises
  }
})
