const routes = {
    home: () => "/",
    machine: (id) => `${id}/machines`,
    api: {
      signIn: () => "/login",
      createVM: () =>"/createVM",
      destroyVM: () =>"/destroyVM",
      destroyDisk: () =>"/destroyDisk"
    },
  }
  
  export default routes