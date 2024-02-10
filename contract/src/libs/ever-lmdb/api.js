// import { DbService } from "ever-lmdb-sdk";
// const { LogEmitter } = require("ever-lmdb-sdk/dist/npm/src/services/logger");

class ApiService {
  #id = null;
  // @ts-expect-error - leave this alone
  #dbService = null;
  logger = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(id) {
    this.#id = id;
    // this.logger = new LogEmitter(this.#id, "api");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleRequest(user, request, isReadOnly) {
    let result;
    try {
      if (isReadOnly) {
        await this.sendOutput(user, result);
      } else {
        await this.sendOutput(user, { id: request.id, ...result });
      }
    } catch (error) {
      console.log(error.message);
      // this.logger.error(error.message);
      await user.send({ id: request.id, error: error.message });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendOutput = async (user, response) => {
    try {
      console.log("SENDING OUTPUT");
      // this.logger.info("SENDING OUTPUT");
      await user.send(response);
    } catch (error) {
      console.log(error.message);
      // this.logger.error(error.message);
    }
  };
}

module.exports = {
  ApiService,
};
