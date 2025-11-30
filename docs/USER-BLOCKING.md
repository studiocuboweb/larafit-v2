# Sistema de Bloqueio de Usuários

## Funcionalidade Implementada

Sistema que bloqueia o acesso de usuários inativos com mensagem personalizada.

## Como Funciona

### 1. Verificação no Login (server/api/auth/login.ts)

Quando um usuário tenta fazer login, o sistema verifica se o campo `active` está `true`:

```typescript
// Verificar se o usuário está ativo
if (!user.active) {
  throw createError({
    statusCode: 403,
    message: 'Seu usuário está bloqueado, favor entrar em contato'
  })
}
```

**Status HTTP:** 403 Forbidden

### 2. Mensagem Destacada na Tela de Login (pages/index.vue)

A mensagem de usuário bloqueado é exibida com estilo diferenciado:

- **Usuário bloqueado:** Fundo amarelo, borda amarela grossa, ícone de alerta
- **Outros erros:** Fundo vermelho, borda vermelha

A detecção é feita automaticamente verificando se a mensagem contém "bloqueado":

```typescript
const isBlockedUser = computed(() => error.value.includes('bloqueado'))
```

### 3. Middleware Global (middleware/auth.global.ts)

Verifica o status do usuário em todas as navegações:

- Executa em todas as rotas (exceto login)
- Lê o status do localStorage
- Se `active === false`, remove dados e redireciona para login
- Previne que usuários bloqueados acessem o sistema mesmo com token válido

### 4. Endpoint de Verificação (server/api/auth/me.ts)

API para verificar status atual do usuário logado:

```
GET /api/auth/me
```

Retorna erro 403 se o usuário estiver bloqueado.

## Como Bloquear/Desbloquear Usuários

### Pelo Admin Panel

Ao editar um aluno no formulário `/admin/students/[id]`:

1. Alterar o campo "Status" para "Inativo"
2. Salvar
3. O usuário não conseguirá mais fazer login

### Diretamente no Banco

```sql
-- Bloquear usuário
UPDATE users SET active = false WHERE email = 'usuario@email.com';

-- Desbloquear usuário
UPDATE users SET active = true WHERE email = 'usuario@email.com';
```

### Pelo Prisma Studio

```bash
npx prisma studio
```

1. Abrir tabela `users`
2. Encontrar o usuário
3. Alterar campo `active` para `true` ou `false`

## Usuários de Teste

O seed inclui um usuário bloqueado para testes:

```
Email: lucas@email.com
Senha: aluno123
Status: Inativo (bloqueado)
```

**Para testar:**
1. Tentar fazer login com lucas@email.com
2. Ver mensagem: "Seu usuário está bloqueado, favor entrar em contato"
3. Mensagem aparece com fundo amarelo e ícone de alerta

## Mensagens Exibidas

### Login com Usuário Bloqueado

```
⚠️ Seu usuário está bloqueado, favor entrar em contato

Entre em contato com a administração da academia para 
reativar seu acesso.
```

### Login com Credenciais Inválidas

```
❌ Email ou senha inválidos
```

## Fluxo Completo

```
1. Usuário tenta fazer login
   ↓
2. Backend verifica se active = true
   ↓
3a. Se active = false
    → Retorna erro 403
    → Frontend exibe mensagem destacada
    → Usuário não consegue entrar
   
3b. Se active = true
    → Verifica senha
    → Gera token JWT
    → Usuário faz login normalmente
```

## Segurança

- ✅ Verificação no backend (não pode ser burlada)
- ✅ Token JWT não é gerado para usuários bloqueados
- ✅ Middleware verifica em todas as rotas
- ✅ Dados removidos do localStorage ao detectar bloqueio
- ✅ Status HTTP 403 (Forbidden) apropriado

## Melhorias Futuras

- [ ] Log de tentativas de login de usuários bloqueados
- [ ] Email automático ao administrador quando usuário bloqueado tenta acessar
- [ ] Histórico de bloqueios/desbloqueios
- [ ] Motivo do bloqueio no banco de dados
- [ ] Data de bloqueio e quem bloqueou
