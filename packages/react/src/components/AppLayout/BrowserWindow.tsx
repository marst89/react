import * as React from 'react'
import { ICSSInJSStyle } from '@stardust-ui/react'

const SCALE = 4
const HEADER_HEIGHT = SCALE * 10
const HEADER_BUTTON_SIZE = SCALE * 3

const NAVBAR_HEIGHT = SCALE * 9
const NAVBAR_BUTTON_SIZE = SCALE * 6
const PADDING = SCALE * 4

const buttonStyle = (color): ICSSInJSStyle => ({
  display: 'inline-block',
  width: `${HEADER_BUTTON_SIZE}px`,
  height: `${HEADER_BUTTON_SIZE}px`,
  lineHeight: `${HEADER_BUTTON_SIZE}px`,
  marginRight: `${HEADER_BUTTON_SIZE / 1.5}px`,
  background: color,
  borderRadius: '999px',
  boxShadow: `inset 0 0 1px rgba(0, 0, 0, 0.2)`,
})

const styles: { [key: string]: ICSSInJSStyle } = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '1rem 4rem',
    height: 'calc(100vw / 1.75)',
    overflow: 'hidden',
    background: '#999',
    borderRadius: '4px',
    boxShadow: '0 0.5em 2em rgba(0, 0, 0, 0.25)',
  },
  header: {
    display: 'flex',
    flex: '0 0 auto',
    alignItems: 'center',
    height: `${HEADER_HEIGHT}px`,
    lineHeight: `${HEADER_HEIGHT}px`,
    padding: `0 ${PADDING}px`,
    background: 'rgb(230, 232, 234)',
  },
  close: buttonStyle('rgb(237,84,74)'),
  minimize: buttonStyle('#f5b638'),
  maximize: buttonStyle('#4ec441'),

  navbar: {
    display: 'flex',
    flex: '0 0 auto',
    alignItems: 'center',
    padding: `4px ${PADDING}px`,
    height: `${NAVBAR_HEIGHT}px`,
    lineHeight: `${NAVBAR_HEIGHT}px`,
    background: '#ffffff',
    borderBottom: '1px solid #ddd',
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    background: 'rgba(0, 16, 32, 0.05)',
    borderRadius: '999px',
  },
  navButton: {
    flex: '0 0 auto',
    marginRight: `${NAVBAR_BUTTON_SIZE / 3}px`,
    width: `${NAVBAR_BUTTON_SIZE}px`,
    lineHeight: 1,
    fontSize: `${NAVBAR_HEIGHT / 2}px`,
    color: 'rgba(0, 0, 0, 0.2)',
  },

  content: {
    flex: 1,
    overflow: 'hidden',
  },
}

const BrowserWindow = props => (
  <div style={styles.root}>
    <div style={styles.header}>
      <div style={styles.close} />
      <div style={styles.minimize} />
      <div style={styles.maximize} />
    </div>
    <div style={styles.navbar}>
      <div style={styles.navButton}>❮</div>
      <div style={styles.navButton}>❯</div>
      <div style={styles.navButton}>↻</div>
      <div style={styles.input} />
    </div>
    <div style={styles.content}>{props.children}</div>
  </div>
)

export default BrowserWindow
