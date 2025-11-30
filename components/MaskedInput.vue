<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      v-model="displayValue"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="handleInput"
      @blur="handleBlur"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
      :class="[
        disabled ? 'bg-gray-100 cursor-not-allowed' : '',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
      ]"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
  label?: string
  id?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  mask?: 'phone' | 'cpf' | 'cep' | 'date' | 'cref' | 'money' | null
  hint?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  mask: null,
  required: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': [event: Event]
}>()

const { applyMask } = useMask()
const displayValue = ref('')

// Inicializar valor com máscara se houver
if (props.modelValue && props.mask) {
  displayValue.value = applyMask(props.modelValue, props.mask)
} else {
  displayValue.value = props.modelValue
}

// Observar mudanças no modelValue vindo de fora
watch(() => props.modelValue, (newValue) => {
  if (props.mask && newValue) {
    displayValue.value = applyMask(newValue, props.mask)
  } else {
    displayValue.value = newValue
  }
})

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value

  if (props.mask) {
    // Aplicar máscara
    value = applyMask(value, props.mask)
    displayValue.value = value
    
    // Emitir valor sem máscara (apenas números) para v-model
    const unmasked = value.replace(/\D/g, '')
    emit('update:modelValue', unmasked)
  } else {
    emit('update:modelValue', value)
  }
}

const handleBlur = (event: Event) => {
  emit('blur', event)
}
</script>
