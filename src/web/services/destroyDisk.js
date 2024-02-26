import routes from "@/web/routes.js"

// nous recuperons le nom de la machine et nous envoyons la donnée à l'api
// une fois le disk supprimer ou l'erreur recuperer je renvois les données au front
const destroyDisk =
  ({ api }) =>
  async ( nameVM ) => {
    try {
      const {data} = await api.post(routes.api.destroyDisk(), {
        nameVM,
      })      
      
      return [null, data]
    } catch (err) {
      const error = err.response?.data?.error || "Oops. Something went wrong"

      return [Array.isArray(error) ? error : [error]]
    }
  }

export default destroyDisk