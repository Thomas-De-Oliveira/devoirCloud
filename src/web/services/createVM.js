import routes from "@/web/routes.js"

const createVM =
  ({ api, jwt}) =>
  async ( nameImage ) => {
    try {
      const {data} = await api.post(routes.api.createVM(), {
        nameImage,
        jwt 
      })      
      
      return [null, data]
    } catch (err) {
      const error = err.response?.data?.error || "Oops. Something went wrong"

      return [Array.isArray(error) ? error : [error]]
    }
  }

export default createVM