import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { reducer as toastrReducer } from 'react-redux-toastr';
import user from './users';

export default combineReducers({
  user,
  form: formReducer,
  toastr: toastrReducer,
});
