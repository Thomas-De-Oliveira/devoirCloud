import config from "@/web/config.js"
import routes from "@/web/routes.js"

const signIn =
  ({ api, setSession, users }) =>
  async ({ username, password }) => {
    try {
      const data = await api.post(routes.api.signIn(), {
        username,
        password,
        users
      })

      setSession()
      localStorage.setItem(config.session.localStorageKey)

      return [null, true]
    } catch (err) {
      const error = err.response?.data?.error || "Oops. Something went wrong"

      return [Array.isArray(error) ? error : [error]]
    }
  }

export default signIn