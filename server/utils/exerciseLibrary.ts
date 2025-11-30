export interface ExerciseTemplate {
  id: string
  name: string
  category: string
  equipment: string
  muscleGroups: string[]
  description: string
  videoUrl?: string
  defaultSets: number
  defaultReps: string
  defaultRest: number // em segundos
}

export const exerciseLibrary: ExerciseTemplate[] = [
  // ==================== PEITO ====================
  {
    id: 'supino-reto-barra',
    name: 'Supino Reto com Barra',
    category: 'Peito',
    equipment: 'Barra',
    muscleGroups: ['Peitoral Maior', 'Tríceps', 'Deltóide Anterior'],
    description: 'Exercício composto para desenvolvimento do peitoral maior',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'supino-inclinado-barra',
    name: 'Supino Inclinado com Barra',
    category: 'Peito',
    equipment: 'Barra',
    muscleGroups: ['Peitoral Superior', 'Deltóide Anterior'],
    description: 'Foca na porção superior do peitoral',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'supino-declinado-barra',
    name: 'Supino Declinado com Barra',
    category: 'Peito',
    equipment: 'Barra',
    muscleGroups: ['Peitoral Inferior'],
    description: 'Foca na porção inferior do peitoral',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'crucifixo-halteres',
    name: 'Crucifixo com Halteres',
    category: 'Peito',
    equipment: 'Halteres',
    muscleGroups: ['Peitoral Maior'],
    description: 'Exercício de isolamento para alongamento do peitoral',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45
  },
  {
    id: 'crossover-cabo',
    name: 'Crossover no Cabo',
    category: 'Peito',
    equipment: 'Cabo',
    muscleGroups: ['Peitoral Maior'],
    description: 'Excelente para definição e contração do peitoral',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45
  },
  {
    id: 'flexao-solo',
    name: 'Flexão de Braço',
    category: 'Peito',
    equipment: 'Peso Corporal',
    muscleGroups: ['Peitoral', 'Tríceps', 'Core'],
    description: 'Exercício funcional com peso corporal',
    defaultSets: 3,
    defaultReps: '15-20',
    defaultRest: 45
  },

  // ==================== COSTAS ====================
  {
    id: 'barra-fixa',
    name: 'Barra Fixa',
    category: 'Costas',
    equipment: 'Barra Fixa',
    muscleGroups: ['Grande Dorsal', 'Bíceps', 'Trapézio'],
    description: 'Exercício composto fundamental para costas',
    defaultSets: 3,
    defaultReps: '10',
    defaultRest: 90
  },
  {
    id: 'puxada-frente',
    name: 'Puxada Frontal',
    category: 'Costas',
    equipment: 'Cabo',
    muscleGroups: ['Grande Dorsal', 'Bíceps'],
    description: 'Desenvolvimento da largura das costas',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'remada-curvada',
    name: 'Remada Curvada com Barra',
    category: 'Costas',
    equipment: 'Barra',
    muscleGroups: ['Grande Dorsal', 'Trapézio', 'Romboides'],
    description: 'Espessura das costas',
    defaultSets: 3,
    defaultReps: '10',
    defaultRest: 60
  },
  {
    id: 'remada-unilateral',
    name: 'Remada Unilateral com Halter',
    category: 'Costas',
    equipment: 'Halteres',
    muscleGroups: ['Grande Dorsal', 'Trapézio'],
    description: 'Trabalho unilateral para correção de assimetrias',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'remada-cabo-sentado',
    name: 'Remada Baixa no Cabo',
    category: 'Costas',
    equipment: 'Cabo',
    muscleGroups: ['Grande Dorsal', 'Romboides'],
    description: 'Remada sentada para desenvolvimento central',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'levantamento-terra',
    name: 'Levantamento Terra',
    category: 'Costas',
    equipment: 'Barra',
    muscleGroups: ['Lombar', 'Glúteos', 'Isquiotibiais', 'Trapézio'],
    description: 'Exercício composto fundamental para corpo todo',
    defaultSets: 3,
    defaultReps: '8',
    defaultRest: 120
  },

  // ==================== PERNAS ====================
  {
    id: 'agachamento-livre',
    name: 'Agachamento Livre',
    category: 'Pernas',
    equipment: 'Barra',
    muscleGroups: ['Quadríceps', 'Glúteos', 'Isquiotibiais'],
    description: 'Rei dos exercícios para pernas',
    defaultSets: 4,
    defaultReps: '10',
    defaultRest: 120
  },
  {
    id: 'leg-press',
    name: 'Leg Press 45°',
    category: 'Pernas',
    equipment: 'Máquina',
    muscleGroups: ['Quadríceps', 'Glúteos'],
    description: 'Exercício seguro para alta carga',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 90
  },
  {
    id: 'cadeira-extensora',
    name: 'Cadeira Extensora',
    category: 'Pernas',
    equipment: 'Máquina',
    muscleGroups: ['Quadríceps'],
    description: 'Isolamento do quadríceps',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 60
  },
  {
    id: 'mesa-flexora',
    name: 'Mesa Flexora',
    category: 'Pernas',
    equipment: 'Máquina',
    muscleGroups: ['Isquiotibiais'],
    description: 'Isolamento dos posteriores de coxa',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'stiff',
    name: 'Stiff',
    category: 'Pernas',
    equipment: 'Barra',
    muscleGroups: ['Isquiotibiais', 'Glúteos', 'Lombar'],
    description: 'Desenvolvimento posterior de pernas',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'afundo',
    name: 'Afundo',
    category: 'Pernas',
    equipment: 'Halteres',
    muscleGroups: ['Quadríceps', 'Glúteos'],
    description: 'Exercício unilateral funcional',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'panturrilha-em-pe',
    name: 'Panturrilha em Pé',
    category: 'Pernas',
    equipment: 'Máquina',
    muscleGroups: ['Gastrocnêmio', 'Sóleo'],
    description: 'Desenvolvimento da panturrilha',
    defaultSets: 4,
    defaultReps: '20',
    defaultRest: 45
  },

  // ==================== OMBROS ====================
  {
    id: 'desenvolvimento-barra',
    name: 'Desenvolvimento com Barra',
    category: 'Ombros',
    equipment: 'Barra',
    muscleGroups: ['Deltóide Anterior', 'Deltóide Medial', 'Tríceps'],
    description: 'Exercício composto para ombros',
    defaultSets: 3,
    defaultReps: '10',
    defaultRest: 60
  },
  {
    id: 'desenvolvimento-halteres',
    name: 'Desenvolvimento com Halteres',
    category: 'Ombros',
    equipment: 'Halteres',
    muscleGroups: ['Deltóide'],
    description: 'Maior amplitude de movimento',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'elevacao-lateral',
    name: 'Elevação Lateral',
    category: 'Ombros',
    equipment: 'Halteres',
    muscleGroups: ['Deltóide Medial'],
    description: 'Isolamento do deltóide medial',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45
  },
  {
    id: 'elevacao-frontal',
    name: 'Elevação Frontal',
    category: 'Ombros',
    equipment: 'Halteres',
    muscleGroups: ['Deltóide Anterior'],
    description: 'Isolamento do deltóide anterior',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 45
  },
  {
    id: 'crucifixo-inverso',
    name: 'Crucifixo Inverso',
    category: 'Ombros',
    equipment: 'Halteres',
    muscleGroups: ['Deltóide Posterior', 'Trapézio'],
    description: 'Trabalho do deltóide posterior',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45
  },
  {
    id: 'remada-alta',
    name: 'Remada Alta',
    category: 'Ombros',
    equipment: 'Barra',
    muscleGroups: ['Deltóide Medial', 'Trapézio'],
    description: 'Desenvolvimento de ombros e trapézio',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },

  // ==================== BÍCEPS ====================
  {
    id: 'rosca-direta-barra',
    name: 'Rosca Direta com Barra',
    category: 'Bíceps',
    equipment: 'Barra',
    muscleGroups: ['Bíceps Braquial'],
    description: 'Exercício clássico para bíceps',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'rosca-alternada',
    name: 'Rosca Alternada com Halteres',
    category: 'Bíceps',
    equipment: 'Halteres',
    muscleGroups: ['Bíceps Braquial'],
    description: 'Trabalho alternado dos bíceps',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'rosca-martelo',
    name: 'Rosca Martelo',
    category: 'Bíceps',
    equipment: 'Halteres',
    muscleGroups: ['Bíceps Braquial', 'Braquial', 'Braquiorradial'],
    description: 'Trabalha bíceps e antebraço',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'rosca-scott',
    name: 'Rosca Scott',
    category: 'Bíceps',
    equipment: 'Barra W',
    muscleGroups: ['Bíceps Braquial'],
    description: 'Isolamento do bíceps no banco scott',
    defaultSets: 3,
    defaultReps: '10',
    defaultRest: 60
  },
  {
    id: 'rosca-concentrada',
    name: 'Rosca Concentrada',
    category: 'Bíceps',
    equipment: 'Halteres',
    muscleGroups: ['Bíceps Braquial'],
    description: 'Isolamento unilateral do bíceps',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 45
  },

  // ==================== TRÍCEPS ====================
  {
    id: 'triceps-testa',
    name: 'Tríceps Testa',
    category: 'Tríceps',
    equipment: 'Barra W',
    muscleGroups: ['Tríceps Braquial'],
    description: 'Exercício clássico para tríceps',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'triceps-corda',
    name: 'Tríceps na Polia com Corda',
    category: 'Tríceps',
    equipment: 'Cabo',
    muscleGroups: ['Tríceps Braquial'],
    description: 'Isolamento do tríceps com corda',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45
  },
  {
    id: 'triceps-frances',
    name: 'Tríceps Francês',
    category: 'Tríceps',
    equipment: 'Halteres',
    muscleGroups: ['Tríceps Braquial'],
    description: 'Alongamento máximo do tríceps',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'mergulho-paralelas',
    name: 'Mergulho nas Paralelas',
    category: 'Tríceps',
    equipment: 'Paralelas',
    muscleGroups: ['Tríceps', 'Peitoral Inferior'],
    description: 'Exercício composto com peso corporal',
    defaultSets: 3,
    defaultReps: '12',
    defaultRest: 60
  },
  {
    id: 'triceps-coice',
    name: 'Tríceps Coice',
    category: 'Tríceps',
    equipment: 'Halteres',
    muscleGroups: ['Tríceps Braquial'],
    description: 'Isolamento unilateral do tríceps',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45
  },

  // ==================== ABDÔMEN ====================
  {
    id: 'abdominal-crunch',
    name: 'Abdominal Crunch',
    category: 'Abdômen',
    equipment: 'Peso Corporal',
    muscleGroups: ['Reto Abdominal'],
    description: 'Exercício básico para abdômen',
    defaultSets: 3,
    defaultReps: '20',
    defaultRest: 30
  },
  {
    id: 'prancha',
    name: 'Prancha Isométrica',
    category: 'Abdômen',
    equipment: 'Peso Corporal',
    muscleGroups: ['Core', 'Reto Abdominal', 'Transverso'],
    description: 'Exercício isométrico para core',
    defaultSets: 3,
    defaultReps: '60s',
    defaultRest: 45
  },
  {
    id: 'elevacao-pernas',
    name: 'Elevação de Pernas',
    category: 'Abdômen',
    equipment: 'Peso Corporal',
    muscleGroups: ['Abdômen Inferior'],
    description: 'Trabalho da porção inferior do abdômen',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45
  },
  {
    id: 'abdominal-bicicleta',
    name: 'Abdominal Bicicleta',
    category: 'Abdômen',
    equipment: 'Peso Corporal',
    muscleGroups: ['Oblíquos', 'Reto Abdominal'],
    description: 'Trabalho de rotação e oblíquos',
    defaultSets: 3,
    defaultReps: '20',
    defaultRest: 30
  },
  {
    id: 'abdominal-remador',
    name: 'Abdominal Remador',
    category: 'Abdômen',
    equipment: 'Peso Corporal',
    muscleGroups: ['Reto Abdominal', 'Flexores do Quadril'],
    description: 'Exercício dinâmico para core',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45
  },

  // ==================== ANTEBRAÇO ====================
  {
    id: 'rosca-punho',
    name: 'Rosca de Punho',
    category: 'Antebraço',
    equipment: 'Barra',
    muscleGroups: ['Flexores do Antebraço'],
    description: 'Desenvolvimento do antebraço',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45
  },
  {
    id: 'rosca-punho-inversa',
    name: 'Rosca de Punho Inversa',
    category: 'Antebraço',
    equipment: 'Barra',
    muscleGroups: ['Extensores do Antebraço'],
    description: 'Trabalho dos extensores',
    defaultSets: 3,
    defaultReps: '15',
    defaultRest: 45
  }
]

export const exerciseCategories = [
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Abdômen',
  'Antebraço'
]

export const equipmentTypes = [
  'Barra',
  'Halteres',
  'Cabo',
  'Máquina',
  'Peso Corporal',
  'Barra W',
  'Barra Fixa',
  'Paralelas'
]
