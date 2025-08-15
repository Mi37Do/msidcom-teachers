import { ref } from 'vue'

export function useRandomColor() {
  const colors = ['#65D3EC1A', '#EF607933', '#7E5EEE1A', '#00778B1A', '#F1B43433', '#49C5B133']

  function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
  }

  return {
    getRandomColor,
  }
}
