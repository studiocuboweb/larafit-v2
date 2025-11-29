import prisma from '../../utils/prisma'

// API de usuários
export default defineEventHandler(async (event) => {
  const method = event.method

  // GET /api/users - Listar todos os usuários
  if (method === 'GET') {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        student: true,
        teacher: true
      }
    })
    return users
  }

  // POST /api/users - Criar novo usuário
  if (method === 'POST') {
    const body = await readBody(event)
    
    // TODO: Hash password with bcrypt
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password, // IMPORTANTE: Implementar hash depois
        name: body.name,
        role: body.role,
        active: body.active ?? true
      }
    })
    
    return user
  }

  return { error: 'Method not allowed' }
})
