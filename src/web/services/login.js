import config from "@/web/config.js"
import routes from "@/web/routes.js"

const signIn =
  ({ api, setSession }) =>
  async ({ username, password }) => {
    try {
      const {data} = await api.post(routes.api.signIn(), {
        username,
        password, 
      })
      let error = null
      
      if(data.verify == true) {
        setSession(data)
        localStorage.setItem(config.session.localStorageKey, data.user.id)
        localStorage.setItem(config.session.localStorageCredit, data.user.credits)
      } else {
        error.err = "Vous n'avez pas de compte"
      }

      return [error, data]
    } catch (err) {
      const error = err.response?.data?.error || "Oops. Something went wrong"

      return [Array.isArray(error) ? error : [error]]
    }
  }

export default signIn