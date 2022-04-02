import { applyMiddleware, createStore } from 'redux';

// import { logger } from 'redux-logger';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

import reducers from './reducers';

// const middleware = applyMiddleware(promise(), thunk);

export default createStore(
    reducers,
    applyMiddleware(thunk, logger)
  )