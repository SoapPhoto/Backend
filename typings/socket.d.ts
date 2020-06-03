declare namespace SocketIO {
  interface Handshake {
    user: import('@server/modules/user/user.entity').UserEntity | null;
  }
}
