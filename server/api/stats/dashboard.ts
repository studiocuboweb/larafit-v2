import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
  const [studentsCount, teachersCount, workoutsCount, paymentsSum] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.workout.count({ where: { status: 'ACTIVE' } }),
    prisma.payment.aggregate({
      where: {
        status: 'PAID',
        referenceMonth: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: {
        amount: true
      }
    })
  ])

  return {
    students: studentsCount,
    teachers: teachersCount,
    workouts: workoutsCount,
    revenue: paymentsSum._sum.amount || 0
  }
})
