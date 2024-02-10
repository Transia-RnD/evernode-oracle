const { Wallet, Client } = require("@transia/xrpl");
const { Xrpld } = require("@transia/hooks-toolkit");

const { LiquidityCheck } = require("xrpl-orderbook-reader");
const { XrplClient } = require("xrpl-client");
const { OracleArrayModel } = require("./models/OracleArrayModel");
const { OracleModel } = require("./models/OracleModel");
const settings = require("../../../settings.json").settings;

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

async function runOracle(currency, issuer) {
  try {
    const client = new XrplClient(process.env.WSS_XAHAU_ENDPOINT);
    client.on("error", (e) => log(`XRPL Error`, e));
    const xclient = new Client(process.env.WSS_XAHAU_ENDPOINT);
    await xclient.connect();
    xclient.networkID = await xclient.getNetworkID();

    const amount = 100;
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
    const oracleModel = new OracleModel(
      issuer,
      currency,
      liquidity.rate.toFixed(2)
    );
    const oracleArray = new OracleArrayModel([oracleModel]);
    const hookWallet = Wallet.fromSeed(settings.secret);
    const builtTx1 = {
      TransactionType: "Invoke",
      Account: hookWallet.classicAddress,
      Blob: oracleArray.encode().slice(2, oracleArray.encode().length),
    };
    await Xrpld.submit(xclient, {
      wallet: hookWallet,
      tx: builtTx1,
    });
    client.close();
    await xclient.disconnect();
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  runOracle,
};
