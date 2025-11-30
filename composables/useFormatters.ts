export function useFormatters() {
  const formatDate = (date: string | Date | null, format: 'short' | 'long' = 'short') => {
    if (!date) return '-'
    
    const d = new Date(date)
    
    if (format === 'short') {
      return d.toLocaleDateString('pt-BR')
    }
    
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return '-'
    
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatPhone = (phone: string | null) => {
    if (!phone) return '-'
    
    const numbers = phone.replace(/\D/g, '')
    
    if (numbers.length <= 10) {
      return numbers.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return numbers.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  const formatCPF = (cpf: string | null) => {
    if (!cpf) return '-'
    
    const numbers = cpf.replace(/\D/g, '')
    return numbers.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatCEP = (cep: string | null) => {
    if (!cep) return '-'
    
    const numbers = cep.replace(/\D/g, '')
    return numbers.replace(/^(\d{5})(\d{3})/, '$1-$2')
  }

  return {
    formatDate,
    formatCurrency,
    formatPhone,
    formatCPF,
    formatCEP
  }
}
