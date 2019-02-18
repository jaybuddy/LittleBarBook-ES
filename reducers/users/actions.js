import fetch from 'isomorphic-fetch';

require('es6-promise').polyfill();

export const FETCH_USER_BEGIN = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const fetchUserBegin = () => ({
  type: FETCH_USER_BEGIN,
});

export const fetchUserSuccess = user => ({
  type: FETCH_USER_SUCCESS,
  payload: { user },
});

export const fetchUserFailure = error => ({
  type: FETCH_USER_FAILURE,
  payload: { error },
});

export function fetchUser() {
  return (dispatch) => {
    dispatch(fetchUserBegin());
    fetch('/api/v1/user',
      {
        credentials: 'same-origin',
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        switch (data.status) {
          case '500':
            dispatch(fetchUserFailure(data.error));
            break;
          default:
            dispatch(fetchUserSuccess(data));
        }
      })
      .catch((err) => {
        dispatch(fetchUserFailure(err));
      });
  };
}
