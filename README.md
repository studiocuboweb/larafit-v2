# 🏋️ LaraFit - Sistema de Gerenciamento de Academia

Sistema completo de gerenciamento de academia desenvolvido com **Nuxt 3**, **Prisma** e **PostgreSQL**.

## 🚀 Tecnologias

- **Frontend & Backend**: Nuxt 3 (Vue 3 + API integrada)
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL
- **Estilização**: TailwindCSS
- **TypeScript**: Full type-safety

## 📋 Funcionalidades

### Painel Administrativo
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de alunos
- ✅ Gerenciamento de professores
- ✅ Criação e gestão de treinos
- ✅ Controle financeiro (pagamentos)

### Área do Aluno
- ✅ Visualização de treinos ativos
- ✅ Detalhes dos exercícios
- ✅ Acompanhamento de progresso
- ✅ Perfil pessoal

## 🗄️ Estrutura do Banco de Dados

```
User (Usuário base)
├── Student (Aluno)
│   ├── Workouts (Treinos)
│   │   └── Exercises (Exercícios)
│   └── Payments (Pagamentos)
└── Teacher (Professor)
    └── Workouts (Treinos criados)
```

## 🛠️ Setup do Projeto

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados

Edite o arquivo `.env` com suas credenciais do PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/larafit?schema=public"
```

### 3. Criar o Banco de Dados

```bash
# Gerar o Prisma Client
npx prisma generate

# Criar as tabelas no banco
npx prisma db push

# (Opcional) Abrir o Prisma Studio para visualizar os dados
npx prisma studio
```

### 4. Rodar o Projeto

```bash
npm run dev
```

O projeto estará disponível em: http://localhost:3000

## 📁 Estrutura do Projeto

```
larafit-v2/
├── server/
│   ├── api/                    # API Routes (endpoints automáticos)
│   │   ├── users/
│   │   ├── students/
│   │   ├── workouts/
│   │   └── payments/
│   └── utils/
│       └── prisma.ts           # Instância do Prisma Client
├── pages/
│   ├── index.vue               # Página de login
│   ├── admin/
│   │   └── index.vue           # Dashboard administrativo
│   └── student/
│       └── workouts/
│           └── index.vue       # Treinos do aluno
├── layouts/
│   ├── admin.vue               # Layout do painel admin
│   └── student.vue             # Layout da área do aluno
├── prisma/
│   └── schema.prisma           # Schema do banco de dados
└── nuxt.config.ts              # Configuração do Nuxt
```

## 🔌 API Endpoints

### Usuários
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/:id` - Buscar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Alunos
- `GET /api/students` - Listar alunos
- `POST /api/students` - Criar aluno

### Treinos
- `GET /api/workouts` - Listar treinos
- `GET /api/workouts?studentId=X` - Treinos de um aluno
- `POST /api/workouts` - Criar treino

### Exercícios
- `GET /api/workouts/:workoutId/exercises` - Exercícios de um treino
- `POST /api/workouts/:workoutId/exercises` - Adicionar exercício

### Pagamentos
- `GET /api/payments` - Listar pagamentos
- `GET /api/payments?studentId=X` - Pagamentos de um aluno
- `POST /api/payments` - Criar pagamento

## 🎨 Design

O sistema usa **TailwindCSS** para uma interface moderna e responsiva:
- Layout administrativo com sidebar e navegação
- Área do aluno otimizada para mobile
- Cards e componentes reutilizáveis
- Sistema de cores com paleta azul

## 📝 Próximos Passos

1. ⚠️ **Implementar autenticação** (JWT + bcrypt)
2. 📊 **Dashboard real** conectado com API
3. 📱 **Melhorar responsividade mobile**
4. 🔔 **Sistema de notificações**
5. 📸 **Upload de imagens** (avatar, exercícios)
6. 📈 **Gráficos de progresso**
7. 💪 **Registro de execução de treinos**

## 🐛 Debug

### Ver dados no banco
```bash
npx prisma studio
```

### Reset do banco
```bash
npx prisma db push --force-reset
```

### Ver logs da API
Os logs aparecem automaticamente no terminal onde você rodou `npm run dev`

---

**Desenvolvido com Nuxt 3 + Prisma + PostgreSQL** 🚀
