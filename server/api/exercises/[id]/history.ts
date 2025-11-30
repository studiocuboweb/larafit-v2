import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
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

  const query = getQuery(event)
  const { studentId } = query

  const where: any = { exerciseId: id }
  if (studentId) where.studentId = String(studentId)

  const history = await prisma.exerciseExecution.findMany({
    where,
    include: {
      student: {
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: {
      completedAt: 'desc'
    },
    take: 20 // Limitar aos últimos 20 registros
  })

  // Calcular estatísticas
  const stats = {
    totalExecutions: history.length,
    averageDuration: history.length > 0 
      ? Math.round(history.reduce((sum, ex) => sum + ex.duration, 0) / history.length)
      : 0,
    lastExecution: history[0]?.completedAt || null
  }

  return {
    history,
    stats
  }
})
