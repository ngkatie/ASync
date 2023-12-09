const initialState = {
  displayName: null,
  email: null,
  userRole: null,
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_USER":
      return {
        ...state,
        displayName: payload.displayName,
        email: payload.email,
        userRole: payload.userRole,
      };
    case "UNSET_USER":
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
