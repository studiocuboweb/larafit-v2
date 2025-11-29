LARAFIT-V2 - DOCUMENTAÇÃO COMPLETA DO PROJETO
==============================================

## 🎯 ESCOPO DO PROJETO

Sistema web completo para gerenciamento de academias com:
- Painel administrativo para gestão de treinos, professores, alunos e financeiro
- Área do aluno para visualização de treinos personalizados
- Sistema responsivo (mobile-first)

## 🏗️ ARQUITETURA ESCOLHIDA

### Stack Tecnológica:
- **Nuxt 3** - Framework full-stack (Vue 3 + API integrada)
- **Prisma** - ORM type-safe para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **TailwindCSS** - Framework CSS para UI responsiva

### Vantagens da Arquitetura Monorepo:
✅ Backend e Frontend no mesmo projeto
✅ Copilot tem contexto completo do código
✅ TypeScript compartilhado entre client/server
✅ API routes automáticas do Nuxt
✅ Menos configuração, mais produtividade

## 📊 MODELO DO BANCO DE DADOS

### Entidades Principais:

1. **User** (Usuário base)
   - id, email, password, name, role, active
   - Roles: ADMIN, TEACHER, STUDENT

2. **Student** (Aluno)
   - Relacionamento 1:1 com User
   - phone, birthDate, observations
   - Relacionamento 1:N com Workout e Payment

3. **Teacher** (Professor)
   - Relacionamento 1:1 com User
   - specialties[], cref, phone
   - Relacionamento 1:N com Workout

4. **Workout** (Treino)
   - name, description, status, startDate, endDate
   - Relacionamento N:1 com Student e Teacher
   - Relacionamento 1:N com Exercise
   - Status: ACTIVE, INACTIVE, DRAFT

5. **Exercise** (Exercício)
   - name, sets, reps, rest, weight, notes, order, videoUrl
   - Relacionamento N:1 com Workout

6. **Payment** (Pagamento)
   - amount, dueDate, paymentDate, status, method, referenceMonth
   - Relacionamento N:1 com Student
   - Status: PENDING, PAID, OVERDUE, CANCELLED
   - Methods: CASH, CREDIT_CARD, DEBIT_CARD, PIX, BANK_TRANSFER

### Diagrama de Relacionamentos:
```
User 1───1 Student ───┬─ N Workout ─── N Exercise
                      └─ N Payment
     
User 1───1 Teacher ─── N Workout
```

## 🔌 DESIGN DA API

### Padrão REST com Rotas Automáticas do Nuxt

**Base URL:** `http://localhost:3000/api`

### Endpoints Implementados:

#### USERS
- `GET    /api/users`       → Lista todos os usuários
- `POST   /api/users`       → Cria novo usuário
- `GET    /api/users/:id`   → Busca usuário específico
- `PUT    /api/users/:id`   → Atualiza usuário
- `DELETE /api/users/:id`   → Remove usuário

#### STUDENTS
- `GET    /api/students`    → Lista todos os alunos (com dados do user)
- `POST   /api/students`    → Cria novo aluno

#### WORKOUTS
- `GET    /api/workouts`              → Lista todos os treinos
- `GET    /api/workouts?studentId=X`  → Filtra treinos por aluno
- `POST   /api/workouts`              → Cria novo treino

#### EXERCISES
- `GET    /api/workouts/:workoutId/exercises`  → Lista exercícios do treino
- `POST   /api/workouts/:workoutId/exercises`  → Adiciona exercício ao treino

#### PAYMENTS
- `GET    /api/payments`              → Lista todos os pagamentos
- `GET    /api/payments?studentId=X`  → Filtra pagamentos por aluno
- `GET    /api/payments?status=X`     → Filtra por status
- `POST   /api/payments`              → Registra novo pagamento

