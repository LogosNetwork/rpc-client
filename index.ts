import axios from 'axios'
const {accountPair} = require('./util/util.js')
import Converter from './util/converter'

import {
  API,
  APIBase,
  SendBlock,
  ReceiveBlock,
  OpenBlock,
  ChangeBlock
} from './api'

//TODO Change this representative to something signifigant.
export const LogosRepresentative =
  'xrb_3rropjiqfxpmrrkooej4qtmm1pueu36f9ghinpho4esfdor8785a455d16nf'
export const BounceAddress = ''

export type RPCClient = (params: any) => Promise<any>
function createAPI<API extends APIBase = any>(rpcClient: RPCClient) {
  return async function callRPC<Action extends keyof API>(
    action: Action,
    body?: API[Action]['body']
  ): Promise<API[Action]['response']> {
    const params = Object.assign({}, body || {}, {action})
    return rpcClient(params)
  }
}

export function createAxiosClient(
  baseURL = 'http://52.215.106.54:55000'
): RPCClient {
  const headers = {}
  const rpc = axios.create({
    baseURL,
    headers
  })

  return async function(params: any): Promise<any> {
    const {data} = await rpc.post('/', params)
    return data
  }
}

export interface LogosConstructorOptions {
  url?: string
  rpcClient?: RPCClient
  debug?: boolean
}

export class Logos {
  rpc = createAPI<API>(null)
  debug: boolean

  constructor(options: LogosConstructorOptions) {
    this.debug = !!options.debug
    this._log = this._log.bind(this)

    if (options.rpcClient) {
      this.rpc = createAPI<API>(options.rpcClient)
    } else {
      const rpcClient = createAxiosClient(options.url)
      this.rpc = createAPI<API>(rpcClient)
    }
  }

  changeServer(url: string) {
    const rpcClient = createAxiosClient(url)
    this.rpc = createAPI<API>(rpcClient)
  }

  _log(message: string) {
    if (this.debug) {
      console.log(message)
    }
  }

  account(private_key: string) {
    const {address} = accountPair(private_key)

    return {
      open: (respresentative?: string, hash?: string) => {
        return this.open(private_key, respresentative, hash)
      },
      send: (amount: string | number, address: string) => {
        return this.send(private_key, amount, address)
      },
      receive: (hash?: string) => {
        return this.receive(private_key, hash)
      },
      change: (representative: string) => {
        return this.change(private_key, representative)
      },
      reasonBalance: () => {
        return this.accounts.reasonBalance(address)
      },
      logosBalance: () => {
        return this.accounts.logosBalance(address)
      },
      blockCount: () => {
        return this.accounts.blockCount(address)
      },
      history: (count?: number) => {
        return this.accounts.history(address, count)
      },
      info: () => {
        return this.accounts.info(address)
      },
      publicKey: () => {
        return this.accounts.key(address)
      },
      ledger: (count?: number, details?: boolean) => {
        return this.accounts.ledger(address, count, details)
      },
      pending: (count?: number, threshold?: string) => {
        return this.accounts.pending(address, count, threshold)
      },
      representative: () => {
        return this.accounts.representative(address)
      },
      weight: () => {
        return this.accounts.weight(address)
      }
    }
  }

  //Top-level call: open block
  async open(
    privateKey: string,
    representative?: string,
    sendBlockHash?: string
  ) {
    const {_log} = this

    if (!privateKey) {
      throw new Error('Must pass privateKey argument')
    }

    if (!representative) {
      representative = LogosRepresentative
    }

    const {address, publicKey} = accountPair(privateKey)
    const {work} = await this.work.generate(publicKey)

    if (!sendBlockHash) {
      const res = await this.accounts.pending(address, 1)
      if (!res.blocks || res.blocks.length === 0) {
        throw new Error('This account has no pending blocks to receive')
      }

      sendBlockHash = res.blocks[0]
    }

    const block = await this.blocks.createOpen({
      previous: publicKey,
      key: privateKey,
      source: sendBlockHash,
      work,
      representative
    })

    const result = await this.blocks.publish(block.block)
    _log(
      `Opened Logos account ${address} with block ${
        result.hash
      } and representative ${representative}!`
    )
    return result
  }

