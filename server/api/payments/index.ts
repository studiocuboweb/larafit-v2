import prisma from '../../utils/prisma'

// API de pagamentos
export default defineEventHandler(async (event) => {
  const method = event.method

  // GET /api/payments - Listar pagamentos
  if (method === 'GET') {
    const query = getQuery(event)
    const studentId = query.studentId as string | undefined
    const status = query.status as string | undefined

    const payments = await prisma.payment.findMany({
      where: {
        ...(studentId && { studentId }),
        ...(status && { status })
      },
      include: {
        student: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      },
      orderBy: { dueDate: 'desc' }
    })
    
    return payments
  }

  // POST /api/payments - Criar novo pagamento
  if (method === 'POST') {
    const body = await readBody(event)
    
    const payment = await prisma.payment.create({
      data: {
        studentId: body.studentId,
        amount: body.amount,
        dueDate: new Date(body.dueDate),
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
        status: body.status || 'PENDING',
        method: body.method,
        description: body.description,
        referenceMonth: new Date(body.referenceMonth)
      },
      include: {
        student: { include: { user: true } }
      }
    })
    
    return payment
  }

  return { error: 'Method not allowed' }
})
