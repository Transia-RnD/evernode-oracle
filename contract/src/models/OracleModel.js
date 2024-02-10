"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleModel = void 0;
const BaseModel_1 = require("@transia/hooks-toolkit/dist/npm/src/libs/binary-models");
class OracleModel extends BaseModel_1.BaseModel {
  constructor(issuer, currency, value) {
    super();
    this.issuer = issuer;
    this.currency = currency;
    this.value = value;
  }
  getMetadata() {
    return [
      { field: "issuer", type: "xrpAddress" },
      { field: "currency", type: "currency" },
      { field: "value", type: "xfl" },
    ];
  }
  toJSON() {
    return {
      issuer: this.issuer,
      currency: this.currency,
      value: this.value,
    };
  }
}
exports.OracleModel = OracleModel;
//# sourceMappingURL=OracleModel.js.map
