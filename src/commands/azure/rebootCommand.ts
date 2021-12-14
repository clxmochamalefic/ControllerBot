import "dotenv/config"

import { Message } from "discord.js";
import { AbortController } from "@azure/abort-controller";
import { ComputeManagementClient } from "@azure/arm-compute"
import { ClientSecretCredential } from "@azure/identity"

import Command from "../commandInterface";

export class AzureRebootCommand implements Command {
  commandNames = ["reboot", "restart"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}boot to boot virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("request received / begin reboot VirtualMachine")
    await message.reply("shutting-down VirtualMachine")

    const tenantId = process.env.AZURE_TENANT_ID || "REPLACE-WITH-YOUR-TENANT-ID" 
    const clientId = process.env.AZURE_CLIENT_ID || "REPLACE-WITH-YOUR-CLIENT-ID"
    const secret = process.env.AZURE_CLIENT_SECRET || "REPLACE-WITH-YOUR-CLIENT-SECRET"
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID"
    const resGroup = process.env.AZURE_RES_GROUP || "REPLACE-WITH-YOUR-RES_GROUP"
    const vmName = process.env.AZURE_VM_NAME || "REPLACE-WITH-YOUR-VM_NAME"

    const abortController = new AbortController();

    const credentials = new ClientSecretCredential(tenantId, clientId, secret)
    const computeClient = new ComputeManagementClient(credentials, subscriptionId)
    const pollDeallocateResponse = await computeClient.virtualMachines.beginDeallocate(resGroup, vmName, { abortSignal: abortController.signal })

    const response = await pollDeallocateResponse.pollUntilDone();

    await message.reply("stopped VirtualMachine")
    await message.reply("begin boot VirtualMachine")

    const pollStartResponse = await computeClient.virtualMachines.beginStart(resGroup, vmName)
    const startResponse = await pollStartResponse.pollUntilDone();

    await message.reply("booted VirtualMachine")
    await message.reply("request accepted / rebooted VirtualMachine")
  }
}
