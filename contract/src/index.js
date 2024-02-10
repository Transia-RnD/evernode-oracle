const HotPocket = require("hotpocket-nodejs-contract");
const {
  LogEmitter,
} = require("@transia/ever-lmdb-api/dist/npm/src/services/logger");
const { runOracle } = require("./libs/xrpl");

const contract = async (ctx) => {
  const logger = new LogEmitter(`test-${ctx.contractId}`, "contract");
  logger.info("CONTRACT PING");
  logger.info(`LEDGER SEQ: ${ctx.lclSeqNo}`);

  if (ctx.lclSeqNo % 10 === 0) {
    logger.info("RUN ORACLE");
    await runOracle(process.env.CURRENCY, process.env.ISSUER);
  }
};
const hpc = new HotPocket.Contract();
hpc.init(contract);
