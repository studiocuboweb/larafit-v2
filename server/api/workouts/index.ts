import prisma from '../../utils/prisma'

// API de treinos
export default defineEventHandler(async (event) => {
  const method = event.method

  // GET /api/workouts - Listar todos os treinos
  if (method === 'GET') {
    const query = getQuery(event)
    const studentId = query.studentId as string | undefined

    const workouts = await prisma.workout.findMany({
      where: studentId ? { studentId } : undefined,
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
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return workouts
  }

  // POST /api/workouts - Criar novo treino
  if (method === 'POST') {
    const body = await readBody(event)
    
    const workout = await prisma.workout.create({
      data: {
        name: body.name,
        description: body.description,
        studentId: body.studentId,
        teacherId: body.teacherId,
        status: body.status || 'ACTIVE',
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : null
      },
      include: {
        student: { include: { user: true } },
        teacher: { include: { user: true } }
      }
    })
    
    return workout
  }

  return { error: 'Method not allowed' }
})
