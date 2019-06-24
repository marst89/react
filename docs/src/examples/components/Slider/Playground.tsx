import * as React from 'react'
import { useBooleanKnob, useStringKnob } from '@stardust-ui/docs-components'
import { Slider } from '@stardust-ui/react'

const SliderPlayground: React.FunctionComponent = () => {
  const [min] = useStringKnob({ name: 'min' })
  const [max] = useStringKnob({ name: 'max' })
  const [step] = useStringKnob({ name: 'step' })
  const [value, setValue] = useStringKnob({ name: 'value' })
  const [disabled] = useBooleanKnob({ name: 'disabled' })

  return (
    <Slider
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e, data) => setValue(String(data.value))}
    />
  )
}

export default SliderPlayground
