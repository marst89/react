import * as customPropTypes from '@stardust-ui/react-proptypes'
import * as _ from 'lodash'
import * as React from 'react'
import * as PropTypes from 'prop-types'

import {
  applyAccessibilityKeyHandlers,
  AutoControlledComponent,
  createShorthandFactory,
  ChildrenComponentProps,
  commonPropTypes,
  isFromKeyboard,
  UIComponentProps,
} from '../../lib'
import { ComponentEventHandler, WithAsProp, ShorthandValue, withSafeTypeForAs } from '../../types'
import Icon from '../Icon/Icon'
import Text from '../Text/Text'
import { Accessibility } from '../../lib/accessibility/types'
import { checkboxBehavior } from '../../lib/accessibility'

export interface CheckboxProps extends UIComponentProps, ChildrenComponentProps {
  /**
   * Accessibility behavior if overridden by the user.
   * @default checkboxBehavior
   */
  accessibility?: Accessibility

  /** Initial checked value. */
  defaultChecked?: boolean

  /** Whether or not item is checked. */
  checked?: boolean

  /** An item can appear disabled and be unable to change states. */
  disabled?: boolean

  /** The item indicator can be user-defined icon. */
  icon?: ShorthandValue

  /** The label of the item. */
  label?: ShorthandValue

  /**
   * Called after item checked state is changed.
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onChange?: ComponentEventHandler<CheckboxProps>

  /**
   * Called after click.
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: ComponentEventHandler<CheckboxProps>

  /** A checkbox can be formatted to show an on or off choice. */
  toggle?: boolean
}

export interface CheckboxState {
  checked: boolean
  isFromKeyboard: boolean
}

class Checkbox extends AutoControlledComponent<WithAsProp<CheckboxProps>, CheckboxState> {
  static create: Function

  static displayName = 'Checkbox'

  static className = 'ui-checkbox'

  static propTypes = {
    ...commonPropTypes.createCommon({
      content: false,
    }),
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
    icon: customPropTypes.primitiveShorthand,
    label: customPropTypes.itemShorthand,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    toggle: PropTypes.bool,
  }

  static defaultProps = {
    accessibility: checkboxBehavior,
    icon: {},
  }

  static autoControlledProps = ['checked']

  actionHandlers = {
    performClick: (e: any /* TODO: use React.KeyboardEvent */) => {
      e.preventDefault()
      this.handleClick(e)
    },
  }

  getInitialAutoControlledState(): CheckboxState {
    return { checked: false, isFromKeyboard: false }
  }

  handleChange = (e: React.ChangeEvent) => {
    // Checkbox component doesn't present any `input` component in markup, however all of our
    // components should handle events transparently.
    const { disabled } = this.props
    const checked = !this.state.checked

    if (!disabled) {
      this.trySetState({ checked })
      _.invoke(this.props, 'onChange', e, { ...this.props, checked })
    }
  }

  handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    const { disabled } = this.props
    const checked = !this.state.checked

    if (!disabled) {
      this.trySetState({ checked })

      _.invoke(this.props, 'onClick', e, { ...this.props, checked })
      _.invoke(this.props, 'onChange', e, { ...this.props, checked })
    }
  }

  handleFocus = (e: React.FocusEvent) => {
    this.setState({ isFromKeyboard: isFromKeyboard() })

    _.invoke(this.props, 'onFocus', e, this.props)
  }

  renderComponent({ ElementType, classes, unhandledProps, styles, accessibility }) {
    const { label, icon, toggle } = this.props

    return (
      <ElementType
        className={classes.root}
        onClick={this.handleClick}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        {...accessibility.attributes.root}
        {...unhandledProps}
        {...applyAccessibilityKeyHandlers(accessibility.keyHandlers.root, unhandledProps)}
      >
        {Icon.create(icon, {
          defaultProps: {
            name: toggle ? 'stardust-circle' : 'stardust-checkmark',
            styles: toggle ? styles.toggle : styles.checkbox,
          },
        })}
        {Text.create(label)}
      </ElementType>
    )
  }
}

Checkbox.create = createShorthandFactory({
  Component: Checkbox,
  mappedProp: 'label',
})

/**
 * A single checkbox within a checkbox group.
 * @accessibility
 * Implements [ARIA Checkbox](https://www.w3.org/TR/wai-aria-practices-1.1/#checkbox) design pattern.
 */
export default withSafeTypeForAs<typeof Checkbox, CheckboxProps>(Checkbox)
