import prisma from '../../utils/prisma'

// API de usuário por ID
export default defineEventHandler(async (event) => {
  const method = event.method
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }

  // GET /api/users/:id - Buscar usuário específico
  if (method === 'GET') {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        student: true,
        teacher: true
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return user
  }

  // PUT /api/users/:id - Atualizar usuário
  if (method === 'PUT') {
    const body = await readBody(event)
    
    const user = await prisma.user.update({
      where: { id },
      data: {
        email: body.email,
        name: body.name,
        role: body.role,
        active: body.active
      }
    })

    return user
  }

  // DELETE /api/users/:id - Deletar usuário
  if (method === 'DELETE') {
    await prisma.user.delete({
      where: { id }
    })

    return { success: true }
  }

  return { error: 'Method not allowed' }
})
