import { mount } from '@vue/test-utils'
import ReminderForm from '@/components/ReminderForm.vue'

describe('ReminderForm.vue', () => {
    it('disables the add button and shows an error message if title exceeds 30 characters', async () => {
        const wrapper = mount(ReminderForm)

        // Encuentra el input para el título y el botón de añadir
        const titleInput = wrapper.find('input[type="text"]')
        const addButton = wrapper.find('button[type="submit"]')
        const errorMessage = () => wrapper.find('.error')

        // Establece el título del recordatorio a más de 30 caracteres
        await titleInput.setValue('This is a very long reminder title that exceeds the limit')

        // Verifica que el botón de añadir esté deshabilitado
        expect(addButton.attributes('disabled')).toBe('disabled')

        // Verifica que el mensaje de error se muestre
        expect(errorMessage().exists()).toBe(true)
        expect(errorMessage().text()).toBe('The reminder cannot exceed 30 characters')
    })
})