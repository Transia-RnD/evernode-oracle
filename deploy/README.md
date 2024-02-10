# Build Contract

```
export EV_TENANT_SECRET=
export EV_USER_PRIVATE_KEY=
export EV_USER_PUBLIC_KEY=
export EV_INSTANCE_CONFIG_PATH=
```

`evdevkit bundle ../contract/dist /usr/bin/node -a index.js`

# Deploy to Cluster

`evdevkit cluster-create 3 ../contract/dist /usr/bin/node hosts.txt -a index.js`