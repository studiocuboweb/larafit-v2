import prisma from '../../utils/prisma'
import { requireAuth, requireTeacherOrAdmin, canAccessStudent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const auth = requireAuth(event)
    const query = getQuery(event)
    const { studentId, teacherId, status } = query

    const where: any = {}
    
    if (studentId) where.studentId = String(studentId)
    if (teacherId) where.teacherId = String(teacherId)
    if (status) where.status = String(status)

    // Filtros por perfil
    if (auth.role === 'STUDENT') {
      where.studentId = auth.studentId
    } else if (auth.role === 'TEACHER') {
      where.student = { teacherId: auth.teacherId }
    }

    const workouts = await prisma.workout.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: { name: true, email: true, active: true }
            }
          }
        },
        teacher: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        },
        _count: {
          select: { exercises: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return workouts
  }

  if (method === 'POST') {
    const auth = requireTeacherOrAdmin(event)
    const body = await readBody(event)
    
    if (!body.studentId) {
      throw createError({
        statusCode: 400,
        message: 'studentId é obrigatório'
      })
    }

    // Verificar se pode criar treino para este aluno
    const hasAccess = await canAccessStudent(auth, body.studentId)
    if (!hasAccess) {
      throw createError({
        statusCode: 403,
        message: 'Você só pode criar treinos para seus alunos'
      })
    }

    let teacherId = body.teacherId
    if (auth.role === 'TEACHER') {
      teacherId = auth.teacherId
    }
    
    const workout = await prisma.workout.create({
      data: {
        name: body.name,
        description: body.description,
        studentId: body.studentId,
        teacherId: teacherId || auth.teacherId,
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
