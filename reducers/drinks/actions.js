import fetch from 'isomorphic-fetch';

require('es6-promise').polyfill();

export const FETCH_DRINKS_BEGIN = 'FETCH_DRINKS_BEGIN';
export const FETCH_DRINKS_SUCCESS = 'FETCH_DRINKS_SUCCESS';
export const FETCH_DRINKS_FAILURE = 'FETCH_DRINKS_FAILURE';

export const fetchDrinksBegin = () => ({
  type: FETCH_DRINKS_BEGIN,
});

export const fetchDrinksSuccess = drinks => ({
  type: FETCH_DRINKS_SUCCESS,
  payload: { drinks },
});

export const fetchDrinksFailure = error => ({
  type: FETCH_DRINKS_FAILURE,
  payload: { error },
});

export function fetchDrinks() {
  return (dispatch) => {
    dispatch(fetchDrinksBegin());
    fetch('/api/v1/event',
      {
        credentials: 'same-origin',
      })
      .then(res => res.json())
      .then((data) => {
        switch (data.status) {
          case '500':
            dispatch(fetchDrinksFailure(data.error));
            break;
          default:
            dispatch(fetchDrinksSuccess(data));
        }
      })
      .catch((err) => {
        dispatch(fetchDrinksFailure(err));
      });
  };
}
