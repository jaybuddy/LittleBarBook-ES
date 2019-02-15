module.exports = {
  formatApiResponse: (
    status = null,
    error = null,
    data = null,
  ) => {
    return { status, error, data };
  }
};