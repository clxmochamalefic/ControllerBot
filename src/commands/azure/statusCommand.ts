import "dotenv/config"

import { Message } from "discord.js";
import { ComputeManagementClient, InstanceViewStatus } from "@azure/arm-compute"
import { NetworkManagementClient } from "@azure/arm-network"
import { ClientSecretCredential } from "@azure/identity"

import Command from "../commandInterface";

export class AzureStatusCommand implements Command {
  commandNames = ["status", "stat"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}status to status of virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("request received / fetch VirtualMachine status")

    const tenantId = process.env.AZURE_TENANT_ID || "REPLACE-WITH-YOUR-TENANT-ID" 
    const clientId = process.env.AZURE_CLIENT_ID || "REPLACE-WITH-YOUR-CLIENT-ID"
    const secret = process.env.AZURE_CLIENT_SECRET || "REPLACE-WITH-YOUR-CLIENT-SECRET"
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID"
    const resGroup = process.env.AZURE_RES_GROUP || "REPLACE-WITH-YOUR-RES_GROUP"
    const vmName = process.env.AZURE_VM_NAME || "REPLACE-WITH-YOUR-VM_NAME"
    const networkName = process.env.AZURE_NETWORK_NAME || "REPLACE-WITH-YOUR-VM_NAME"

    const credentials = new ClientSecretCredential(tenantId, clientId, secret)
    const computeClient = new ComputeManagementClient(credentials, subscriptionId)
    const instanceViewResponse = await computeClient.virtualMachines.instanceView(resGroup, vmName);
    const instanceResponse = await computeClient.virtualMachines.get(resGroup, vmName);

    console.log("instanceViewResponse")
    console.log(instanceViewResponse)

    const networkClient = new NetworkManagementClient(credentials, subscriptionId)
    const publicIPAddresses = await networkClient.publicIPAddresses.list(resGroup);

    await message.reply("request accepted / show status below")
    const statuses = instanceViewResponse.statuses as InstanceViewStatus[]
    for (let stat of statuses) {
        await message.reply("statuses: " + stat.displayStatus)
    }

    for await (let x of publicIPAddresses) {
        console.log("networkProfile")
        console.log(x)
        if (x.name == networkName) {
            await message.reply("ip address: " + x.ipAddress)
        }
    }
  }
}
