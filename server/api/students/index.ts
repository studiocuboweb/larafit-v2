import prisma from '../../utils/prisma'

// API de alunos
export default defineEventHandler(async (event) => {
  const method = event.method

  // GET /api/students - Listar todos os alunos
  if (method === 'GET') {
    const students = await prisma.student.findMany({
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

  // POST /api/students - Criar novo aluno
  if (method === 'POST') {
    const body = await readBody(event)
    
    const student = await prisma.student.create({
      data: {
        userId: body.userId,
        phone: body.phone,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        observations: body.observations
      },
      include: {
        user: true
      }
    })
    
    return student
  }

  return { error: 'Method not allowed' }
})
