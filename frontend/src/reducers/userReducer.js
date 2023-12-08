const initialState = {
  userRole: null,
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_USER_ROLE":
      return {
        ...state,
        userRole: payload.userRole,
      };
    default:
      return state;
  }
};

export default userReducer;
