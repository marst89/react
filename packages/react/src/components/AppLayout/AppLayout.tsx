import * as _ from 'lodash'
import * as PropTypes from 'prop-types'
import * as React from 'react'
// import { findDOMNode } from 'react-dom'

import {
  commonPropTypes,
  ContentComponentProps,
  isBrowser,
  UIComponent,
  UIComponentProps,
} from '../../lib'
import { RenderResultConfig } from '../../lib/renderComponent'
import { Accessibility } from '../../lib/accessibility/types'
import { ShorthandValue, WithAsProp } from '../../types'
import AppLayoutArea, { AppLayoutAreaProps } from './AppLayoutArea'

if (isBrowser()) {
  ;(window as any).React1 = require('react')
}

export interface AppSlotClassNames {
  content: string
}

export interface AppLayoutProps extends UIComponentProps, ContentComponentProps<ShorthandValue> {
  /**
   * Accessibility behavior if overridden by the user.
   * @default AppBehavior
   * @available AppWarningBehavior
   */
  accessibility?: Accessibility

  debug?: boolean
  gap?: string
  mode?: string
  renderActiveOnly?: boolean
  slots?: {
    [key: string]: AppLayoutAreaProps
    header?: AppLayoutAreaProps
    nav?: AppLayoutAreaProps
    full?: AppLayoutAreaProps
    tile?: AppLayoutAreaProps
    start?: AppLayoutAreaProps
    content?: AppLayoutAreaProps
    end?: AppLayoutAreaProps
  }
  template?: string
}

/**
 * A app layout contains and arranges the high level areas of an application.
 */
class AppLayout extends UIComponent<WithAsProp<AppLayoutProps>> {
  static displayName = 'AppLayout'
  static className = 'ui-app-layout'

  static defaultProps = {
    renderActiveOnly: true,
  }

  static slotClassNames: AppSlotClassNames = {
    content: `${AppLayout.className}__content`,
  }

  static propTypes = {
    ...commonPropTypes.createCommon({ content: 'shorthand' }),
    debug: PropTypes.bool,
    gap: PropTypes.string,
    renderActiveOnly: PropTypes.bool,
    slots: PropTypes.objectOf(
      PropTypes.shape({
        styles: PropTypes.object,
        content: PropTypes.node,
      }),
    ),
    template: PropTypes.string,
  }

  // nodeMap = new WeakMap<HTMLElement, ClientRect>([])
  //
  // componentWillUpdate(nextProps, nextState) {
  //   const node = findDOMNode(this)
  //   if (!node) return
  //
  //   node.childNodes.forEach((node: HTMLElement) => {
  //     this.nodeMap.set(node, node.getBoundingClientRect())
  //   })
  // }
  //
  // componentDidUpdate(
  //   prevProps: Readonly<ReactProps<AppLayoutProps>>,
  //   prevState: Readonly<{}>,
  //   snapshot?: any,
  // ): void {
  //   const node = findDOMNode(this)
  //   if (!node) return
  //
  //   node.childNodes.forEach((child: HTMLElement) => {
  //     const prevRect = this.nodeMap.get(child)
  //     this.nodeMap.delete(child)
  //
  //     const currRect = child.getBoundingClientRect()
  //
  //     if (!prevRect) {
  //       onEnter(child, currRect)
  //     } else if (!didMove(currRect, prevRect)) {
  //       return
  //     } else {
  //       onMove(child, currRect, prevRect)
  //     }
  //
  //     play(child)
  //   })
  //
  //   // removed nodes
  //   this.nodeMap.forEach((rect, child) => {
  //     onLeave(node, child, rect)
  //     this.nodeMap.delete(child)
  //   })
  // }

  getSlotOrder = () => {
    return this.props.template
      .split('\n')
      .filter(s => s.includes('"') && s.trim())
      .map(s => s.match(/"(.*)"/)[1])
      .join(' ')
      .split(/ +/)
      .reduce((acc: string[], next: string) => {
        if (acc.indexOf(next) === -1) acc.push(next)
        return acc
      }, [])
  }

  getUnusedSlots = () => {
    const { slots, template } = this.props

    return Object.keys(slots).filter(name => {
      return new RegExp(`/\W${_.escapeRegExp(name)}\W/`).test(template)
    })
  }

  renderComponent(config: RenderResultConfig<AppLayoutProps>) {
    const { classes, ElementType, unhandledProps } = config
    const { slots, debug } = this.props

    return (
      <ElementType className={classes.root} {...unhandledProps}>
        {this.getSlotOrder().map(k => {
          // console.log('SLOT ORDER', k)
          const v = slots[k]

          return (
            <AppLayoutArea
              debug={debug}
              key={k}
              area={k}
              className={`${AppLayoutArea.className}-${k}`}
              {...v}
            />
          )
        })}
        {/*{!renderActiveOnly && this.getUnusedSlots.map()}*/}
      </ElementType>
    )
  }
}

export default AppLayout
