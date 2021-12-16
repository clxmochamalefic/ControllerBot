import { Message } from "discord.js";
import { AbortController } from "@azure/abort-controller";
import { ComputeManagementClient } from "@azure/arm-compute"
import { ClientSecretCredential } from "@azure/identity"

import Command from "../commandInterface";
import azureConfig from "../../config/azureConfig"

export class AzureHaltCommand implements Command {
  commandNames = ["stop", "shutdown", "powerOff", "halt"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}halt to stop virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("request received / shutting-down VirtualMachine")

    const abortController = new AbortController();

    const credentials = new ClientSecretCredential(azureConfig.tenantId, azureConfig.clientId, azureConfig.secret)
    const computeClient = new ComputeManagementClient(credentials, azureConfig.subscriptionId)
    const beginStartResponse = await computeClient.virtualMachines.beginDeallocate(azureConfig.resGroup, azureConfig.vmName, { abortSignal: abortController.signal })

    const response = await beginStartResponse.pollUntilDone();
    console.log(response)

    await message.reply("request accepted / stopped VirtualMachine / ( (o>_<) THANK YOU SEND SHUTDOWN COMMAND!!")
  }
}
