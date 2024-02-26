import validate from "@/api/middlewares/validate.js"
import mw from "@/api/middlewares/mw.js"
import { stringValidator } from "@/validators.js"
import {ComputeManagementClient} from "@azure/arm-compute"
import {NetworkManagementClient } from "@azure/arm-network"
import {DefaultAzureCredential} from "@azure/identity"

//ici j'ai un middleware et une validation des données pour savoir si le format de données que je recoit est bien celle que j'attend
// si les données on le bon format je me connecte a mon portail azure avec le tenantId, le clientId et le clientSecret
// Je recupere toute les données que j'ai besoin par rapport a ce que j'ai créeer sur le portail azure et dans mon groupe de ressource
const handler = mw({
  POST: [
    validate({
      body: {
        nameImage: stringValidator.required(),
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
        const vnetName = process.env.AZURE_VIRTUAL_NET_NAME
        const resourceGroupName = process.env.AZURE_RESSOURCE_GROUP_NAME
        const domainNameLabel = process.env.AZURE_DOMAIN_LABEL
        const publicIPName = process.env.AZURE_PUBLIC_IP_NAME
        const location = process.env.AZURE_LOCATION
        const subnetName = "default"
        const vmName = "vm" + nameImage
        const networkInterfaceName = "testnic"
        const ipConfigName = "testcrpip"
        const publicIPParameters = {
            location: location,
            publicIPAllocationMethod: "Dynamic",
            dnsSettings: {
              domainNameLabel: domainNameLabel
            }
        }
        
        //première étape je recuperer les données de mon sous-réseaux présent dans le réseau virtuel que j'ai créer dans mon groupe de ressource
        try {
            subnetInfo = await networkClient.subnets.get(resourceGroupName, vnetName, subnetName)
        }catch (error) {
          res.send(error)
        }

        //ici je crée une adresse Ip en fonction du public ip que j'ai créer dans mon groupe de ressource et parametre du public ip
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

        // ici je crée une interface réseau en fonction de cette addresse IP qu'on a créer précedement, on donne le nom qu'on veut a cette interface ici j'ai mis testnic
        try {
          nicInfo = await networkClient.networkInterfaces.beginCreateOrUpdateAndWait(resourceGroupName, networkInterfaceName, nicParameters)
        }catch (error) {
            res.send(error)
        }

        //ici je recuperer les données de l'image en fonction de celle que j'ai sélectionné sur mon interface front
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

        // la je met en place les paramètres de ma machine virtuel
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

        // ici je crée la machine virtuel 
        try {
           await computeClient.virtualMachines.beginCreateOrUpdateAndWait(resourceGroupName, vmName, vmParameters)
        } catch (error) {
          res.send(error)
        }

        //ici je recupere l'adresseIP crée et precedement ainsi que des données dont j'ai besoin pour que l'utilisateur puisse avoir accès a la VM
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