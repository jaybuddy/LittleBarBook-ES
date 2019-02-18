module.exports = {
  formatApiResponse: (
    status = null,
    error = null,
    data = null,
  ) => ({ status, error, data }),
};