  //Top-level call: send block
  async send(privateKey: string, amount: string | number, toAddress: string) {
    const {_log} = this
    if (!privateKey) {
      throw new Error('Must pass private_key argument')
    }

    const {frontier, work} = await this.generateLatestWork(privateKey)
    const amountReason = Converter.unit(amount, 'LOGOS', 'reason')

    const block = await this.blocks.createSend({
      key: privateKey,
      destination: toAddress,
      amount: amountReason,
      previous: frontier,
      work
    })

    const result = await this.blocks.publish(block.block)
    _log(`Sent ${amountReason} reason to ${toAddress}!`)
    return result.hash
  }

  //Top-level call: receive block
  async receive(privateKey: string, sendBlockHash?: string) {
    const {_log} = this

    if (!privateKey) {
      throw new Error('Must pass privateKey argument')
    }

    const {address, frontier, work} = await this.generateLatestWork(privateKey)

    if (!sendBlockHash) {
      const res = await this.accounts.pending(address, 1)
      if (!res.blocks || res.blocks.length === 0) {
        throw new Error('This account has no pending blocks to receive')
      }

      sendBlockHash = res.blocks[0]
    }

    const block = await this.blocks.createReceive({
      key: privateKey,
      previous: frontier,
      work,
      source: sendBlockHash
    })

    const result = await this.blocks.publish(block.block)
    _log(`Received block ${sendBlockHash} to wallet ${address}!`)
    return result
  }

  //Top-level call: change block
  async change(privateKey: string, representative: string) {
    const {_log} = this

    if (!privateKey) {
      throw new Error('Must pass privateKey argument')
    }

    const {frontier, work} = await this.generateLatestWork(privateKey)

    const block = await this.blocks.createChange({
      previous: frontier,
      representative,
      work,
      key: privateKey
    })

    const result = await this.blocks.publish(block.block)
    _log(`Opened Logos block ${result.hash} with rep. ${representative}!`)
    return result
  }

  async generateLatestWork(privateKey: string) {
    const {address} = accountPair(privateKey)
    const {frontier} = await this.accounts.info(address)
    const {work} = await this.work.generate(frontier)

    return {
      address,
      frontier,
      work
    }
  }

  //General account methods
  get accounts() {
    const {rpc, _log} = this
    return {
      toAddress(publicKey: string) {
        return rpc('account_from_key', {key: publicKey})
      },
      reasonBalance(account: string) {
        return rpc('account_balance', {account})
      },
      logosBalance(account: string) {
        return rpc('account_balance', {account}).then(balance =>
          Converter.unit(balance.balance, 'reason', 'LOGOS')
        )
      },
      balances(accounts: string[]) {
        return rpc('accounts_balances', {accounts})
      },
      blockCount(account: string) {
        return rpc('account_block_count', {account})
      },
      frontiers(accounts: string[]) {
        return rpc('accounts_frontiers', {accounts})
      },
      history(account: string, count?: number) {
        return rpc('account_history', {
          account,
          count: count || 1000
        }).then(res => res.history)
      },
      info(account: string) {
        return rpc('account_info', {account: account, logos: null}).then(account => {
          _log(`(ACCOUNT) balance: ${account.balance}`)
          _log(`(ACCOUNT) latest hash: ${account.frontier}`)
          return account
        })
      },
      key(account: string) {
        return rpc('account_to_key', {account})
      },
      ledger(account: string, count?: number, details?: boolean) {
        return rpc('ledger', {
          account,
          count: count || 1000,
          representative: details,
          weight: details,
          pending: details
        })
      },
      pending(
        account: string,
        count?: number,
        minLogosThreshold?: string | number
      ) {
        return rpc('pending', {
          account,
          threshold: Converter.unit(minLogosThreshold || 0, 'LOGOS', 'reason'),
          count: count || 1000
        })
      },
      pendingMulti(
        accounts: string[],
        count?: number,
        minLogosThreshold?: string | number
      ) {
        return rpc('accounts_pending', {
          accounts,
          threshold: Converter.unit(minLogosThreshold || 0, 'LOGOS', 'reason'),
          count: count || 1000
        })
      },
      representative(account: string) {
        return rpc('account_representative', {
          account
        }).then(res => res.representative)
      },
      weight(account: string) {
        return rpc('account_weight', {account}).then(res => res.weight)
      }
    }
  }

