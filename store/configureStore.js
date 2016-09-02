/*-------------------
   Imports
--------------------*/
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers/index'

/*------------------------
   Create Thunk Middleware
-------------------------*/
const createStoreWithMiddleware = 
applyMiddleware(
  thunkMiddleware,
  createLogger()
)(createStore);

/*---------------------------------------
   Create Store with Thunk Middleware
----------------------------------------*/
const configureStore = () => {
  return createStoreWithMiddleware(rootReducer);
}

export default configureStore;