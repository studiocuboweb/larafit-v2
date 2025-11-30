export function useMask() {
  const masks = {
    phone: (value: string) => {
      if (!value) return ''
      const numbers = value.replace(/\D/g, '')
      
      if (numbers.length <= 10) {
        // Formato: (11) 9999-9999
        return numbers
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2')
      } else {
        // Formato: (11) 99999-9999
        return numbers
          .replace(/^(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .substring(0, 15)
      }
    },
    
    cpf: (value: string) => {
      if (!value) return ''
      const numbers = value.replace(/\D/g, '')
      return numbers
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1-$2')
        .substring(0, 14)
    },
    
    cep: (value: string) => {
      if (!value) return ''
      const numbers = value.replace(/\D/g, '')
      return numbers
        .replace(/^(\d{5})(\d)/, '$1-$2')
        .substring(0, 9)
    },
    
    date: (value: string) => {
      if (!value) return ''
      const numbers = value.replace(/\D/g, '')
      return numbers
        .replace(/^(\d{2})(\d)/, '$1/$2')
        .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
        .substring(0, 10)
    },
    
    cref: (value: string) => {
      if (!value) return ''
      // CREF format: 123456-G/UF
      const cleaned = value.toUpperCase().replace(/[^0-9A-Z]/g, '')
      return cleaned
        .replace(/^(\d{6})([A-Z])/, '$1-$2/')
        .substring(0, 11)
    },
    
    money: (value: string) => {
      if (!value) return ''
      const numbers = value.replace(/\D/g, '')
      const amount = parseFloat(numbers) / 100
      return amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  }

  const applyMask = (value: string, maskType: keyof typeof masks) => {
    return masks[maskType](value)
  }

  const unmask = (value: string) => {
    return value.replace(/\D/g, '')
  }

  return {
    applyMask,
    unmask,
    masks
  }
}
