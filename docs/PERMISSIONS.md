# Sistema de Permissões - LaraFit

## Visão Geral

O sistema implementa controle de acesso baseado em perfis (Role-Based Access Control - RBAC) com três níveis: **ADMIN**, **TEACHER** e **STUDENT**.

## Estrutura de Dados

### Relacionamento Professor-Aluno
- Todo aluno (`Student`) possui um campo obrigatório `teacherId`
- Um professor (`Teacher`) pode ter vários alunos
- Quando um admin cria um aluno, deve especificar qual professor será responsável
- Quando um professor cria um aluno, este é automaticamente associado a ele

## Regras por Perfil

### 👨‍💼 ADMIN (Administrador)
**Alunos:**
- ✅ Visualizar todos os alunos
- ✅ Criar alunos (deve especificar o professor responsável via `teacherId`)
- ✅ Editar qualquer aluno
- ✅ Alterar o professor responsável de um aluno
- ✅ Deletar qualquer aluno

**Treinos:**
- ✅ Visualizar todos os treinos
- ✅ Criar treinos para qualquer aluno
- ✅ Editar qualquer treino
- ✅ Deletar qualquer treino

### 👨‍🏫 TEACHER (Professor)
**Alunos:**
- ✅ Visualizar apenas seus próprios alunos (onde `teacherId` = seu ID)
- ✅ Criar alunos (automaticamente associados a ele)
- ✅ Editar apenas seus alunos
- ❌ Não pode alterar o professor responsável
- ✅ Deletar apenas seus alunos

**Treinos:**
- ✅ Visualizar apenas treinos de seus alunos
- ✅ Criar treinos apenas para seus alunos
- ✅ Editar apenas treinos de seus alunos
- ✅ Deletar apenas treinos de seus alunos

### 🏃 STUDENT (Aluno)
**Alunos:**
- ❌ Não pode listar alunos
- ✅ Pode visualizar apenas seus próprios dados
- ❌ Não pode criar alunos
- ❌ Não pode editar outros alunos
- ❌ Não pode deletar alunos

**Treinos:**
- ✅ Visualizar apenas seus próprios treinos (onde `studentId` = seu ID)
- ✅ Ver detalhes de seus treinos
- ❌ Não pode criar treinos
- ❌ Não pode editar treinos
- ❌ Não pode deletar treinos

## Endpoints Atualizados

### `/api/students` (GET)
- **ADMIN**: Retorna todos os alunos
- **TEACHER**: Retorna apenas alunos onde `teacherId` = ID do professor logado
- **STUDENT**: Retorna erro 403

### `/api/students` (POST)
- **ADMIN**: Cria aluno com `teacherId` especificado no body
- **TEACHER**: Cria aluno automaticamente associado a ele (`teacherId` = seu ID)
- **STUDENT**: Retorna erro 403

### `/api/students/:id` (GET)
- **ADMIN**: Acessa qualquer aluno
- **TEACHER**: Acessa apenas se o aluno for seu
- **STUDENT**: Acessa apenas seus próprios dados

### `/api/students/:id` (PUT)
- **ADMIN**: Edita qualquer aluno e pode alterar o `teacherId`
- **TEACHER**: Edita apenas seus alunos, não pode alterar `teacherId`
- **STUDENT**: Retorna erro 403

### `/api/students/:id` (DELETE)
- **ADMIN**: Deleta qualquer aluno
- **TEACHER**: Deleta apenas seus alunos
- **STUDENT**: Retorna erro 403

### `/api/workouts` (GET)
- **ADMIN**: Retorna todos os treinos
- **TEACHER**: Retorna apenas treinos de seus alunos
- **STUDENT**: Retorna apenas seus próprios treinos

### `/api/workouts` (POST)
- **ADMIN**: Cria treino para qualquer aluno
- **TEACHER**: Cria treino apenas para seus alunos
- **STUDENT**: Retorna erro 403

### `/api/workouts/:id` (GET, PUT, DELETE)
- **ADMIN**: Acesso total
- **TEACHER**: Acesso apenas a treinos de seus alunos
- **STUDENT**: GET permite ver seus treinos, PUT/DELETE retornam erro 403

## Funções de Autorização

Localizadas em `/server/utils/auth.ts`:

### `requireAuth(event)`
Valida o token JWT e retorna os dados do usuário autenticado.

### `requireAdmin(event)`
Valida que o usuário é ADMIN, lança erro 403 caso contrário.

### `requireTeacher(event)`
Valida que o usuário é TEACHER ou ADMIN, lança erro 403 caso contrário.

### `requireStudent(event)`
Valida que o usuário é STUDENT, lança erro 403 caso contrário.

### `canAccessStudent(auth, studentId, student?)`
Verifica se o usuário tem permissão para acessar um aluno específico.

### `canAccessWorkout(auth, workout?)`
Verifica se o usuário tem permissão para acessar um treino específico.

## Dados de Teste

Após rodar `npx prisma db seed`:

**Professores:**
- João Silva (joao.silva@larafit.com) - Responsável por: Carlos, Ana Paula e Lucas
- Maria Santos (maria.santos@larafit.com) - Responsável por: Pedro e Julia

**Alunos:**
- Carlos Oliveira (carlos@email.com) - Professor: João Silva
- Ana Paula (ana@email.com) - Professor: João Silva
- Pedro Costa (pedro@email.com) - Professor: Maria Santos
- Julia Ferreira (julia@email.com) - Professor: Maria Santos
- Lucas Mendes (lucas@email.com - INATIVO) - Professor: João Silva

## Testando as Permissões

1. Faça login como `maria.santos@larafit.com` / `professor123`
2. Acesse `/api/students` - deve ver apenas Pedro Costa e Julia Ferreira
3. Acesse `/api/workouts` - deve ver apenas treinos desses dois alunos
4. Tente acessar dados de Carlos Oliveira - deve retornar erro 403

5. Faça login como `carlos@email.com` / `aluno123`
6. Acesse `/api/workouts` - deve ver apenas seus próprios treinos
7. Tente acessar `/api/students` - deve retornar erro 403
