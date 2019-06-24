import { Accessibility } from '../../types'

const sliderBehavior: Accessibility<SliderBehaviorProps> = props => ({
  attributes: {
    root: { 'aria-disabled': props.disabled },
  },
})

export default sliderBehavior

type SliderBehaviorProps = {
  disabled?: boolean
}
