import { randomUUID } from 'crypto'
import prisma from '../../../utils/prisma'
import { requireTeacherOrAdmin, canAccessStudent } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: 'Método não permitido'
    })
  }

  const auth = requireTeacherOrAdmin(event)
  const workoutId = getRouterParam(event, 'workoutId')

  if (!workoutId) {
    throw createError({
      statusCode: 400,
      message: 'ID do treino é obrigatório'
    })
  }

  const body = await readBody(event)
  const targetStudentId = body?.studentId as string | undefined

  if (!targetStudentId) {
    throw createError({
      statusCode: 400,
      message: 'studentId é obrigatório'
    })
  }

  const canAccessTarget = await canAccessStudent(auth, targetStudentId)
  if (!canAccessTarget) {
    throw createError({
      statusCode: 403,
      message: 'Acesso negado ao aluno informado'
    })
  }

  const sourceWorkout = await prisma.workout.findUnique({
    where: { id: workoutId },
    include: {
      exercises: true,
      student: {
        select: { teacherId: true }
      }
    }
  })

  if (!sourceWorkout) {
    throw createError({
      statusCode: 404,
      message: 'Treino não encontrado'
    })
  }

  if (auth.role === 'TEACHER') {
    const ownsWorkout = sourceWorkout.teacherId === auth.teacherId || sourceWorkout.student?.teacherId === auth.teacherId
    if (!ownsWorkout) {
      throw createError({
        statusCode: 403,
        message: 'Acesso negado ao treino informado'
      })
    }
  }

  const groupIdMap = new Map<string, string>()
  const getMappedGroupId = (groupId?: string | null) => {
    if (!groupId) return null
    if (!groupIdMap.has(groupId)) {
      groupIdMap.set(groupId, randomUUID())
    }
    return groupIdMap.get(groupId) || null
  }

  const exercises = [...sourceWorkout.exercises]
    .sort((a, b) => a.order - b.order)
    .map((exercise) => ({
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      rest: exercise.rest,
      weight: exercise.weight,
      notes: exercise.notes,
      order: exercise.order,
      groupId: getMappedGroupId(exercise.groupId),
      videoUrl: exercise.videoUrl
    }))

  const name = body?.name?.trim() || `${sourceWorkout.name} (Cópia)`
  const status = body?.status || 'DRAFT'

  const newWorkout = await prisma.workout.create({
    data: {
      name,
      description: sourceWorkout.description,
      studentId: targetStudentId,
      teacherId: auth.role === 'TEACHER' ? auth.teacherId : (body?.teacherId || sourceWorkout.teacherId),
      status,
      startDate: body?.startDate ? new Date(body.startDate) : new Date(),
      endDate: body?.endDate ? new Date(body.endDate) : null,
      exercises: exercises.length > 0 ? { create: exercises } : undefined
    },
    include: {
      exercises: true
    }
  })

  return newWorkout
})
