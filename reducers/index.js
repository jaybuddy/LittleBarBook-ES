import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { reducer as toastrReducer } from 'react-redux-toastr';
import drinks from './drinks';
import user from './users';

export default combineReducers({
  user,
  drinks,
  form: formReducer,
  toastr: toastrReducer,
});
