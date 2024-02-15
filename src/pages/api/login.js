import validate from "@/api/middlewares/validate.js"
import mw from "@/api/middlewares/mw.js"
import users from "../../../users.json"
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
      res,
    }) => {

    },
  ],
})

export default handler
