import io from 'socket.io-client';

const setupSocket = () => {
  const socket = io('//localhost:1080');
  socket.on('connect', () => {
    console.log('Connected');
    socket.emit('events', { test: 'test' });
    socket.emit('identity', 0, (response: any) =>
      console.log('Identity:', response),
    );
  });
  socket.on('events', (data: any) => {
    console.log('event', data);
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
