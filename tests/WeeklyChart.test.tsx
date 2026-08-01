import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import WeeklyChart from '@/app/components/WeeklyChart'

const data = [
  { label: 'Mon', value: 1800, max: 2100 },
  { label: 'Tue', value: 2100, max: 2100 },
  { label: 'Wed', value: 0, max: 2100 },
]

/** Bars animate in after a short timeout; wait until the value labels appear. */
async function renderMounted(props: Parameters<typeof WeeklyChart>[0]) {
  const view = render(<WeeklyChart {...props} />)
  await waitFor(() => expect(document.querySelector('.chart-value')).not.toBeNull())
  return view
}

describe('WeeklyChart', () => {
  it('renders a titled, accessible bar per data point', async () => {
    await renderMounted({ data, title: 'Calories this week' })

    expect(screen.getByText('Calories this week')).toBeInTheDocument()
    expect(screen.getAllByRole('graphics-symbol')).toHaveLength(3)
    expect(screen.getByLabelText('Mon: 1800 kcal (target: 2100 kcal)')).toBeInTheDocument()
    expect(screen.getByText('Tue')).toBeInTheDocument()
  })

  it('scales bar heights against the largest target', async () => {
    await renderMounted({ data, title: 'Calories', height: 180 })

    const fills = document.querySelectorAll('.chart-bar-fill')
    // chartHeight = height - 40 = 140; 1800/2100 * 140 = 120
    expect(fills[0].getAttribute('height')).toBe('120')
    expect(fills[1].getAttribute('height')).toBe('140')
    expect(fills[2].getAttribute('height')).toBe('0')
  })

  it('starts bars collapsed before the mount animation runs', () => {
    render(<WeeklyChart data={data} title="Calories" />)

    const fills = document.querySelectorAll('.chart-bar-fill')
    expect(fills[0].getAttribute('height')).toBe('0')
    expect(document.querySelector('.chart-value')).toBeNull()
  })

  it('avoids dividing by zero when every target is zero', async () => {
    await renderMounted({ data: [{ label: 'Mon', value: 0, max: 0 }], title: 'Empty' })

    expect(document.querySelector('.chart-bar-fill')?.getAttribute('height')).toBe('0')
  })

  it('shows a tooltip on hover and removes it on leave', async () => {
    await renderMounted({ data, title: 'Calories' })
    const bar = screen.getByLabelText('Tue: 2100 kcal (target: 2100 kcal)')

    fireEvent.mouseEnter(bar)
    expect(document.querySelector('.chart-tooltip')).not.toBeNull()

    fireEvent.mouseLeave(bar)
    expect(document.querySelector('.chart-tooltip')).toBeNull()
  })

  it('shows a tooltip on keyboard focus for non-mouse users', async () => {
    await renderMounted({ data, title: 'Calories' })
    const bar = screen.getByLabelText('Mon: 1800 kcal (target: 2100 kcal)')

    fireEvent.focus(bar)
    expect(document.querySelector('.chart-tooltip')).not.toBeNull()

    fireEvent.blur(bar)
    expect(document.querySelector('.chart-tooltip')).toBeNull()
  })

  it('applies the custom bar colour', async () => {
    await renderMounted({ data, title: 'Calories', color: '#123456' })

    expect(document.querySelector('.chart-bar-fill')?.getAttribute('fill')).toBe('#123456')
  })
})
