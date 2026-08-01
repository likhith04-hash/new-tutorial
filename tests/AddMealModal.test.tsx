import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddMealModal from '@/app/components/AddMealModal'
import { isoDaysAgo, makeMeal, readStorage, seedStorage, wrapper as Providers } from './helpers'
import type { Meal } from '@/app/components/NutritionContext'

function renderModal(props: Partial<React.ComponentProps<typeof AddMealModal>> = {}, existing: Meal[] = []) {
  const onClose = vi.fn()
  seedStorage({ meals: existing })
  const view = render(
    <Providers>
      <AddMealModal open onClose={onClose} {...props} />
    </Providers>,
  )
  return { ...view, onClose }
}

describe('AddMealModal', () => {
  it('renders nothing while closed', () => {
    const { container } = render(<Providers><AddMealModal open={false} onClose={vi.fn()} /></Providers>)
    expect(container).toBeEmptyDOMElement()
  })

  it('adds a meal with the entered values on the target date', async () => {
    const { onClose } = renderModal({ date: isoDaysAgo(2) })

    await userEvent.type(screen.getByLabelText('Meal name'), 'Paneer wrap')
    await userEvent.clear(screen.getByLabelText('Calories'))
    await userEvent.type(screen.getByLabelText('Calories'), '470')
    await userEvent.click(screen.getByRole('button', { name: 'Dinner' }))
    await userEvent.click(screen.getByRole('button', { name: /Add to diary/ }))

    const [meal] = readStorage().meals
    expect(meal).toMatchObject({ name: 'Paneer wrap', calories: 470, type: 'Dinner', date: isoDaysAgo(2) })
    expect(onClose).toHaveBeenCalled()
  })

  it('falls back to defaults for a blank name and today\'s date', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /Add to diary/ }))

    expect(readStorage().meals[0]).toMatchObject({
      name: 'Custom meal',
      detail: 'Quick added · 1 serving',
      calories: 400,
      protein: 15,
      date: isoDaysAgo(0),
    })
  })

  it('fills the form from a preset', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /Protein Shake \(250 kcal\)/ }))

    expect(screen.getByLabelText('Meal name')).toHaveValue('Protein Shake')
    expect(screen.getByLabelText('Calories')).toHaveValue(250)
    expect(screen.getByLabelText('Protein (g)')).toHaveValue(30)
    expect(screen.getByRole('button', { name: 'Snack' })).toHaveClass('active')
  })

  it('edits an existing meal in place instead of adding one', async () => {
    const meal = makeMeal({ id: 'm1', name: 'Old name', calories: 300, date: isoDaysAgo(1) })
    const { onClose } = renderModal({ editMeal: meal }, [meal])

    expect(screen.getByRole('heading', { name: 'Edit meal details' })).toBeInTheDocument()
    expect(screen.getByLabelText('Meal name')).toHaveValue('Old name')
    expect(screen.queryByRole('button', { name: /Photo AI/ })).toBeNull()

    await userEvent.clear(screen.getByLabelText('Meal name'))
    await userEvent.type(screen.getByLabelText('Meal name'), 'New name')
    await userEvent.click(screen.getByRole('button', { name: /Save changes/ }))

    const stored = readStorage().meals
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject({ id: 'm1', name: 'New name', date: isoDaysAgo(1) })
    expect(onClose).toHaveBeenCalled()
  })

  it('closes from the backdrop and the close button without saving', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('button', { name: '×' }))
    await userEvent.click(document.querySelector('.modal-backdrop') as HTMLElement)

    expect(onClose).toHaveBeenCalledTimes(2)
    expect(readStorage().meals).toEqual([])
  })

  it('does not close when the form itself is clicked', async () => {
    const { onClose } = renderModal()

    await userEvent.click(screen.getByRole('heading', { name: 'Add a meal' }))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('analyzes a barcode scan and fills in the matched product', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /Barcode/ }))
    expect(screen.getByText('AI is analyzing barcode data...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByLabelText('Meal name')).toHaveValue('High-Protein Greek Yogurt (170g)')
    }, { timeout: 3000 })
    expect(screen.getByLabelText('Calories')).toHaveValue(145)
    expect(screen.queryByText('AI is analyzing barcode data...')).toBeNull()
  })

  it('estimates macros from an uploaded photo', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /Photo AI/ }))
    const file = new File(['fake-bytes'], 'meal.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(input, file)
    expect(screen.getByText('AI is analyzing your photo...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByAltText('Food scan preview')).toBeInTheDocument()
    }, { timeout: 3000 })
    expect((screen.getByLabelText('Meal name') as HTMLInputElement).value.length).toBeGreaterThan(0)
    expect(screen.getByText('AI Estimate Ready')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Add to diary/ }))
    expect(readStorage().meals[0].detail).toMatch(/AI Vision estimate · \d+% confidence/)
  })

  it('switches back to manual entry mode', async () => {
    renderModal()

    await userEvent.click(screen.getByRole('button', { name: /Barcode/ }))
    await userEvent.click(screen.getByRole('button', { name: /Manual/ }))

    expect(screen.getByRole('button', { name: /Manual/ })).toHaveClass('active')
    expect(screen.getByText('POPULAR PRESETS')).toBeInTheDocument()
  })
})
