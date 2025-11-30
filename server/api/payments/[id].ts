import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID do pagamento é obrigatório'
    })
  }

  // GET - Buscar pagamento por ID
  if (method === 'GET') {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!payment) {
      throw createError({
        statusCode: 404,
        message: 'Pagamento não encontrado'
      })
    }

    return payment
  }

  // PUT - Atualizar pagamento
  if (method === 'PUT') {
    const body = await readBody(event)

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        amount: body.amount,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
        status: body.status,
        method: body.method,
        description: body.description,
        referenceMonth: body.referenceMonth ? new Date(body.referenceMonth) : undefined
      },
      include: {
        student: {
          include: {
            user: true
          }
        }
      }
    })

    return payment
  }

  // DELETE - Remover pagamento
  if (method === 'DELETE') {
    await prisma.payment.delete({
      where: { id }
    })

    return { message: 'Pagamento removido com sucesso' }
  }

  throw createError({
    statusCode: 405,
    message: 'Método não permitido'
  })
})
