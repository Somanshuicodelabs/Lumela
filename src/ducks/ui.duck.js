// ================ Action types ================ //

export const DISABLE_SCROLLING = 'app/UI/DISABLE_SCROLLING';
export const TOGGLE_DRAWER = 'app/UI/TOGGLE_DRAWER';

// ================ Reducer ================ //

const initialState = {
  authStep: null,
  redirectRoute: null,
  isDrawerOpen: false,
  disableScrollRequests: [],
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case TOGGLE_DRAWER: {
      return {
        ...state,
        authStep: payload.authStep,
        redirectRoute: payload.redirectRoute,
        isDrawerOpen: !payload.isDrawerOpen,
      };
    }
    case DISABLE_SCROLLING: {
      const { componentId, disableScrolling } = payload;
      const disableScrollRequests = state.disableScrollRequests;
      const componentIdExists = disableScrollRequests.find(c => c.componentId === componentId);

      if (componentIdExists) {
        const disableScrollRequestArray = disableScrollRequests.map(c => {
          return c.componentId === componentId ? { ...c, disableScrolling } : c;
        });
        return { ...state, disableScrollRequests: [...disableScrollRequestArray] };
      }

      const disableScrollRequestArray = [
        ...disableScrollRequests,
        { componentId, disableScrolling },
      ];
      return {
        ...state,
        disableScrollRequests: disableScrollRequestArray,
      };
    }

    default:
      return state;
  }
}

// ================ Action creators ================ //

export const manageDisableScrolling = (componentId, disableScrolling) => ({
  type: DISABLE_SCROLLING,
  payload: { componentId, disableScrolling },
});

export const manageToggleDrawer = (isDrawerOpen, authStep = 'LOGIN', redirectRoute = {}) =>({
  type: TOGGLE_DRAWER,
  payload: { isDrawerOpen, authStep, redirectRoute },
});



// ================ Selectors ================ //

export const isScrollingDisabled = state => {
  const { disableScrollRequests } = state.ui;
  return disableScrollRequests.some(r => r.disableScrolling);
};
