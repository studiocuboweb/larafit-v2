import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.method

  // GET - Listar todos os professores
  if (method === 'GET') {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true
          }
        },
        _count: {
          select: {
            workouts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return teachers
  }

  // POST - Criar novo professor
  if (method === 'POST') {
    const body = await readBody(event)
    const { userId, specialties, cref, phone } = body

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: 'userId é obrigatório'
      })
    }

    const teacher = await prisma.teacher.create({
      data: {
        userId,
        specialties: specialties || [],
        cref,
        phone
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true
          }
        }
      }
    })

    return teacher
  }

  throw createError({
    statusCode: 405,
    message: 'Método não permitido'
  })
})
