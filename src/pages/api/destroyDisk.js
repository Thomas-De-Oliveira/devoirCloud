import validate from "@/api/middlewares/validate.js"
import mw from "@/api/middlewares/mw.js"
import { stringValidator } from "@/validators.js"
import {ComputeManagementClient} from "@azure/arm-compute"
import {DefaultAzureCredential} from "@azure/identity"

//ici j'ai un middleware et une validation des données pour savoir si le format de données que je recoit est bien celle que j'attend
// si les données on le bon format je me connecte a mon portail azure avec le tenantId, le clientId et le clientSecret
const handler = mw({
  POST: [
    validate({
      body: {
        nameVM: stringValidator.required(),
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
        const resourceGroupName = process.env.AZURE_RESSOURCE_GROUP_NAME

        //ici je supprime le disk de la machine virtuel present dans mon groupe de ressource
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