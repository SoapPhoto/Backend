
let openWindow: Window | null = null;

export const oauthOpen = (url: string) => {
  const windowArea = {
    width: Math.floor(window.outerWidth * 0.6),
    height: Math.floor(window.outerHeight * 0.5),
    left: 0,
    top: 0,
  };

  if (windowArea.width < 1000) {
    windowArea.width = 600;
  }
  if (windowArea.height < 630) {
    windowArea.height = 550;
  }
  windowArea.left = Math.floor(
    window.screenX + (window.outerWidth - windowArea.width) / 2,
  );
  windowArea.top = Math.floor(
    window.screenY + (window.outerHeight - windowArea.height) / 3,
  );

  if (openWindow) openWindow.close();

  const closeWindow = () => {
    if (openWindow) openWindow.close();
    openWindow = null;
  };

  const sep = url.indexOf('?') !== -1 ? '&' : '?';
  const _url = `${url}${sep}`;
  const windowOpts = `toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,
    width=${windowArea.width},height=${windowArea.height},
    left=${windowArea.left},top=${windowArea.top}`;

  openWindow = window.open(_url, 'OauthNewWindow', windowOpts);
  const scanTimer = setInterval(() => {
    if (
      openWindow
      && openWindow.location.origin === window.location.origin
      && /^\/oauth/.test(openWindow.location.pathname)
    ) {
      clearInterval(scanTimer);
    }
    window.postMessage(
      { fromOauthWindow: openWindow!.location.search },
      window.location.href,
    );
  }, 1000);
  window.addEventListener('message', (msg) => {
    if (
      /* eslint-disable */
      !~msg.origin.indexOf(
        `${window.location.protocol}//${window.location.host}`
      )
      /* eslint-enable */
    ) {
      clearInterval(scanTimer);
      closeWindow();
    }
    if (msg.data.fromParent) {
      clearInterval(scanTimer);
      closeWindow();
    }
  });
};
