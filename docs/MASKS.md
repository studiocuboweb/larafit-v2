# Sistema de Máscaras e Formatação

## Composables Criados

### 1. useMask()
Composable para aplicar máscaras em inputs durante a digitação.

**Máscaras disponíveis:**
- `phone`: (11) 99425-3218
- `cpf`: 123.456.789-01
- `cep`: 12345-678
- `date`: 01/01/2024
- `cref`: 123456-G/SP
- `money`: 1.234,56

**Uso:**
```vue
<script setup>
const { applyMask, unmask } = useMask()

const handleInput = (event) => {
  const masked = applyMask(event.target.value, 'phone')
  // masked = "(11) 99425-3218"
  
  const unmasked = unmask(masked)
  // unmasked = "11994253218"
}
</script>
```

### 2. useFormatters()
Composable para formatar valores para exibição (não edição).

**Formatadores disponíveis:**
- `formatPhone(phone)`: Formata telefone com DDD
- `formatCPF(cpf)`: Formata CPF
- `formatCEP(cep)`: Formata CEP
- `formatDate(date, 'short' | 'long')`: Formata data
- `formatCurrency(value)`: Formata valor monetário em R$

**Uso:**
```vue
<script setup>
const { formatPhone, formatDate, formatCurrency } = useFormatters()
</script>

<template>
  <p>{{ formatPhone(student.phone) }}</p>
  <!-- Exibe: (11) 99425-3218 -->
  
  <p>{{ formatDate(student.birthDate) }}</p>
  <!-- Exibe: 01/01/2000 -->
  
  <p>{{ formatCurrency(payment.amount) }}</p>
  <!-- Exibe: R$ 150,00 -->
</template>
```

## Componente MaskedInput

Componente reutilizável para inputs com máscaras.

**Props:**
- `modelValue`: Valor do input (v-model)
- `label`: Label do campo
- `mask`: Tipo de máscara ('phone', 'cpf', 'cep', etc.)
- `placeholder`: Placeholder
- `required`: Campo obrigatório
- `disabled`: Campo desabilitado
- `error`: Mensagem de erro
- `hint`: Dica de preenchimento

**Uso:**
```vue
<template>
  <MaskedInput
    v-model="form.phone"
    label="Telefone"
    mask="phone"
    placeholder="(11) 99425-3218"
    hint="Digite o telefone com DDD"
  />
  
  <MaskedInput
    v-model="form.cpf"
    label="CPF"
    mask="cpf"
    required
  />
</template>

<script setup>
const form = ref({
  phone: '', // Armazena apenas números: "11994253218"
  cpf: ''    // Armazena apenas números: "12345678901"
})
</script>
```

## Implementações Atuais

### Formulário de Alunos (/admin/students/[id])
- ✅ Campo de telefone com máscara (11) 99425-3218
- ✅ Máscara aplicada ao carregar dados existentes
- ✅ Valor salvo sem formatação (apenas números)

### Lista de Alunos (/admin/students)
- ✅ Telefone formatado na exibição
- ✅ Usa `formatPhone()` do composable

## Próximos Passos

### Para Professores:
- Aplicar máscara de telefone no formulário
- Aplicar máscara de CREF (123456-G/SP)
- Formatar na listagem

### Para Pagamentos:
- Formatar valores monetários
- Formatar datas de referência
- Aplicar máscara em campos de valor

### Para Alunos (adicional):
- Adicionar campo CPF com máscara
- Adicionar campo CEP com máscara

## Exemplos de Implementação

### Substituir input normal por MaskedInput:

**Antes:**
```vue
<input
  v-model="form.phone"
  type="tel"
  placeholder="(11) 99999-9999"
/>
```

**Depois:**
```vue
<MaskedInput
  v-model="form.phone"
  label="Telefone"
  mask="phone"
  placeholder="(11) 99425-3218"
/>
```

### Formatar na listagem:

**Antes:**
```vue
<td>{{ student.phone || '-' }}</td>
```

**Depois:**
```vue
<script setup>
const { formatPhone } = useFormatters()
</script>

<td>{{ formatPhone(student.phone) }}</td>
```
