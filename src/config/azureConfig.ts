import "dotenv/config"

export type AzureEnvironemnt = {
    subscriptionId: string,
    clientId: string,
    secret: string,
    tenantId: string,
    resGroup: string,
    vmName: string,
    networkName: string,
}

const azureConfig: AzureEnvironemnt = {
    subscriptionId: process.env.AZURE_SUBSCRIPTION_ID || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID",
    clientId: process.env.AZURE_CLIENT_ID || "REPLACE-WITH-YOUR-CLIENT-ID",
    secret: process.env.AZURE_CLIENT_SECRET || "REPLACE-WITH-YOUR-CLIENT-SECRET",
    tenantId: process.env.AZURE_TENANT_ID || "REPLACE-WITH-YOUR-TENANT-ID",
    resGroup: process.env.AZURE_RES_GROUP || "REPLACE-WITH-YOUR-RES_GROUP",
    vmName: process.env.AZURE_VM_NAME || "REPLACE-WITH-YOUR-VM_NAME",
    networkName: process.env.AZURE_NETWORK_NAME || "REPLACE-WITH-YOUR-VM_NAME",
};

export default azureConfig;