### Estrutura de Resposta:
```json
{
  "id": "cuid",
  "...": "campos do modelo",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

### Tratamento de Erros:
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

## 🎨 DESIGN DO FRONTEND

### 1. PAINEL ADMINISTRATIVO (/admin)

**Layout:** `layouts/admin.vue`
- Navbar horizontal com logo e menu
- Links: Dashboard, Alunos, Professores, Treinos, Financeiro
- Botão de logout

**Páginas:**

a) **Dashboard** (`/admin/index.vue`)
   - 4 cards de estatísticas:
     * Total de Alunos
     * Total de Professores
     * Treinos Ativos
     * Receita Mensal
   - Ações rápidas (botões):
     * Novo Aluno
     * Novo Treino
     * Registrar Pagamento
     * Novo Professor

b) **Alunos** (`/admin/students/`)
   - Lista em tabela com filtros
   - Dados: Nome, Email, Telefone, Status, Ações
   - Botão "Novo Aluno"
   - Modal/página para criar/editar aluno

c) **Professores** (`/admin/teachers/`)
   - Lista em tabela
   - Dados: Nome, Especialidades, CREF, Telefone
   - CRUD completo

d) **Treinos** (`/admin/workouts/`)
   - Lista em cards
   - Filtro por aluno
   - Dados: Nome, Aluno, Professor, Status, Qtd Exercícios
   - Criação/edição de treino com:
     * Informações básicas
     * Lista de exercícios (drag & drop para ordenar)
     * Adicionar/remover exercícios

e) **Financeiro** (`/admin/payments/`)
   - Tabela de pagamentos
   - Filtros: Mês, Status, Aluno
   - Indicadores visuais: Pendente, Pago, Atrasado
   - Resumo mensal

### 2. ÁREA DO ALUNO (/student)

**Layout:** `layouts/student.vue`
- Navbar azul com logo
- Menu: Meus Treinos, Perfil
- Botão logout

**Páginas:**

a) **Meus Treinos** (`/student/workouts/index.vue`)
   - Grid de cards com treinos ativos
   - Cada card mostra:
     * Nome do treino
     * Professor responsável
     * Quantidade de exercícios
     * Status (badge)
     * Botão "Ver Treino"

b) **Detalhes do Treino** (`/student/workouts/[id].vue`)
   - Título e descrição do treino
   - Lista de exercícios com:
     * Nome
     * Séries x Repetições
     * Carga
     * Tempo de descanso
     * Observações
     * Link para vídeo (se houver)
   - Checkbox para marcar exercício como concluído
   - Botão "Treino Completo"

c) **Perfil** (`/student/profile.vue`)
   - Dados pessoais
   - Edição de informações
   - Histórico de treinos

### 3. LOGIN (`/index.vue`)
- Página inicial sem layout
- Fundo gradiente azul
- Card centralizado com:
  * Logo LaraFit
  * Campos: Email, Senha
  * Botão "Entrar"
  * Links rápidos (dev): Admin / Aluno

### Componentes Visuais:
- **Cores principais:** Azul (primary), Verde (success), Vermelho (danger), Cinza (neutral)
- **Tipografia:** Font system (sans-serif)
- **Espaçamento:** Grid 4px (Tailwind padrão)
- **Responsividade:** Mobile-first (breakpoints: sm, md, lg, xl)

## 📂 ESTRUTURA DE ARQUIVOS

```
larafit-v2/
├── .env                          # Variáveis de ambiente
├── .gitignore
├── README.md                     # Documentação do projeto
├── package.json
├── nuxt.config.ts                # Config do Nuxt + TailwindCSS
├── tailwind.config.js
├── tsconfig.json
│
├── prisma/
│   └── schema.prisma             # Schema do banco (6 models)
│
├── server/
│   ├── api/                      # API Routes
│   │   ├── users/
│   │   │   ├── index.ts          # GET, POST /api/users
│   │   │   └── [id].ts           # GET, PUT, DELETE /api/users/:id
│   │   ├── students/
│   │   │   └── index.ts
│   │   ├── workouts/
│   │   │   ├── index.ts
│   │   │   └── [workoutId]/
│   │   │       └── exercises.ts
│   │   └── payments/
│   │       └── index.ts
│   └── utils/
│       └── prisma.ts             # Singleton do Prisma Client
│
├── layouts/
│   ├── admin.vue                 # Layout painel admin
│   └── student.vue               # Layout área do aluno
│
├── pages/
│   ├── index.vue                 # Página de login
│   ├── admin/
│   │   └── index.vue             # Dashboard
│   └── student/
│       └── workouts/
│           └── index.vue         # Lista de treinos
│
└── components/                   # Componentes reutilizáveis (futuro)
```

## 🚀 FUNCIONALIDADES IMPLEMENTADAS

✅ Estrutura completa do banco de dados (6 tabelas)
✅ API REST com 5 recursos principais
✅ Layout administrativo
✅ Layout do aluno
✅ Dashboard com cards de estatísticas
✅ Página de treinos do aluno
✅ Página de login
✅ Configuração Prisma + PostgreSQL
✅ Configuração TailwindCSS
✅ TypeScript habilitado

## 📝 PRÓXIMAS IMPLEMENTAÇÕES SUGERIDAS

### Fase 1 - Essencial
1. Implementar autenticação JWT
2. Hash de senhas com bcrypt
3. Conectar dashboard com APIs reais
4. CRUD completo de alunos
5. CRUD completo de professores
6. Criação e edição de treinos

### Fase 2 - Avançado
7. Sistema de permissões (middleware)
8. Upload de imagens (avatar, exercícios)
9. Biblioteca de exercícios
10. Registro de execução de treinos
11. Gráficos de progresso
12. Notificações de pagamentos

### Fase 3 - Premium
13. App mobile (React Native / Capacitor)
14. Exportar treino em PDF
15. Integração pagamentos (Stripe/PagSeguro)
16. Sistema de mensagens professor-aluno
17. Relatórios financeiros avançados

## 🐛 COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev                    # Inicia servidor de desenvolvimento

# Banco de Dados
npx prisma generate           # Gera Prisma Client
npx prisma db push            # Sincroniza schema com DB
npx prisma studio             # Interface visual do DB
npx prisma migrate dev        # Cria migration

# Build & Deploy
npm run build                 # Build para produção
npm run preview               # Preview da build

# Linting
npm run lint                  # Verifica código
```

## 🔐 VARIÁVEIS DE AMBIENTE

```env
# .env
DATABASE_URL="postgresql://user:pass@localhost:5432/larafit?schema=public"
JWT_SECRET="change-this-in-production"
```

## 📖 REFERÊNCIAS

- [Nuxt 3 Docs](https://nuxt.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Projeto criado em:** 29 de Novembro de 2025
**Stack:** Nuxt 3 + Prisma + PostgreSQL + TailwindCSS
