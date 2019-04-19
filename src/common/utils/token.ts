
export function getTokenExpiresAt(lifetime: number) {
  const expires = new Date();
  expires.setSeconds(expires.getSeconds() + lifetime);

  return expires;
}
