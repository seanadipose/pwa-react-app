import { put, fork, takeLatest } from 'redux-saga/effects'
import {
  constants as exampleConstants,
  actions as exampleActions,
} from '~/modules/example/redux'

import { exampleType } from '~/modules/example/types'

export function* fetchExampleData() {
  // pretend there is an api call
  const result: exampleType = {
    title: 'My Demo Shop',
    description: __CONFIG__.description,
    source: 'This message is coming from Redux Sagas',
  }

  yield put(exampleActions.updateExample(result))
}

function* watchGetExample() {
  yield takeLatest(exampleConstants.GET_EXAMPLE, fetchExampleData)
}

export const exampleSaga = [fork(watchGetExample)]
