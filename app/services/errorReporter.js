module.exports = (host, accessToken, error) => {
  let endpoint = `${host}/api/mobile/errors`;
  const payload = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': accessToken
    },
    body: JSON.stringify({
      time: new Date(),
      error: error
    })
  };
  fetch(endpoint, payload)
  .then(res => {
    return;
  })
  .catch(error => {
    return;
  })
};
