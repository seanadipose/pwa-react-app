import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
// You could use BrowserRoute or HashRoute
// But passing in history directly to Route will
// give your app more flexibility on deeper integration of `history`
import { Router } from 'react-router-dom'

import { FluxCart } from 'quickcommerce-ui-cart'

import I18NProvider from '~/modules/utilities/I18NProvider'

class App extends Component {
  get content() {
    const { routes, history } = this.props

    return <Router history={history}>{routes}</Router>
  }

  render() {
    const { store } = this.props

    return (
      <I18NProvider>
        <Provider store={store}>{this.content}</Provider>
      </I18NProvider>
    )
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  routes: PropTypes.element.isRequired,
  store: PropTypes.object.isRequired,
}

export default FluxCart.Context(App)
