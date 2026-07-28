import { Component } from 'react'
import LoggerService from '../../services/LoggerService'
import FallbackUI from './FallbackUI'

/**
 * ERROR BOUNDARY
 * ==============
 * Sprint 0 — Foundation.
 *
 * Reusable top-level error boundary. React error boundaries must be class
 * components — there is no Hook equivalent. Catches render errors in the
 * component tree beneath it, logs them via `LoggerService`, and shows
 * `FallbackUI` instead of a blank/broken screen.
 *
 * Usage (wired into App.jsx for this sprint):
 *   <ErrorBoundary><RouterProvider router={router} /></ErrorBoundary>
 *
 * Can also be wrapped around any smaller subtree in a future sprint if a
 * single feature module needs to fail in isolation without taking down
 * the rest of the app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    LoggerService.captureException(error, { componentStack: errorInfo?.componentStack })
  }

  handleReset() {
    this.setState({ hasError: false })
    if (typeof window !== 'undefined') {
      window.location.assign('/')
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <FallbackUI onReset={this.handleReset} />
    }
    return this.props.children
  }
}
