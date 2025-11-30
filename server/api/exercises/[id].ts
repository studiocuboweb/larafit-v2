import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = event.method
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID do exercício é obrigatório'
    })
  }

  if (method === 'GET') {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        workout: {
          include: {
            student: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })

    if (!exercise) {
      throw createError({
        statusCode: 404,
        message: 'Exercício não encontrado'
      })
    }

    return exercise
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const { name, sets, reps, rest, weight, notes, videoUrl, groupId, order } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (sets !== undefined) updateData.sets = sets
    if (reps !== undefined) updateData.reps = reps
    if (rest !== undefined) updateData.rest = rest
    if (weight !== undefined) updateData.weight = weight
    if (notes !== undefined) updateData.notes = notes
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl
    if (groupId !== undefined) updateData.groupId = groupId
    if (order !== undefined) updateData.order = order

    const exercise = await prisma.exercise.update({
      where: { id },
      data: updateData
    })

    return exercise
  }

  if (method === 'DELETE') {
    // Buscar o exercício para saber o workoutId
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      select: { workoutId: true, order: true }
    })

    if (!exercise) {
      throw createError({
        statusCode: 404,
        message: 'Exercício não encontrado'
      })
    }

    // Deletar o exercício
    await prisma.exercise.delete({
      where: { id }
    })

    // Reorganizar a ordem dos exercícios restantes
    await prisma.exercise.updateMany({
      where: {
        workoutId: exercise.workoutId,
        order: { gt: exercise.order }
      },
      data: {
        order: { decrement: 1 }
      }
    })

    return { success: true, message: 'Exercício excluído com sucesso' }
  }

  throw createError({
    statusCode: 405,
    message: 'Método não permitido'
  })
})
