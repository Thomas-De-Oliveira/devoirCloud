import routes from "@/web/routes.js"

// nous recuperons le type de machine virtuel que l'utilisateur souhaite créer et nous envoyons la donnée à l'api
// une fois la machine créer ou l'erreur recuperer je renvois les données au front
const createVM =
  ({ api }) =>
  async ( nameImage ) => {
    try {
      const {data} = await api.post(routes.api.createVM(), {
        nameImage,
      })      
      
      return [null, data]
    } catch (err) {
      const error = err.response?.data?.error || "Oops. Something went wrong"

      return [Array.isArray(error) ? error : [error]]
    }
  }

export default createVM