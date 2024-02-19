import routes from "@/web/routes.js"

const destroyDisk =
  ({ api, jwt}) =>
  async ( nameVM ) => {
    try {
      const {data} = await api.post(routes.api.destroyDisk(), {
        nameVM,
        jwt 
      })      
      
      return [null, data]
    } catch (err) {
      const error = err.response?.data?.error || "Oops. Something went wrong"

      return [Array.isArray(error) ? error : [error]]
    }
  }

export default destroyDisk