import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const query = getQuery(event)
    const { studentId, exerciseId, workoutId } = query

    const where: any = {}
    if (studentId) where.studentId = String(studentId)
    if (exerciseId) where.exerciseId = String(exerciseId)
    
    // Se filtrar por workout, buscar primeiro os IDs dos exercícios desse treino
    if (workoutId) {
      const exercises = await prisma.exercise.findMany({
        where: { workoutId: String(workoutId) },
        select: { id: true }
      })
      where.exerciseId = { in: exercises.map(e => e.id) }
    }

    const executions = await prisma.exerciseExecution.findMany({
      where,
      include: {
        exercise: {
          include: {
            workout: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    return executions
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { exerciseId, studentId, duration, setsDone, notes } = body

    if (!exerciseId || !studentId || duration === undefined || setsDone === undefined) {
      throw createError({
        statusCode: 400,
        message: 'exerciseId, studentId, duration e setsDone são obrigatórios'
      })
    }

    // Verificar se o exercício existe
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId }
    })

    if (!exercise) {
      throw createError({
        statusCode: 404,
        message: 'Exercício não encontrado'
      })
    }

    const execution = await prisma.exerciseExecution.create({
      data: {
        exerciseId,
        studentId,
        duration: parseInt(String(duration)),
        setsDone: parseInt(String(setsDone)),
        notes: notes || null,
        completedAt: new Date()
      },
      include: {
        exercise: {
          include: {
            workout: true
          }
        }
      }
    })

    return execution
  }

  throw createError({
    statusCode: 405,
    message: 'Método não permitido'
  })
})
