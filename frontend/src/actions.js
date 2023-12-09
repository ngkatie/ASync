export const setUser = (displayName, email, role) => ({
  type: "SET_USER",
  payload: { displayName: displayName, email: email, role: role },
});

export const unsetUser = () => ({
  type: "UNSET_USER",
});
