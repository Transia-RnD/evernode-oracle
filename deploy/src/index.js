const xrpl = require("@transia/xrpl");
const hooksToolkit = require("@transia/hooks-toolkit");

async function main() {
  const client = new xrpl.Client(process.env.WSS_XAHAU_ENDPOINT);
  await client.connect();
  client.networkID = await client.getNetworkID();

  const hook = hooksToolkit.createHookPayload({
    version: 0,
    createFile: "oracle",
    namespace: "oracle",
    flags: xrpl.SetHookFlags.hsfOverride,
    hookOnArray: ["Invoke"],
  });

  const response = await hooksToolkit.setHooksV3({
    client: client,
    seed: process.env.HOOK_SEED,
    hooks: [{ Hook: hook }],
  });
  console.log(response);
  await client.disconnect();
}

main();
