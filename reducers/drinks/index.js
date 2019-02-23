import {
  FETCH_DRINKS_BEGIN,
  FETCH_DRINKS_SUCCESS,
  FETCH_DRINKS_FAILURE,
} from './actions';
import adaptDrinks from '../../adapters/drinks';

const initialState = {
  data: {},
  loading: false,
  error: null,
};

export default function drinksReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DRINKS_BEGIN:
      // Mark the state as "loading" so we can show a spinner or something
      // Also, reset any errors. We're starting fresh.
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_DRINKS_SUCCESS:
      // All done: set loading "false".
      // Also, replace the items with the ones from the server
      return {
        ...state,
        loading: false,
        data: adaptDrinks(action.payload.user),
      };

    case FETCH_DRINKS_FAILURE:
      // The request failed. It's done. So set loading to "false".
      // Save the error, so we can display it somewhere.
      // Since it failed, we don't have items to display anymore, so set `items` empty.
      //
      // This is all up to you and your app though:
      // maybe you want to keep the items around!
      // Do whatever seems right for your use case.
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: {},
      };

    default:
      // ALWAYS have a default case in a reducer
      return state;
  }
}
