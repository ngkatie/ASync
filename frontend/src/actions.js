export const setUser = (
  userId,
  name,
  email,
  companyName,
  role,
  state,
  city,
  industry
) => ({
  type: "SET_USER",
  payload: {
    userId: userId,
    name: name,
    email: email,
    companyName: companyName,
    role: role,
    state: state,
    city: city,
    industry: industry,
  },
});

export const unsetUser = () => ({
  type: "UNSET_USER",
});
