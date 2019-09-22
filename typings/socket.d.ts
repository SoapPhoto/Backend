declare namespace SocketIO {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Handshake {
    user: import('@server/modules/user/user.entity').UserEntity | null;
  }
}
