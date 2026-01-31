import prisma from '../../utils/prisma'
import { requireAuth, requireTeacherOrAdmin, canAccessStudent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }

  const auth = requireAuth(event)

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

    // Verificar acesso
    const hasAccess = await canAccessStudent(auth, workout.studentId)
    if (!hasAccess) {
      throw createError({
        statusCode: 403,
        message: 'Acesso negado'
      })
    }

    return workout
  }

  if (method === 'PUT') {
    requireTeacherOrAdmin(event)
    
    const existingWorkout = await prisma.workout.findUnique({
      where: { id },
      select: { studentId: true }
    })

    if (!existingWorkout) {
      throw createError({
        statusCode: 404,
        message: 'Workout not found'
      })
    }

    const hasAccess = await canAccessStudent(auth, existingWorkout.studentId)
    if (!hasAccess) {
      throw createError({
        statusCode: 403,
        message: 'Acesso negado'
      })
    }
    
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

  if (method === 'DELETE') {
    requireTeacherOrAdmin(event)
    
    const existingWorkout = await prisma.workout.findUnique({
      where: { id },
      select: { studentId: true }
    })

    if (!existingWorkout) {
      throw createError({
        statusCode: 404,
        message: 'Workout not found'
      })
    }

    const hasAccess = await canAccessStudent(auth, existingWorkout.studentId)
    if (!hasAccess) {
      throw createError({
        statusCode: 403,
        message: 'Acesso negado'
      })
    }

    await prisma.workout.delete({
      where: { id }
    })

    return { success: true }
  }

  return { error: 'Method not allowed' }
})

