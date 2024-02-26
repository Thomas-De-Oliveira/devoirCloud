import validate from "@/api/middlewares/validate.js"
import mw from "@/api/middlewares/mw.js"
import utilisateurs from "../../../users.json"
import { stringValidator } from "@/validators.js"

//ici j'ai un middleware et une validation des données pour savoir si le format de données que je recoit est bien celle que j'attend
// si les données on le bon format je fais une vérification auprès de mon document json des utilisateurs pour savoir si le nom d'utilisateur et le mot de passe 
// correspondent bien a un des utilisateurs présent dans mon fichier.
// si c'est la cas je renvois la verification qui sera égal a true et les données de l'utilisateur
// sinon je renvois la verification qui sera égal a false et un utilisateur null
const handler = mw({
  POST: [
    validate({
      body: {
        username: stringValidator.required(),
        password: stringValidator.required(),
      },
    }),
    async ({
      locals: {
        body: { username, password },
      },
      res
    }) => {
      const verify = utilisateurs.users.find((user) => user.username == username && user.mdp == password) ? true : false
      
      if(verify == true) {
        res.send({verify: verify, user: utilisateurs.users.find((user) => user.username == username && user.mdp == password)})
      }else {
        res.send({verify: verify, user: null})
      }
    },
  ],
})

export default handler
