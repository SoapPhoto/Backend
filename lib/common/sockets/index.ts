import io from 'socket.io-client';

const setupSocket = () => {
  const socket = io(process.env.URL, {
    transportOptions: {
      polling: {
        extraHeaders: {
          test123123: 'abc',
        },
      },
    },
  });
  socket.on('connect', () => {
    socket.emit('CONNECT_USER', { username: 'yu' });
  });
  socket.on('events', (data: any) => {
    console.log('event', data);
  });
  socket.on('message', (data: any) => {
    console.log('message', data);
  });
  socket.on('exception', (data: any) => {
    console.log('event', data);
  });
  socket.on('disconnect', () => {
    console.log('Disconnected');
  });
  return socket;
};

export default setupSocket;
