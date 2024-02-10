# Build Contract

```
export EV_TENANT_SECRET=
export EV_USER_PRIVATE_KEY=
export EV_USER_PUBLIC_KEY=
export EV_INSTANCE_CONFIG_PATH=
```

`evdevkit bundle ../contract/dist ed2f06a72850d48b025c4c9f53776a6dc1d20e2e28fa1429570f672c3b6984360e /usr/bin/node -a index.js`

# Deploy to Cluster

`evdevkit cluster-create 3 ../contract/dist /usr/bin/node hosts.txt -a index.js`