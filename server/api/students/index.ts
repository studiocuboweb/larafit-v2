import prisma from '../../utils/prisma'
import { requireAuth, requireTeacherOrAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const auth = requireAuth(event)
    
    let where: any = {}
    
    if (auth.role === 'TEACHER') {
      where.teacherId = auth.teacherId
    } else if (auth.role === 'STUDENT') {
      throw createError({
        statusCode: 403,
        message: 'Acesso negado'
      })
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true
          }
        },
        teacher: {
          include: {
            user: {
              select: { name: true }
            }
          }
        },
        workouts: {
          include: {
            teacher: {
              include: {
                user: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    })
    
    return students
  }

  if (method === 'POST') {
    const auth = requireTeacherOrAdmin(event)
    const body = await readBody(event)
    
    let teacherId = body.teacherId
    
    if (auth.role === 'TEACHER') {
      teacherId = auth.teacherId
    } else if (!teacherId) {
      throw createError({
        statusCode: 400,
        message: 'teacherId é obrigatório'
      })
    }
    
    const student = await prisma.student.create({
      data: {
        userId: body.userId,
        teacherId,
        phone: body.phone,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        observations: body.observations
      },
      include: {
        user: true,
        teacher: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    })
    
    return student
  }

  return { error: 'Method not allowed' }
})
