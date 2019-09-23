import io from 'socket.io-client';

const setupSocket = () => {
  const socket = io(process.env.URL);
  socket.on('connect', () => {
    socket.emit('CONNECT_USER', { username: 'yu' });
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
  socket.on('CONNECT_USER', (data: any) => console.log(data));
  return socket;
};

export default setupSocket;
