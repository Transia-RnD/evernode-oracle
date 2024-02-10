const { Wallet, Client, dropsToXrp } = require("@transia/xrpl");
const { sign } = require("@transia/ripple-keypairs");
const {
  Xrpld,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  floatToLEXfl,
  ExecutionUtility,
} = require("@transia/hooks-toolkit");
const { ApiService } = require("./libs/ever-lmdb/api");
const crypto = require("crypto");

const { LiquidityCheck } = require("xrpl-orderbook-reader");
const { XrplClient } = require("xrpl-client");
const { Users } = require("./models/mock");
const { OracleArrayModel } = require("./models/OracleArrayModel");
const { OracleModel } = require("./models/OracleModel");
const settings = require("./settings.json").settings;

const amount = 100;
const liquidityType = "from";

async function getLiquidity(client, currency, issuer, amount, mode) {
  const request = new LiquidityCheck({
    trade: {
      from: {
        currency: "XAH",
      },
      amount: amount,
      to: {
        currency: currency,
        issuer: issuer,
      },
    },
    options: {
      rates: mode,
      maxSpreadPercentage: 0,
      maxSlippagePercentage: 5,
      maxSlippagePercentageReverse: 5,
    },
    client: client,
  });
  return await request.get();
}

async function runOracle(currency, issuer, amount) {
  try {
    const client = new XrplClient(process.env.WSS_XAHAU_ENDPOINT);
    client.on("error", (e) => log(`XRPL Error`, e));
    const xclient = new Client(process.env.WSS_XAHAU_ENDPOINT);
    await xclient.connect();
    xclient.networkID = await xclient.getNetworkID();

    const liquidity = await getLiquidity(
      client,
      currency,
      issuer,
      amount,
      liquidityType
    );
    console.log(liquidity);
    if (liquidity.rate === undefined) {
      console.log(
        `No Liquidity Available for '${amount} ${process.env.CURRENCY}'`
      );
      return;
    }
    const oracleModel = new OracleModel(issuer, currency, liquidity.rate);
    const oracleArray = new OracleArrayModel([oracleModel]);

    const builtTx1 = {
      TransactionType: "Invoke",
      Account: hookWallet.classicAddress,
      Blob: oracleArray.encode().slice(2, oracleArray.encode().length),
    };

    const result1 = await Xrpld.submit(testContext.client, {
      wallet: hookWallet,
      tx: builtTx1,
    });
    const hookExecutions1 = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result1.meta
    );
    console.log(hookExecutions1);
    client.close();
    await xclient.disconnect();
  } catch (error) {
    console.log(error.message);
  }
}

async function contract(ctx) {
  const isReadOnly = ctx.readonly;
  const api = new ApiService(`test-${ctx.contractId}`);
  console.log("CONTRACT PING");
  console.log(`CONTRACT ID: ${ctx.contractId}`);
  console.log(`LEDGER SEQ: ${ctx.lclSeqNo}`);
  console.log(`LEDGER HASH: ${ctx.lclHash}`);

  if (ctx.lclSeqNo % 3 === 0) {
    console.log("Calculate Price...");
    await runOracle(process.env.CURRENCY, process.env.ISSUER, amount);
  }

  for (const user of ctx.users.list()) {
    // Loop through inputs sent by each user.
    for (const input of user.inputs) {
      // Read the data buffer sent by user (this can be any kind of data like string, json or binary data).
      const buf = await ctx.users.read(input);

      // Let's assume all data buffers for this contract are JSON.
      const request = JSON.parse(buf);

      // Pass the JSON request to our application logic component.
      await api.handleRequest(user, request, isReadOnly);
    }
  }
}

function run(delay, ctx) {
  ctx.timestamp += parseInt(delay, 10);
  ctx.lclSeqNo += 1;
  ctx.lclHash = crypto.randomBytes(32).toString("hex");
  ctx.users = new Users([]);
  contract(ctx);
}

async function main() {
  const ctx = {
    contractId: "f511d0a8-24cb-4b08-bb5a-76ddafbb082c",
    publicKey:
      "ed159e9bd047328760f85c0b17155735b90a15357ff4fe0148e1419a559045286f",
    privateKey:
      "ed01d2f8ad542146b3e90d4c51b2038e57dbe48b7ad8342784da4f9c8f6cbe2080159e9bd047328760f85c0b17155735b90a15357ff4fe0148e1419a559045286f",
    readonly: false,
    timestamp: 1666586080258,
    users: {},
    unl: {},
    lclSeqNo: 1,
    lclHash: "7342fada37db5ed59b0ac5975d3cb84410127d9250be03bdfa8e568fabd648a8",
  };
  setInterval(() => run(6, ctx), 6000);
}

main();
