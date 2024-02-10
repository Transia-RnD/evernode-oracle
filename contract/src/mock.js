const {
  LogEmitter,
} = require("@transia/ever-lmdb-api/dist/npm/src/services/logger");
const crypto = require("crypto");
const { Users } = require("./__mock__/mock");
const { runOracle } = require("./libs/xrpl");

/*
Production Contract Functionality
*/
async function contract(ctx) {
  const logger = new LogEmitter(`test-${ctx.contractId}`, "contract");
  logger.info("CONTRACT PING");
  logger.info(`CONTRACT ID: ${ctx.contractId}`);
  logger.info(`LEDGER SEQ: ${ctx.lclSeqNo}`);
  logger.info(`LEDGER HASH: ${ctx.lclHash}`);

  if (ctx.lclSeqNo % 10 === 0) {
    logger.info("RUN ORACLE");
    await runOracle(process.env.CURRENCY, process.env.ISSUER);
  }
}

/*
Mock Contract Tooling
DO NOT ADJUST BELOW THIS LINE UNLESS YOU KNOW WHAT YOU ARE DOING...
*/
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
