import prisma from '../../../utils/prisma'

// API de exercícios de um treino
export default defineEventHandler(async (event) => {
  const method = event.method
  const workoutId = getRouterParam(event, 'workoutId')

  if (!workoutId) {
    throw createError({
      statusCode: 400,
      message: 'Workout ID is required'
    })
  }

  // GET /api/workouts/:workoutId/exercises - Listar exercícios do treino
  if (method === 'GET') {
    const exercises = await prisma.exercise.findMany({
      where: { workoutId },
      orderBy: { order: 'asc' }
    })
    return exercises
  }

  // POST /api/workouts/:workoutId/exercises - Adicionar exercício ao treino
  if (method === 'POST') {
    const body = await readBody(event)
    
    // Pegar o próximo número de ordem
    const lastExercise = await prisma.exercise.findFirst({
      where: { workoutId },
      orderBy: { order: 'desc' }
    })
    
    const nextOrder = lastExercise ? lastExercise.order + 1 : 1
    
    const exercise = await prisma.exercise.create({
      data: {
        workoutId,
        name: body.name,
        sets: body.sets,
        reps: body.reps,
        rest: body.rest,
        weight: body.weight,
        notes: body.notes,
        videoUrl: body.videoUrl,
        order: body.order ?? nextOrder
      }
    })
    
    return exercise
  }

  return { error: 'Method not allowed' }
})
