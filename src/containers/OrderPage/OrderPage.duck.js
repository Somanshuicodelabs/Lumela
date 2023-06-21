import { fetchCurrentUser } from "../../ducks/user.duck";

// ================ Action types ================ //

export const SET_INITIAL_STATE = 'app/OrderPage/SET_INITIAL_STATE';

// ================ Reducer ================ //

const initialState = {
  userId: null,
  userListingRefs: [],
  userShowError: null,
  queryListingsError: null,
  reviews: [],
  queryReviewsError: null,
};

export default function profilePageReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SET_INITIAL_STATE:
      return { ...initialState };
    default:
      return state;
  }
}

export const loadData = params => (dispatch, getState, sdk) => {
      return Promise.all([
      dispatch(fetchCurrentUser()),
    ]);
  };
  