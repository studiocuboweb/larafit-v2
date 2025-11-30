import prisma from '../../../utils/prisma'

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
  const { direction } = body // 'up' ou 'down'

  if (!direction || !['up', 'down'].includes(direction)) {
    throw createError({
      statusCode: 400,
      message: 'Direção inválida. Use "up" ou "down"'
    })
  }

  // Buscar o exercício atual
  const currentExercise = await prisma.exercise.findUnique({
    where: { id },
    select: { workoutId: true, order: true }
  })

  if (!currentExercise) {
    throw createError({
      statusCode: 404,
      message: 'Exercício não encontrado'
    })
  }

  const { workoutId, order: currentOrder } = currentExercise

  if (direction === 'up') {
    // Buscar exercício acima
    const exerciseAbove = await prisma.exercise.findFirst({
      where: {
        workoutId,
        order: { lt: currentOrder }
      },
      orderBy: { order: 'desc' }
    })

    if (exerciseAbove) {
      // Trocar ordens
      await prisma.$transaction([
        prisma.exercise.update({
          where: { id },
          data: { order: exerciseAbove.order }
        }),
        prisma.exercise.update({
          where: { id: exerciseAbove.id },
          data: { order: currentOrder }
        })
      ])
    }
  } else {
    // Buscar exercício abaixo
    const exerciseBelow = await prisma.exercise.findFirst({
      where: {
        workoutId,
        order: { gt: currentOrder }
      },
      orderBy: { order: 'asc' }
    })

    if (exerciseBelow) {
      // Trocar ordens
      await prisma.$transaction([
        prisma.exercise.update({
          where: { id },
          data: { order: exerciseBelow.order }
        }),
        prisma.exercise.update({
          where: { id: exerciseBelow.id },
          data: { order: currentOrder }
        })
      ])
    }
  }

  // Retornar lista atualizada de exercícios
  const exercises = await prisma.exercise.findMany({
    where: { workoutId },
    orderBy: { order: 'asc' }
  })

  return exercises
})
