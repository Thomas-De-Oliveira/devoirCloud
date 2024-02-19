import validate from "@/api/middlewares/validate.js"
import mw from "@/api/middlewares/mw.js"
import { stringValidator } from "@/validators.js"
import {ComputeManagementClient} from "@azure/arm-compute"
import {DefaultAzureCredential} from "@azure/identity"

const handler = mw({
  POST: [
    validate({
      body: {
        nameVM: stringValidator.required(),
        jwt: stringValidator.required()
      },
    }),
    async ({
      locals: {
        body: { nameVM },
      },
      res
    }) => {
        const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID
        const credential = new DefaultAzureCredential({
            tenantId: process.env.AZURE_TENANT_ID,
            clientId: process.env.AZURE_CLIENT_ID,
            clientSecret: process.env.AZURE_CLIENT_SECRET
        })
        const computeClient = new ComputeManagementClient(credential, subscriptionId)
        const resourceGroupName = "NetworkWatcherRG"

        try {
            await computeClient.disks.beginDeleteAndWait(resourceGroupName, nameVM + "osdisk")
           
            res.send("DISK DELETE")
        } catch (error) {
          res.send(error)
        }
    },
  ],
})

export default handler