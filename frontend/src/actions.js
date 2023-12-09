export const setUser = (displayName, email, userRole) => ({
  type: "SET_USER",
  payload: { displayName: displayName, email: email, userRole: userRole },
});

export const unsetUser = () => ({
  type: "UNSET_USER",
});
