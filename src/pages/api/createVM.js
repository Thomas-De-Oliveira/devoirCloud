import validate from "@/api/middlewares/validate.js"
import mw from "@/api/middlewares/mw.js"
import { stringValidator } from "@/validators.js"
import {ComputeManagementClient} from "@azure/arm-compute"
import {NetworkManagementClient } from "@azure/arm-network"
import {DefaultAzureCredential} from "@azure/identity"

const handler = mw({
  POST: [
    validate({
      body: {
        nameImage: stringValidator.required(),
        jwt: stringValidator.required()
      },
    }),
    async ({
      locals: {
        body: { nameImage },
      },
      res
    }) => {
        let subnetInfo = ""
        let publicIPInfo = ""
        let nicInfo = ""
        let image = ""
        const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID
        const credential = new DefaultAzureCredential({
            tenantId: process.env.AZURE_TENANT_ID,
            clientId: process.env.AZURE_CLIENT_ID,
            clientSecret: process.env.AZURE_CLIENT_SECRET
        })
        const computeClient = new ComputeManagementClient(credential, subscriptionId)
        const networkClient = new NetworkManagementClient(credential, subscriptionId)
        const vnetName = "devoir_cloud"
        const subnetName = "default"
        const vmName = "vm" + nameImage
        const resourceGroupName = "NetworkWatcherRG"
        const networkInterfaceName = "testnic"
        const location = "francecentral"
        const domainNameLabel = "exocloud"
        const publicIPName = "devoirCloud"
        const ipConfigName = "testcrpip"
        const publicIPParameters = {
            location: location,
            publicIPAllocationMethod: "Dynamic",
            dnsSettings: {
              domainNameLabel: domainNameLabel
            }
        }

        try {
            subnetInfo = await networkClient.subnets.get(resourceGroupName, vnetName, subnetName)
        }catch (error) {
          res.send(error)
        }

        try {
          publicIPInfo = await networkClient.publicIPAddresses.beginCreateOrUpdateAndWait(resourceGroupName, publicIPName, publicIPParameters)
        }catch (error) {
          res.send(error)
        }

        const nicParameters = {
            location: location,
            ipConfigurations: [
              {
                name: ipConfigName,
                privateIPAllocationMethod: "Dynamic",
                subnet: subnetInfo,
                publicIPAddress: publicIPInfo
              }
            ]
          }

        try {
          nicInfo = await networkClient.networkInterfaces.beginCreateOrUpdateAndWait(resourceGroupName, networkInterfaceName, nicParameters)
        }catch (error) {
            res.send(error)
        }

        if(nameImage == "Windows10") {
          image = {
            publisher: "MicrosoftWindowsDesktop",
            offer: "Windows-10",
            sku: "20h2-evd",
            version: "latest"
          }
        } else if(nameImage == "Ubuntu") {
          image = {
            publisher: "Canonical",
            offer: "UbuntuServer",
            sku: "18.04-LTS",
            version: "latest"
        }
        } else if(nameImage == "Debian") {
          image = {
            publisher: "Debian",
            offer: "debian-10",
            sku: "10",
            version: "latest"
        }
        }
      
        const vmParameters = {
            location: location,
            hardwareProfile: {
                vmSize: "Standard_B1ls"
            },
            osProfile: {
                computerName: vmName,
                adminUsername: "notadmin",
                adminPassword: "Pa$$w0rd92",
            },
            storageProfile: {
                imageReference: {
                    publisher: image.publisher,
                    offer: image.offer,
                    sku: image.sku,
                    version: image.version
                },
                osDisk: {
                    name: vmName + "osdisk",
                    createOption: "FromImage",
                    managedDisk: {
                        storageAccountType: "Standard_LRS"
                    }
                }
            },
            networkProfile: {
                networkInterfaces: [{
                    id: nicInfo.id
                }]
            }
        }

        try {
           await computeClient.virtualMachines.beginCreateOrUpdateAndWait(resourceGroupName, vmName, vmParameters)
        } catch (error) {
          res.send(error)
        }

        try {
          const ipAddress = await networkClient.publicIPAddresses.get(resourceGroupName, publicIPName)

          res.send({ipAddress : ipAddress.ipAddress, name: vmParameters.osProfile.adminUsername, password: vmParameters.osProfile.adminPassword, nameVM: vmName})
        }catch (error) {
            res.send(error)
        }
    },
  ],
})

export default handler