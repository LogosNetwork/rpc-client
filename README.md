<h1 align="center" style="text-align:center">
  <br>
  <a href="http://www.logos.network"><img src="https://www.logos.network/assets/images/custom/logo.png" alt="Logos Network Logo" width="200"></a>
  <br>
  Logos Network
</h1>

<h4 align="center" style="text-align:center">Logos RPC Client</h4>

Promise-based client for interacting and building services on top of the Logos network

## Install

`npm i @logosnetwork/logos-rpc-client`

### Your own Logos Node


To setup a direct connection to a Logos node do the following
```javascript
const LogosRPC = require('@logosnetwork/logos-rpc-client')
const logos = new LogosRPC({url: 'http://3.215.28.211:55000'})
```

You may also proxy your RPC calls through another server
```javascript
const LogosRPC = require('@logosnetwork/logos-rpc-client')
const logos = new LogosRPC({url: 'http://3.215.28.211:55000', proxyURL: 'https://pla.bs'})
```

To setup a proxy server include something similar to the following in your server
```javascript
app.post('/rpc', async (req, res) => {
  let targetURL = req.body.targetURL
  delete req.body.targetURL
  const response = await axios.post(`${targetURL}/`, req.body)
  res.send(response.data)
})
```

### Remote Logos Node

Simply follow the same steps are seen above and use one of the current delegates found here: [delegate list](https://pla.bs/delegates) sorted by their delegate id.


### Delegate Load Balancing

When building for production you **must** select the proper delegate for publishing your transactions. If you do not select the proper delegate you will incur a 5 second transaction confirmation penalty. This is an incentive to load balance the requests to the 32 delegates equally.

Here is an example of how to calculate the proper delegate id given an ACCOUNT_ID.

```javascript
let delegateID = null

//Check the most recent 
//on the account who wants to publish
if (accountFrontier === '0000000000000000000000000000000000000000000000000000000000000000') {
    // If the frontier doesn't exist We use the 
    // last two digits of the hexadecimal hash 
    // of the public key mod 32 to give us a 
    // random distribution
    delegateID = parseInt(publicKey.slice(-2), 16) % 32
} else {
    // When the account has a previous transaction 
    // we use the last two digits of the hexadecimal hash
    // mod 32 to give us a random distribution
    delegateID = parseInt(accountFrontier.slice(-2), 16) % 32
}
```

Once you have the delegate id you can find the delegate from the [delegate list](https://pla.bs/delegates) here.

```javascript
logos.changeServer(`http://${delegateList[delegateId]}:55000`)
```


### Debug mode

To enable some helpful logs, pass `debug: true` as a paramater in the constructor object.

## Working with accounts

### Generate an account

It's easy to generate a new random account. You'll get the account's private and public keys along with its address.

```javascript
const {privateKey, publicKey, address} = await logos.key.create()
```


### Send funds

```javascript
await logos.account(PRIVATE_KEY).send(0.01, RECIPIENT_ADDRESS)
```

## Full list of methods

All methods return native or Bluebird promises and are fully compatible with `async/await`.

### Accounts

Account methods take a single account string or in some cases, an array of accounts.

* `logos.accounts.toAddress(publicKey: string)`
* `logos.accounts.reasonBalance(account: string)`
* `logos.accounts.logosBalance(account: string)`
* `logos.accounts.balances(accounts: string[])`
* `logos.accounts.blockCount(account: string)`
* `logos.accounts.history(account: string, count?: number)`
* `logos.accounts.info(account: string)`

### Keys

Used for generating accounts and extrapolating public keys/addresses from private keys.

* `logos.key.create()`
* `logos.key.expand(privateKey: string)`

### Transactions

Has a method to get information about transactions:

* `logos.transactions.info(hashOrHahes: string | string[], details?: boolean)`

Method to construct a transaction:

* `logos.transactions.createSend(block: SendBlock)`

And a method to publish a constructed block to the network:

* `logos.transactions.publish(block: string)`

### Request Blocks

Allows you to retrieve information on request blocks

* `logos.requestBlocks.history(count: string | number, delegateIndex: string | number, hash: string)`
* `logos.requestBlocks.get(hashes: [string])`

### Micro Epochs

Allows you to retrieve information on micro epochs

* `logos.microEpochs.history(count: string | number, hash: string)`
* `logos.microEpochs.get(hashes: [string])`


### Epochs

Allows you to retrieve information on epochs

* `logos.epochs.history(count: string | number, hash: string)`
* `logos.epochs.get(hashes: [string])`

### Unit Converter

Allows you to convert `LOGOS` amounts to and from their reason values. Reason is the smallest unit of the Logos currency.

```javascript
const LogosRPC = require('@logosnetwork/logos-rpc-client')
const logos = new LogosRPC({url: 'http://3.215.28.211:55000', proxyURL: 'https://pla.bs'})
let amountInReason = logos.convert.toReason('1', 'LOGOS')
```

```typescript
import { convert } from '@logosnetwork/logos-rpc-client'
let amountInReason = convert.toReason('1', 'LOGOS')
let amountInLogos = convert.fromReason('1000000000000000000000000000000', 'LOGOS')
// Converter can also be used to convert token values
// or in this example bitcoin into satoshis
let bitcoinsInSatoshis = convert.fromTo('1', 8, 0)
// You can use the fromTo function for the example above also
amountInReason = convert.fromTo('1', 30, 0) // '1000000000000000000000000000000' Reason
amountInLogos = convert.fromTo('1000000000000000000000000000000', 0, 30) // '1' LOGOS
```

* `logos.convert.toReason(amount: string | number, denomination: 'LOGOS')`
* `logos.convert.fromReason(amount: string, denomination: 'LOGOS')`
* `logos.convert.fromTo(amount: string, currentDec: number, preferedDec: number)`

### Work

Allows you to generate and validate Proof of Work for a given block hash.

* `logos.work.generate(hash: string)`
* `logos.work.validate(work: string, hash: string)`

### Other

* `logos.available()`
* `logos.deterministicKey(seed: string, index?: string | number)`
* `logos.changeServer(nodeURL: string, proxyURL?: string)`

## Calling RPC directly

If there's a method missing, or if you prefer to call RPC directly, you can use `logos.rpc`. You'll still get the full benefit of type checking and return types for applicable RPC calls.

```typescript
await logos.rpc('account_info', {account})
```
