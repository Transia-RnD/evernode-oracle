const evernode = require("evernode-js-client");
require("dotenv/config");

const axios = require("axios");
const debug = require("debug");
const log = debug("contract:client");

async function extend(host) {
  const tenantAddress = process.env.EV_TENANT_ADDRESS;
  const tenantSecret = process.env.EV_TENANT_SECRET;
  const tenant = new evernode.TenantClient(tenantAddress, tenantSecret, {
    governorAddress: "rBvKgF3jSZWdJcwSsmoJspoXLLDVLDp6jg",
    rippledServer: "wss://xahau.network",
  });
  console.log(tenant);
  await tenant.connect();

  try {
    const timeout = 10000;
    const moments = 10;
    const instanceName = process.env.CONTRACT_NODE_NAME; // get from deployment info
    const hostAddress = process.env.CONTRACT_NODE_ADDRESS; // get from deployment info

    const result = await tenant.extendLease(hostAddress, moments, instanceName);
    log("Tenant received instance ", result);
  } catch (err) {
    log("Tenant received acquire error: ", err.reason);
  }
}

async function acquire(hostAddress) {
  try {
    const tenantAddress = process.env.EV_TENANT_ADDRESS;
    const tenantSecret = process.env.EV_TENANT_SECRET;
    const tenant = new evernode.TenantClient(tenantAddress, tenantSecret, {
      governorAddress: "rBvKgF3jSZWdJcwSsmoJspoXLLDVLDp6jg",
      rippledServer: "wss://xahau.network",
    });
    await tenant.connect();
    console.log(tenant);
    const timeout = 10000;
    const result = await tenant.acquireLease(
      hostAddress,
      {
        image: "evernodedev/sashimono:hp.latest-ubt.20.04-njs.20",
        config: {},
      },
      { timeout: timeout }
    );
    console.log(result);
    log("Tenant received instance ", result);
  } catch (error) {
    console.log(error);
    log("Tenant received acquire error: ", error.reason);
  }
}

async function getHosts() {
  try {
    evernode.Defaults.set({
      governorAddress: "rBvKgF3jSZWdJcwSsmoJspoXLLDVLDp6jg",
      rippledServer: "wss://xahau.network",
    });
    const client = await evernode.HookClientFactory.create(
      evernode.HookTypes.registry
    );
    await client.connect();
    const activeHosts = await client.getActiveHostsFromLedger();
    const openInstances = activeHosts.filter(
      (h) => h.maxInstances - h.activeInstances > 0
    );
    let costs = await axios.request(
      "https://xahau.xrplwin.com/api/evernode/hosts"
    );

    costs = costs.data.data.filter((h) => h.leaseprice_evr_drops !== null);
    costs.sort((a, b) => a.leaseprice_evr_drops - b.leaseprice_evr_drops);

    acquire(host);
    // await client.disconnect();
  } catch (error) {
    console.log(error);
  }
}
// getHosts();
acquire("r9zsACSvdNBRcSAn8KdMr39xqt6uf1VmTp");
