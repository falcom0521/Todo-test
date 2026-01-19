import { all, fork } from 'redux-saga/effects';
import taskSaga from './taskSaga';

export default function* rootSaga() {
  yield all([
    fork(taskSaga),
  ]);
}
