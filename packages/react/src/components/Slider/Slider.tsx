import * as React from 'react'
import * as _ from 'lodash'
import * as PropTypes from 'prop-types'
import { handleRef, Ref } from '@stardust-ui/react-component-ref'
import * as customPropTypes from '@stardust-ui/react-proptypes'

import {
  applyAccessibilityKeyHandlers,
  AutoControlledComponent,
  createShorthandFactory,
  ChildrenComponentProps,
  commonPropTypes,
  isFromKeyboard,
  partitionHTMLProps,
  UIComponentProps,
} from '../../lib'
import { ComponentEventHandler, ShorthandValue, WithAsProp, withSafeTypeForAs } from '../../types'
import { Accessibility } from '../../lib/accessibility/types'
import { sliderBehavior } from '../../lib/accessibility'
import { SupportedIntrinsicInputProps } from '../../lib/htmlPropsUtils'
import Box from '../Box/Box'

export interface SliderSlotClassNames {
  input: string
}

export interface SliderProps
  extends UIComponentProps,
    ChildrenComponentProps,
    SupportedIntrinsicInputProps {
  /**
   * Accessibility behavior if overridden by the user.
   * @default sliderBehavior
   */
  accessibility?: Accessibility

  /** The default value of the slider. */
  defaultValue?: SupportedIntrinsicInputProps['defaultValue']

  /** A slider can take the width of its container. */
  fluid?: boolean

  /** Shorthand for the input component. */
  input?: ShorthandValue

  /** Ref for input DOM node. */
  inputRef?: React.Ref<HTMLElement>

  min?: SupportedIntrinsicInputProps['min']

  max?: SupportedIntrinsicInputProps['max']

  /**
   * Called after item checked state is changed.
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onChange?: ComponentEventHandler<SliderProps>

  step?: SupportedIntrinsicInputProps['step']

  /** The value of the slider. */
  value?: SupportedIntrinsicInputProps['value']
}

export interface SliderState {
  value: SupportedIntrinsicInputProps['value']
  isFromKeyboard: boolean
}

class Slider extends AutoControlledComponent<WithAsProp<SliderProps>, SliderState> {
  inputRef = React.createRef<HTMLElement>()

  static create: Function

  static displayName = 'Slider'

  static className = 'ui-slider'

  static slotClassNames: SliderSlotClassNames

  static propTypes = {
    ...commonPropTypes.createCommon({ content: false }),
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fluid: PropTypes.bool,
    input: customPropTypes.itemShorthand,
    inputRef: customPropTypes.ref,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static defaultProps = {
    accessibility: sliderBehavior,
    type: 'range',
  }

  static autoControlledProps = ['value']

  getInitialAutoControlledState(): SliderState {
    return { value: undefined, isFromKeyboard: false }
  }

  handleChange = (e: React.ChangeEvent) => {
    const value = _.get(e, 'target.value')
    _.invoke(this.props, 'onChange', e, { ...this.props, value })
    this.trySetState({ value })
  }

  handleFocus = (e: React.FocusEvent) => {
    this.setState({ isFromKeyboard: isFromKeyboard() })
    _.invoke(this.props, 'onFocus', e, this.props)
  }

  renderComponent({ ElementType, classes, unhandledProps, styles, accessibility }) {
    const { input, inputRef, type } = this.props
    const { value = '' } = this.state
    const [htmlInputProps, restProps] = partitionHTMLProps(unhandledProps)

    return (
      <ElementType
        className={classes.root} // className: cx(Input.className, className),
        // styles: styles.root,
        {...accessibility.attributes.root}
        {...restProps}
        {...applyAccessibilityKeyHandlers(accessibility.keyHandlers.root, unhandledProps)}
      >
        <Ref
          innerRef={(inputElement: HTMLElement) => {
            handleRef(this.inputRef, inputElement)
            handleRef(inputRef, inputElement)
          }}
        >
          {Box.create(input || type, {
            defaultProps: {
              ...htmlInputProps,
              className: Slider.slotClassNames.input,
              as: 'input',
              type,
              value,
              onChange: this.handleChange,
              onFocus: this.handleFocus,
              styles: styles.input,
              ...applyAccessibilityKeyHandlers(accessibility.keyHandlers.input, htmlInputProps),
            },
          })}
        </Ref>
      </ElementType>
    )
  }
}

Slider.create = createShorthandFactory({ Component: Slider })
Slider.slotClassNames = {
  input: `${Slider.className}__input`,
}

/**
 * A slider is an input that allows the user to choose a value from within a specific range of values.
 * Sliders typically have a slider thumb that can be moved along a bar or track to change the value of the slider.
 * @accessibility
 * Implements [ARIA Slider](https://www.w3.org/TR/wai-aria-practices-1.1/#slider) design pattern.
 */
export default withSafeTypeForAs<typeof Slider, SliderProps, 'input'>(Slider)
