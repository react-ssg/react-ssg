export const exitHandler = (clean) => {

  const ex = (options) => async () => {
    if (options.exit) {
      await clean();
      process.exit();
    }
  }

  //do something when app is closing
  process.on('exit', ex({ cleanup: true }));

  //catches ctrl+c event
  process.on('SIGINT', ex({ exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', ex({ exit: true }));
  process.on('SIGUSR2', ex({ exit: true }));

  //catches uncaught exceptions
  process.on('uncaughtException', ex({ exit: true }));
};