  get blocks() {
    const {rpc, _log} = this

    return {
      account(hash: string) {
        return rpc('block_account', {hash}).then(res => res.account)
      },
      count(byType?: boolean) {
        return byType ? rpc('block_count_type') : rpc('block_count')
      },
      chain(block: string, count?: number) {
        return rpc('chain', {
          block,
          count: count || 1000
        }).then(res => res.blocks)
      },
      createChange(block: ChangeBlock) {
        return rpc('block_create', {
          type: 'change',
          logos: null,
          ...block
        }).then(res => {
          _log(`(BLOCK) Changing ${block.key}`)
          return res
        })
      },
      history(hash: string, count?: number) {
        return rpc('history', {
          hash,
          count: count || 1000
        })
      },
      //Get one or many block's information
      info(hashOrHashes: string | string[], details?: boolean) {
        const getMulti = (typeof hashOrHashes as string | string[]) === 'array'
        if (getMulti) {
          return details
            ? rpc('blocks_info', {
                hashes: hashOrHashes as string[]
              }).then(res => res.blocks)
            : rpc('blocks', {
                hashes: hashOrHashes as string[]
              }).then(res => res.blocks)
        } else {
          return rpc('block', {
            hash: hashOrHashes as string
          }).then(res => res)
        }
      },
      createOpen(block: OpenBlock) {
        return rpc('block_create', {
          type: 'open',
          logos: null,
          ...block
        }).then(res => {
          _log(`(BLOCK) Opening ${block.key}`)
          return res
        })
      },
      pending(hash: string) {
        return rpc('pending_exists', {hash}).then(res => res.exists === '1')
      },
      publish(block: string) {
        return rpc('process', {block: block, logos: null}).then(res => {
          _log(`(BLOCK) Published: ${res.hash}`)
          return res
        })
      },
      createReceive(block: ReceiveBlock) {
        return rpc('block_create', {
          type: 'receive',
          logos: null,
          ...block
        }).then(res => {
          _log(`Received block ${block.source}`)
          return res
        })
      },
      createSend(block: SendBlock) {
        return rpc('block_create', {
          type: 'state',
          logos: null,
          ...block
        }).then(res => {
          _log(`(BLOCK) Sending ${block.amount} to ${block.destination}`)
          return res
        })
      },
      successors(block: string, count?: number) {
        return rpc('successors', {
          block,
          count: count || 1000
        })
      }
    }
  }

  get convert() {
    type Denomination = 'pathos' | 'ethos' | 'LOGOS'
    return {
      toReason(amount: string | number, denomination: Denomination) {
        return Converter.unit(amount, denomination, 'reason')
      },
      fromReason(amount: string, denomination: Denomination) {
        return Converter.unit(amount, 'reason', denomination)
      }
    }
  }

  get delegators() {
    const {rpc} = this
    return {
      get(account: string) {
        return rpc('delegators', {account}).then(res => res.delegators)
      },
      count(account: string) {
        return rpc('delegators_count', {account}).then(res => res.count)
      }
    }
  }

  get frontiers() {
    const {rpc} = this
    return {
      get(account: string, count?: number) {
        return rpc('frontiers', {
          account,
          count: count || 1000
        })
      },
      count() {
        return rpc('frontier_count').then(res => res.count)
      }
    }
  }

  get key() {
    const {rpc} = this

    // The word 'private' is reserved in JS so we use this function
    // to get around that, and to make 'address' more clear
    function convertKeyObj(keyObj: API['key_create']['response']) {
      return {
        privateKey: keyObj.private,
        publicKey: keyObj.public,
        address: keyObj.account
      }
    }

    return {
      create() {
        return rpc('key_create').then(convertKeyObj)
      },
      expand(privateKey: string) {
        return rpc('key_expand', {key: privateKey}).then(convertKeyObj)
      }
    }
  }

  //Generate and get work
  get work() {
    const {rpc, _log} = this

    return {
      generate(hash: string) {
        return rpc('work_generate', {hash}).then(result => {
          _log(`(WORK) generated PoW: ${result.work}`)
          return result
        })
      },
      validate(work: string, hash: string) {
        return rpc('work_validate', {work, hash})
      }
    }
  }

  available() {
    return this.rpc('available_supply').then(res => res.available)
  }
  representatives() {
    return this.rpc('representatives').then(res => res.representatives)
  }

  deterministicKey(seed: string, index?: string | number) {
    return this.rpc('deterministic_key', {
      seed,
      index
    })
  }

  get minimumReceive() {
    const {rpc} = this
    return {
      get() {
        return rpc('receive_minimum')
      },
      set(logosAmount: string | number) {
        return rpc('receive_minimum_set', {
          amount: Converter.unit(logosAmount, 'LOGOS', 'reason')
        }).then(res => res.success === '')
      }
    }
  }
}
module.exports = Logos;