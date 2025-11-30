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
    select: { workoutId: true, order: true, groupId: true }
  })

  if (!currentExercise) {
    throw createError({
      statusCode: 404,
      message: 'Exercício não encontrado'
    })
  }

  const { workoutId, order: currentOrder, groupId } = currentExercise

  // Se o exercício faz parte de um grupo, pegar todos os exercícios do grupo
  let groupExercises: any[] = []
  if (groupId) {
    groupExercises = await prisma.exercise.findMany({
      where: { workoutId, groupId },
      orderBy: { order: 'asc' }
    })
  } else {
    groupExercises = [currentExercise]
  }

  // Pegar o primeiro e último order do grupo
  const minOrder = Math.min(...groupExercises.map(e => e.order))
  const maxOrder = Math.max(...groupExercises.map(e => e.order))
  const groupSize = groupExercises.length

  if (direction === 'up') {
    // Buscar exercício(s) acima do grupo
    const exercisesAbove = await prisma.exercise.findMany({
      where: {
        workoutId,
        order: { lt: minOrder }
      },
      orderBy: { order: 'desc' }
    })

    if (exercisesAbove.length === 0) return await prisma.exercise.findMany({
      where: { workoutId },
      orderBy: { order: 'asc' }
    })

    // Verificar se o exercício acima tem groupId
    const firstAbove = exercisesAbove[0]
    let targetExercises: any[] = []
    
    if (firstAbove.groupId) {
      // Pegar todos do grupo acima
      targetExercises = await prisma.exercise.findMany({
        where: { workoutId, groupId: firstAbove.groupId },
        orderBy: { order: 'asc' }
      })
    } else {
      targetExercises = [firstAbove]
    }

    const targetMinOrder = Math.min(...targetExercises.map(e => e.order))
    const targetSize = targetExercises.length

    // Trocar posições dos grupos
    const updates = []
    
    // Mover grupo atual para cima
    for (let i = 0; i < groupSize; i++) {
      updates.push(
        prisma.exercise.update({
          where: { id: groupExercises[i].id },
          data: { order: targetMinOrder + i }
        })
      )
    }
    
    // Mover grupo alvo para baixo
    for (let i = 0; i < targetSize; i++) {
      updates.push(
        prisma.exercise.update({
          where: { id: targetExercises[i].id },
          data: { order: minOrder + i }
        })
      )
    }

    await prisma.$transaction(updates)
  } else {
    // Buscar exercício(s) abaixo do grupo
    const exercisesBelow = await prisma.exercise.findMany({
      where: {
        workoutId,
        order: { gt: maxOrder }
      },
      orderBy: { order: 'asc' }
    })

    if (exercisesBelow.length === 0) return await prisma.exercise.findMany({
      where: { workoutId },
      orderBy: { order: 'asc' }
    })

    // Verificar se o exercício abaixo tem groupId
    const firstBelow = exercisesBelow[0]
    let targetExercises: any[] = []
    
    if (firstBelow.groupId) {
      // Pegar todos do grupo abaixo
      targetExercises = await prisma.exercise.findMany({
        where: { workoutId, groupId: firstBelow.groupId },
        orderBy: { order: 'asc' }
      })
    } else {
      targetExercises = [firstBelow]
    }

    const targetMinOrder = Math.min(...targetExercises.map(e => e.order))
    const targetSize = targetExercises.length

    // Trocar posições dos grupos
    const updates = []
    
    // Mover grupo atual para baixo
    for (let i = 0; i < groupSize; i++) {
      updates.push(
        prisma.exercise.update({
          where: { id: groupExercises[i].id },
          data: { order: targetMinOrder + i }
        })
      )
    }
    
    // Mover grupo alvo para cima
    for (let i = 0; i < targetSize; i++) {
      updates.push(
        prisma.exercise.update({
          where: { id: targetExercises[i].id },
          data: { order: minOrder + i }
        })
      )
    }

    await prisma.$transaction(updates)
  }

  // Retornar lista atualizada de exercícios
  const exercises = await prisma.exercise.findMany({
    where: { workoutId },
    orderBy: { order: 'asc' }
  })

  return exercises
})
