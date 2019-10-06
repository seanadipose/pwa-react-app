import Loadable from 'react-loadable'

import Loading from './Loading'

export const create = (loader) => Loadable({
  loader,
  loading: Loading,
})

console.warn('DEV NOTE: Is there a package upgrade for react-loadable that uses updated React lifecycle methods?')

export default create
