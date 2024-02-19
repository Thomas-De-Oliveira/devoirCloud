import validate from "@/api/middlewares/validate.js"
import mw from "@/api/middlewares/mw.js"
import utilisateurs from "../../../users.json"
import { stringValidator } from "@/validators.js"
import {DefaultAzureCredential} from "@azure/identity"

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
      const credential = new DefaultAzureCredential({
        tenantId: process.env.AZURE_TENANT_ID,
        clientId: process.env.AZURE_CLIENT_ID,
        clientSecret: process.env.AZURE_CLIENT_SECRET
      })
      const token = await credential.getToken("https://management.azure.com/.default")

      if(verify == true) {
        res.send({verify: verify, user: utilisateurs.users.find((user) => user.username == username && user.mdp == password), token: token.token})
      }else {
        res.send({verify: verify, user: null})
      }
    },
  ],
})

export default handler
