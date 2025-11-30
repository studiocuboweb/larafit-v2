import prisma from '../../utils/prisma'

// API de treino por ID
export default defineEventHandler(async (event) => {
  const method = event.method
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }

  // GET /api/workouts/:id - Buscar treino específico
  if (method === 'GET') {
    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        },
        teacher: {
          include: {
            user: {
              select: { name: true }
            }
          }
        },
        exercises: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!workout) {
      throw createError({
        statusCode: 404,
        message: 'Workout not found'
      })
    }

    return workout
  }

  // PUT /api/workouts/:id - Atualizar treino
  if (method === 'PUT') {
    const body = await readBody(event)
    
    const workout = await prisma.workout.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        status: body.status,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined
      },
      include: {
        student: { include: { user: true } },
        teacher: { include: { user: true } },
        exercises: { orderBy: { order: 'asc' } }
      }
    })

    return workout
  }

  // DELETE /api/workouts/:id - Deletar treino
  if (method === 'DELETE') {
    await prisma.workout.delete({
      where: { id }
    })

    return { success: true }
  }

  return { error: 'Method not allowed' }
})
