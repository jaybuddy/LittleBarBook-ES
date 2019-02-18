const adaptUser = (apiResponse) => {
  delete apiResponse.password;
  return apiResponse;
};

export default adaptUser;
