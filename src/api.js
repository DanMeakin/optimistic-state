const api = async (command, payload) => {
  // Mock API functionality.
  if (payload.mockFail) {
    throw { error: `API call failed: ${command}` };
  }
};

module.exports = api;
