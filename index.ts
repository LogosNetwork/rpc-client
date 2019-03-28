import axios from 'axios'
const {accountPair, keyFromAccount} = require('./util/util.js')
import Converter from './util/converter'

import {
  API,
  APIBase
} from './api'

//TODO Change this on mainnet etc.
export const minimumFee = '10000000000000000000000'

export type RPCClient = (params: any) => Promise<any>
function createAPI<API extends APIBase = any>(rpcClient: RPCClient) {
  return async function callRPC<Action extends keyof API>(
    rpc_action: Action,
    body?: API[Action]['body']
  ): Promise<API[Action]['response']> {
    const params = Object.assign({}, body || {}, {rpc_action})
    return rpcClient(params)
  }
}

export function createAxiosClient(
  baseURL = 'https://pla.bs',
  targetURL?: string
): RPCClient {
  const headers = {}
  const rpc = axios.create({
    baseURL,
    headers
  })

  return async function(params: any): Promise<any> {
    if (!targetURL) {
      const {data} = await rpc.post('/', params)
      return data
    } else {
      params.targetURL = targetURL
      const {data} = await rpc.post('/rpc', params)
      return data
    }
  }
}

export const convert = {
  toReason(amount: string | number, denomination: Denomination) {
    return Converter.unit(amount, denomination, 'reason')
  },
  fromReason(amount: string, denomination: Denomination) {
    return Converter.unit(amount, 'reason', denomination)
  },
  fromTo(amount: string, currentDec: number, preferedDec: number) {
    return Converter.unit(amount, currentDec, preferedDec)
  }
}

export interface LogosConstructorOptions {
  url?: string
  proxyURL?: string
  rpcClient?: RPCClient
  debug?: boolean
}
export type Denomination = 'reason' | 'LOGOS'

export type MultiSendRequest = {
  destination: string
  amount: string
}

export class Logos {
  rpc = createAPI<API>(null)
  debug: boolean

  constructor(options: LogosConstructorOptions = {}) {
    this.debug = !!options.debug
    this._log = this._log.bind(this)

    if (options.rpcClient) {
      this.rpc = createAPI<API>(options.rpcClient)
    } else if (options.proxyURL) {
      const rpcClient = createAxiosClient(options.proxyURL, options.url)
      this.rpc = createAPI<API>(rpcClient)
    } else {
      const rpcClient = createAxiosClient(options.url)
      this.rpc = createAPI<API>(rpcClient)
    }
  }

  changeServer(baseURL: string, targetURL?: string) {
    if (targetURL) {
      const rpcClient = createAxiosClient(baseURL, targetURL)
      this.rpc = createAPI<API>(rpcClient)
    } else {
      const rpcClient = createAxiosClient(baseURL)
      this.rpc = createAPI<API>(rpcClient)
    }
  }

  _log(message: string) {
    if (this.debug) {
      console.log(message)
    }
  }

  account(private_key: string) {
    const {address} = accountPair(private_key)

    return {
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
      }
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
      history(account: string, count?: number, details?: boolean, head?: string) {
        return rpc('account_history', {
          account,
          count: count || 1000,
          raw: details || false,
          head: head
        }).then(res => res.history)
      },
      info(account: string) {
        return rpc('account_info', {account: account}).then(account => {
          _log(`(ACCOUNT) balance: ${account.balance}`)
          _log(`(ACCOUNT) latest hash: ${account.frontier}`)
          return account
        })
      },
      key(account: string) {
        return keyFromAccount(account)
      }
    }
  }

  get requests() {
    const {rpc, _log} = this
    
    return {
      info(hash: string) {
        return rpc('block', {
          hash: hash
        }).then(res => res)
      },
      publish(request: string) {
        return rpc('process', {request: request}).then(res => {
          _log(`(REQUEST) Published: ${res.hash}`)
          return res
        })
      }
    }
  }

  get epochs() {
    const {rpc} = this

    return {
      history(count: string | number, hash: string) {
        return rpc('epochs_latest', {
          count: count || 1000,
          head: hash
        }).then(res => res)
      },
      get(hashes: [string]) {
        return rpc('epochs', {
          hashes: hashes
        }).then(res => res)
      }
    }
  }

  get microEpochs() {
    const {rpc} = this

    return {
      history(count: string | number, hash: string) {
        return rpc('micro_blocks_latest', {
          count: count || 1000,
          head: hash
        }).then(res => res)
      },
      get(hashes: [string]) {
        return rpc('micro_blocks', {
          hashes: hashes
        }).then(res => res)
      }
    }
  }

  get requestBlocks() {
    const {rpc} = this

    return {
      history(count: string | number, delegateIndex: string | number, hash: string) {
        return rpc('request_blocks_latest', {
          count: count || 1000,
          delegate_id: delegateIndex || '0',
          head: hash
        }).then(res => res)
      },
      get(hashes: [string]) {
        return rpc('request_blocks', {
          hashes: hashes
        }).then(res => res)
      }
    }
  }

  static convert = convert
  get convert() {
    return convert
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

  generateMicroBlock(last?: boolean) {
    return this.rpc('generate_microblock', {
      last: last
    }).then(res => res)
  }

  deterministicKey(seed: string, index?: string | number) {
    return this.rpc('deterministic_key', {
      seed,
      index
    })
  }
}
module.exports = Logos;
