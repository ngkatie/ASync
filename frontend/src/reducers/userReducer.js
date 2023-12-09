const initialState = {
  userId: null,
  name: null,
  email: null,
  companyName: null,
  role: null,
  state: null,
  city: null,
  industry: null,
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_USER":
      return {
        ...state,
        userId: payload.userId,
        name: payload.name,
        email: payload.email,
        companyName: payload.companyName,
        role: payload.role,
        state: payload.state,
        city: payload.city,
        industry: payload.industry,
      };
    case "UNSET_USER":
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
