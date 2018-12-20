import io from 'socket.io-client';

module.exports = (host) => {
  return io(host);
};
