import io from 'socket.io-client';

const setupSocket = () => {
  const socket = io();
  socket.on('connect', () => {
    socket.emit('CONNECT_USER', { test: 'yu' });
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
