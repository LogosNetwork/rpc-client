# Logos RPC Client

Promise-based client for interacting and building services on top of the Logos network

## Install

`npm install logos-rpc-client`

### Your own Logos RPC server

```typescript
const {Logos} = require('logos-rpc-client')
const logos = new Logos({url: 'http://localhost:7076'})
```

### Debug mode

To enable some helpful logs, pass `debug: true` as a paramater in the constructor object.

## Working with accounts

### Generate an account

It's easy to generate a new random account. You'll get the account's private and public keys along with its address.

```typescript
const {privateKey, publicKey, address} = await logos.key.create()
```

### Open account

In order to open an account and let the network know it exists, we'll need publish an `open` block. An account can't be opened with zero balance, so we'll first need to send some Logos to our account's address from our own wallet then call `open()`.

```typescript
await logos.account(PRIVATE_KEY).open()
```

### Send funds

```typescript
await logos.account(PRIVATE_KEY).send(0.01, RECIPIENT_ADDRESS)
```

## Full list of methods

All methods return native or Bluebird promises and are fully compatible with `async/await`.

### Working with a specific account

If you're just looking to transact with Logos, these methods will cover 90% of your use case.

```typescript
const account = logos.account(PRIVATE_KEY)
```

* `account.open(representative?: string, hash?: string)`
* `account.send(logosAmount: string | number, address: string)`
* `account.change(representative: string)`
* `account.reasonBalance()`
* `account.logosBalance()`
* `account.blockCount()`
* `account.history(count?: number)`
* `account.info()`
* `account.publicKey()`
* `account.ledger(count?: number, details?: boolean)`
* `account.pending(count?: number, minLogosThreshold?: string | number)`
* `account.representative()`
* `account.weight()`

### Keys

Used for generating accounts and extrapolating public keys/addresses from private keys.

* `logos.key.create()`
* `logos.key.expand(privateKey: string)`

### Accounts

Account methods take a single account string or in some cases, an array of accounts.

* `logos.accounts.toAddress(publicKey: string)`
* `logos.accounts.reasonBalance(account: string)`
* `logos.accounts.logosBalance(account: string)`
* `logos.accounts.balances(accounts: string[])`
* `logos.accounts.blockCount(account: string)`
* `logos.accounts.frontiers(accounts: string[])`
* `logos.accounts.history(account: string, count?: number)`
* `logos.accounts.info(account: string)`
* `logos.accounts.key(account: string)`
* `logos.accounts.ledger(account: string, count?: number, details?: boolean)`
* `logos.accounts.pending(account: string, count?: number, minLogosThreshold?: string | number)`
* `logos.accounts.pendingMulti(accounts: string[], count?: number, minLogosThreshold?: string | number)`
* `logos.accounts.representative(account: string)`
* `logos.accounts.weight(account: string)`

### Blocks

Has methods to get information about blocks:

* `logos.blocks.account(hash: string)`
* `logos.blocks.count(byType?: boolean)`
* `logos.blocks.chain(hash: string, count?: number)`
* `logos.blocks.history(hash: string, count?: number)`
* `logos.blocks.info(hashOrHahes: string | string[], details?: boolean)`
* `logos.blocks.pending(hash: string)`
* `logos.blocks.successors(block: string, count?: number)`

Methods to construct blocks:

* `logos.blocks.createOpen(block: OpenBlock)`
* `logos.blocks.createSend(block: SendBlock)`
* `logos.blocks.createChange(block: ChangeBlock)`

And a method to publish a constructed block to the network:

* `logos.blocks.publish(block: string)`

### Convert

Allows you to convert `ethos` and `pathos` amounts to and from their reason values.

* `logos.convert.toReason(amount: string | number, denomination: 'ethos' | 'pathos')`
* `logos.convert.fromReason(amount: string, denomination: 'ethos' | 'pathos')`

### Work

Allows you to generate and validate Proof of Work for a given block hash.

* `logos.work.generate(hash: string)`
* `logos.work.validate(work: string, hash: string)`

### Other

* `logos.available()`
* `logos.representatives()`
* `logos.deterministicKey(seed: string, index?: string | number)`

## Calling RPC directly

If there's a method missing, or if you prefer to call RPC directly, you can use `logos.rpc`. You'll still get the full benefit of type checking and return types for applicable RPC calls.

```typescript
await logos.rpc('account_info', {account})
```
