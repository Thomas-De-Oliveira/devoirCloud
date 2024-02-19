const routes = {
    home: () => "/",
    machine: (id) => `${id}/machines`,
    api: {
      signIn: () => "/login",
      createVM: () =>"/createVM"
    },
  }
  
  export default routes