import prisma from '../../utils/prisma'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)

  // Filtros baseados no perfil
  let studentWhere: any = {}
  let workoutWhere: any = { status: 'ACTIVE' }
  let paymentWhere: any = {
    status: 'PAID',
    referenceMonth: {
      gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    }
  }

  if (auth.role === 'TEACHER') {
    studentWhere = { teacherId: auth.teacherId }
    workoutWhere = { ...workoutWhere, student: { teacherId: auth.teacherId } }
    paymentWhere = { ...paymentWhere, student: { teacherId: auth.teacherId } }
  } else if (auth.role === 'STUDENT') {
    studentWhere = { id: auth.studentId }
    workoutWhere = { ...workoutWhere, studentId: auth.studentId }
    paymentWhere = { ...paymentWhere, studentId: auth.studentId }
  }

  const [studentsCount, teachersCount, workoutsCount, paymentsSum] = await Promise.all([
    prisma.student.count({ where: studentWhere }),
    auth.role === 'ADMIN' ? prisma.teacher.count() : Promise.resolve(1),
    prisma.workout.count({ where: workoutWhere }),
    prisma.payment.aggregate({
      where: paymentWhere,
      _sum: { amount: true }
    })
  ])

  return {
    students: studentsCount,
    teachers: teachersCount,
    workouts: workoutsCount,
    revenue: paymentsSum._sum.amount || 0
  }
})
