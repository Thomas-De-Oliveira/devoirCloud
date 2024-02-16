import validate from "@/api/middlewares/validate.js"
import mw from "@/api/middlewares/mw.js"
import utilisateurs from "../../../users.json"
import { stringValidator } from "@/validators.js"


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
