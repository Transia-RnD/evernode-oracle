"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleArrayModel = void 0;
const BaseModel_1 = require("@transia/hooks-toolkit/dist/npm/src/libs/binary-models");
const OracleModel_1 = require("./OracleModel");
class OracleArrayModel extends BaseModel_1.BaseModel {
  constructor(oracles) {
    super();
    this.oracles = oracles;
  }
  getMetadata() {
    return [
      {
        field: "oracles",
        type: "varModelArray",
        modelClass: OracleModel_1.OracleModel,
        maxArrayLength: 100,
      },
    ];
  }
  toJSON() {
    return {
      oracles: this.oracles,
    };
  }
}
exports.OracleArrayModel = OracleArrayModel;
//# sourceMappingURL=OracleArrayModel.js.map
