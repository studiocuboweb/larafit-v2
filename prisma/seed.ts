import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.exerciseExecution.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.exercise.deleteMany()
  await prisma.workout.deleteMany()
  await prisma.student.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Dados antigos removidos')

  // Criar usuário admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@larafit.com',
      password: 'admin123', // TODO: Hash password
      name: 'Administrador',
      role: 'ADMIN',
      active: true
    }
  })
  console.log('✅ Admin criado:', adminUser.email)

  // Criar professores
  const teacher1User = await prisma.user.create({
    data: {
      email: 'joao.silva@larafit.com',
      password: 'professor123',
      name: 'João Silva',
      role: 'TEACHER',
      active: true,
      teacher: {
        create: {
          specialties: ['Musculação', 'Funcional'],
          cref: '12345-G/SP',
          phone: '(11) 98765-4321'
        }
      }
    },
    include: { teacher: true }
  })

  const teacher2User = await prisma.user.create({
    data: {
      email: 'maria.santos@larafit.com',
      password: 'professor123',
      name: 'Maria Santos',
      role: 'TEACHER',
      active: true,
      teacher: {
        create: {
          specialties: ['CrossFit', 'HIIT'],
          cref: '54321-G/SP',
          phone: '(11) 97654-3210'
        }
      }
    },
    include: { teacher: true }
  })

  console.log('✅ Professores criados:', teacher1User.name, teacher2User.name)

  // Criar alunos
  const students = []
  const studentNames = [
    { name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '(11) 91234-5678', active: true, teacherId: teacher1User.teacher!.id },
    { name: 'Ana Paula', email: 'ana@email.com', phone: '(11) 92345-6789', active: true, teacherId: teacher1User.teacher!.id },
    { name: 'Pedro Costa', email: 'pedro@email.com', phone: '(11) 93456-7890', active: true, teacherId: teacher2User.teacher!.id },
    { name: 'Julia Ferreira', email: 'julia@email.com', phone: '(11) 94567-8901', active: true, teacherId: teacher2User.teacher!.id },
    { name: 'Lucas Mendes', email: 'lucas@email.com', phone: '(11) 95678-9012', active: false, teacherId: teacher1User.teacher!.id } // Usuário inativo para teste
  ]

  for (const studentData of studentNames) {
    const studentUser = await prisma.user.create({
      data: {
        email: studentData.email,
        password: 'aluno123',
        name: studentData.name,
        role: 'STUDENT',
        active: studentData.active,
        student: {
          create: {
            teacherId: studentData.teacherId,
            phone: studentData.phone,
            birthDate: new Date(1990 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
          }
        }
      },
      include: { student: true }
    })
    students.push(studentUser)
  }

  console.log(`✅ ${students.length} alunos criados`)

  // Criar treinos
  const workout1 = await prisma.workout.create({
    data: {
      name: 'Treino A - Peito e Tríceps',
      description: 'Foco em força e hipertrofia para membros superiores',
      studentId: students[0].student!.id,
      teacherId: teacher1User.teacher!.id,
      status: 'ACTIVE',
      exercises: {
        create: [
          {
            name: 'Supino Reto',
            sets: 4,
            reps: '8-12',
            rest: 90,
            weight: '60kg',
            order: 1,
            notes: 'Manter a lombar colada no banco'
          },
          {
            name: 'Supino Inclinado com Halteres',
            sets: 3,
            reps: '10-12',
            rest: 60,
            weight: '24kg cada',
            order: 2
          },
          {
            name: 'Crucifixo Inclinado',
            sets: 3,
            reps: '12-15',
            rest: 60,
            weight: '16kg cada',
            order: 3
          },
          {
            name: 'Tríceps Pulley',
            sets: 3,
            reps: '12-15',
            rest: 45,
            weight: '30kg',
            order: 4
          },
          {
            name: 'Tríceps Testa',
            sets: 3,
            reps: '10-12',
            rest: 60,
            weight: '25kg',
            order: 5
          }
        ]
      }
    },
    include: { exercises: true }
  })

  const workout2 = await prisma.workout.create({
    data: {
      name: 'Treino B - Costas e Bíceps',
      description: 'Trabalho de puxada e remada',
      studentId: students[0].student!.id,
      teacherId: teacher1User.teacher!.id,
      status: 'ACTIVE',
      exercises: {
        create: [
          {
            name: 'Barra Fixa',
            sets: 4,
            reps: '8-10',
            rest: 90,
            weight: 'Peso corporal',
            order: 1
          },
          {
            name: 'Remada Curvada',
            sets: 4,
            reps: '8-12',
            rest: 90,
            weight: '50kg',
            order: 2
          },
          {
            name: 'Pulldown',
            sets: 3,
            reps: '10-12',
            rest: 60,
            weight: '45kg',
            order: 3
          },
          {
            name: 'Rosca Direta',
            sets: 3,
            reps: '10-12',
            rest: 60,
            weight: '20kg',
            order: 4
          },
          {
            name: 'Rosca Martelo',
            sets: 3,
            reps: '12-15',
            rest: 45,
            weight: '14kg cada',
            order: 5
          }
        ]
      }
    },
    include: { exercises: true }
  })

  const workout3 = await prisma.workout.create({
    data: {
      name: 'Treino C - Pernas',
      description: 'Treino completo de membros inferiores',
      studentId: students[0].student!.id,
      teacherId: teacher1User.teacher!.id,
      status: 'ACTIVE',
      exercises: {
        create: [
          {
            name: 'Agachamento Livre',
            sets: 4,
            reps: '8-12',
            rest: 120,
            weight: '80kg',
            order: 1,
            notes: 'Descer até 90 graus'
          },
          {
            name: 'Leg Press 45°',
            sets: 4,
            reps: '12-15',
            rest: 90,
            weight: '180kg',
            order: 2
          },
          {
            name: 'Cadeira Extensora',
            sets: 3,
            reps: '12-15',
            rest: 60,
            weight: '45kg',
            order: 3
          },
          {
            name: 'Mesa Flexora',
            sets: 3,
            reps: '12-15',
            rest: 60,
            weight: '40kg',
            order: 4
          },
          {
            name: 'Panturrilha em Pé',
            sets: 4,
            reps: '15-20',
            rest: 45,
            weight: '60kg',
            order: 5
          }
        ]
      }
    },
    include: { exercises: true }
  })

  console.log('✅ Treinos criados para', students[0].name)

  // Criar treino com BISET para demonstração
  const bisetGroupId = crypto.randomUUID()
  const workout4 = await prisma.workout.create({
    data: {
      name: 'Treino D - Ombros e Abdômen',
      description: 'Treino focado em deltoides com biset',
      studentId: students[1].student!.id,
      teacherId: teacher1User.teacher!.id,
      status: 'ACTIVE',
      exercises: {
        create: [
          {
            name: 'Desenvolvimento com Halteres',
            sets: 4,
            reps: '10-12',
            rest: 90,
            weight: '18kg cada',
            order: 1,
            notes: 'Movimento controlado'
          },
          {
            name: 'Elevação Lateral',
            sets: 3,
            reps: '12-15',
            rest: 0,
            weight: '10kg cada',
            order: 2,
            groupId: bisetGroupId,
            notes: 'Fazer em sequência com elevação frontal'
          },
          {
            name: 'Elevação Frontal',
            sets: 3,
            reps: '12-15',
            rest: 60,
            weight: '10kg cada',
            order: 3,
            groupId: bisetGroupId,
            notes: 'Fazer em sequência com elevação lateral'
          },
          {
            name: 'Crucifixo Inverso',
            sets: 3,
            reps: '15',
            rest: 60,
            weight: '8kg cada',
            order: 4
          },
          {
            name: 'Abdominal Crunch',
            sets: 3,
            reps: '20',
            rest: 30,
            weight: 'Peso corporal',
            order: 5
          },
          {
            name: 'Prancha Isométrica',
            sets: 3,
            reps: '45s',
            rest: 45,
            weight: 'Peso corporal',
            order: 6
          }
        ]
      }
    },
    include: { exercises: true }
  })

  console.log('✅ Treino com BISET criado para', students[1].name)

  // Criar treino para outro aluno
  await prisma.workout.create({
    data: {
      name: 'Treino Full Body',
      description: 'Treino de corpo inteiro para iniciantes',
      studentId: students[2].student!.id,
      teacherId: teacher2User.teacher!.id,
      status: 'ACTIVE',
      exercises: {
        create: [
          {
            name: 'Agachamento Goblet',
            sets: 3,
            reps: '12',
            rest: 60,
            weight: '12kg',
            order: 1
          },
          {
            name: 'Flexão de Braço',
            sets: 3,
            reps: '10-15',
            rest: 60,
            weight: 'Peso corporal',
            order: 2
          },
          {
            name: 'Remada com Elástico',
            sets: 3,
            reps: '15',
            rest: 45,
            weight: 'Elástico médio',
            order: 3
          },
          {
            name: 'Prancha Abdominal',
            sets: 3,
            reps: '30-45s',
            rest: 45,
            weight: 'Peso corporal',
            order: 4
          }
        ]
      }
    }
  })

  console.log('✅ Treino criado para', students[2].name)

  // Criar treino DRAFT (rascunho) para demonstração
  await prisma.workout.create({
    data: {
      name: 'Treino E - Em Construção',
      description: 'Treino ainda sendo planejado',
      studentId: students[3].student!.id,
      teacherId: teacher1User.teacher!.id,
      status: 'DRAFT'
    }
  })

  console.log('✅ Treino DRAFT criado para', students[3].name)

  // Criar algumas execuções de exemplo para demonstrar histórico
  const exercisesToExecute = workout1.exercises.slice(0, 3)
  for (const exercise of exercisesToExecute) {
    await prisma.exerciseExecution.create({
      data: {
        exerciseId: exercise.id,
        studentId: students[0].student!.id,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
        duration: 300 + Math.floor(Math.random() * 120), // 5-7 minutos
        setsDone: exercise.sets,
        notes: 'Treino concluído com sucesso!'
      }
    })
  }

  console.log('✅ Execuções de exemplo criadas')

  // Criar pagamentos
  const currentDate = new Date()
  const payments = []

  for (let i = 0; i < 3; i++) {
    for (const student of students) {
      const dueDate = new Date(currentDate)
      dueDate.setMonth(currentDate.getMonth() - (2 - i))
      
      const payment = await prisma.payment.create({
        data: {
          studentId: student.student!.id,
          amount: 150.00,
          dueDate: dueDate,
          paymentDate: i < 2 ? dueDate : null, // Últimos 2 meses pagos
          status: i < 2 ? 'PAID' : 'PENDING',
          method: i < 2 ? 'PIX' : null,
          description: 'Mensalidade',
          referenceMonth: dueDate
        }
      })
      payments.push(payment)
    }
  }

  console.log(`✅ ${payments.length} pagamentos criados`)

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('\n📊 Resumo:')
  console.log(`   - 1 Admin`)
  console.log(`   - 2 Professores`)
  console.log(`   - ${students.length} Alunos`)
  console.log(`   - 6 Treinos (5 ativos + 1 draft)`)
  console.log(`   - 3 Execuções de exemplo`)
  console.log(`   - ${payments.length} Pagamentos`)
  console.log('\n🔐 Credenciais de teste:')
  console.log('   Admin: admin@larafit.com / admin123')
  console.log('   Professor: joao.silva@larafit.com / professor123')
  console.log('   Aluno: carlos@email.com / aluno123')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
