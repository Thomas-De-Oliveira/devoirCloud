const routes = {
    home: () => "/",
    machine: (id) => `${id}/machines`,
    api: {
      signIn: () => "/login",
    },
  }
  
  export default routes