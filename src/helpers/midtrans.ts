const midtransClient = require("midtrans-client");

interface IMidtrans {
  createTransaction: (
    parameter: Record<string, any>
  ) => Promise<Record<string, any>>;
  createTransactionToken: (
    parameter: Record<string, any>
  ) => Promise<Record<string, any>>;
  createTransactionRedirectUrl: (
    parameter: Record<string, any>
  ) => Promise<Record<string, any>>;
}

let globalMidtrans = globalThis as unknown as { midtrans: IMidtrans };

export const midtrans = (globalMidtrans.midtrans ||
  new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  })) as IMidtrans;
