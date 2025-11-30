import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID do professor é obrigatório'
    })
  }

  // GET - Buscar professor por ID
  if (method === 'GET') {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true
          }
        },
        workouts: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!teacher) {
      throw createError({
        statusCode: 404,
        message: 'Professor não encontrado'
      })
    }

    return teacher
  }

  // PUT - Atualizar professor
  if (method === 'PUT') {
    const body = await readBody(event)
    const { name, active, specialties, cref, phone } = body

    // Usar transação para atualizar tanto User quanto Teacher
    const updatedTeacher = await prisma.$transaction(async (tx) => {
      // Buscar o professor para pegar o userId
      const teacher = await tx.teacher.findUnique({
        where: { id }
      })

      if (!teacher) {
        throw createError({
          statusCode: 404,
          message: 'Professor não encontrado'
        })
      }

      // Atualizar dados do teacher
      const updatedTeacher = await tx.teacher.update({
        where: { id },
        data: {
          specialties: specialties || [],
          cref,
          phone
        }
      })

      // Atualizar dados do user
      await tx.user.update({
        where: { id: teacher.userId },
        data: {
          name,
          active
        }
      })

      // Retornar professor atualizado com user
      return await tx.teacher.findUnique({
        where: { id },
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
    })

    return updatedTeacher
  }

  // DELETE - Remover professor
  if (method === 'DELETE') {
    // Buscar professor para pegar o userId
    const teacher = await prisma.teacher.findUnique({
      where: { id }
    })

    if (!teacher) {
      throw createError({
        statusCode: 404,
        message: 'Professor não encontrado'
      })
    }

    // Deletar user (cascade vai deletar o teacher automaticamente)
    await prisma.user.delete({
      where: { id: teacher.userId }
    })

    return { message: 'Professor removido com sucesso' }
  }

  throw createError({
    statusCode: 405,
    message: 'Método não permitido'
  })
})
