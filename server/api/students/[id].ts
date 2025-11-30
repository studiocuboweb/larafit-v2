import prisma from '../../utils/prisma'

// API de aluno por ID
export default defineEventHandler(async (event) => {
  const method = event.method
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }

  // GET /api/students/:id - Buscar aluno específico
  if (method === 'GET') {
    const student = await prisma.student.findUnique({
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

    if (!student) {
      throw createError({
        statusCode: 404,
        message: 'Student not found'
      })
    }

    return student
  }

  // PUT /api/students/:id - Atualizar aluno
  if (method === 'PUT') {
    const body = await readBody(event)
    
    const student = await prisma.student.update({
      where: { id },
      data: {
        phone: body.phone,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        observations: body.observations,
        user: {
          update: {
            name: body.name,
            active: body.active
          }
        }
      },
      include: {
        user: true
      }
    })

    return student
  }

  // DELETE /api/students/:id - Deletar aluno
  if (method === 'DELETE') {
    await prisma.student.delete({
      where: { id }
    })

    return { success: true }
  }

  return { error: 'Method not allowed' }
})
