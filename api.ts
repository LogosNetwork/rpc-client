export interface APIBase {
  [method: string]: {
    body?: any
    response?: any
  }
}

export interface API extends APIBase {
  account_balance: {
    body: {
      account: string
    }
    response: {
      balance: string
      pending: string
    }
  }

  account_block_count: {
    body: {
      account: string
    }
    response: {
      block_count: string
    }
  }

  account_from_key: {
    body: {
      key: string
    }
    response: {
      account: string
    }
  }

  account_history: {
    body: {
      account: string //target wallet
      count?: number //return limit
    }
    response: {
      history: TransactionHistory[]
    }
  }

  account_info: {
    body: {
      account: string, //target wallet
      logos: null
    }
    response: {
      frontier: string
      open_block: string
      representative_block: string
      balance: string
      modified_timestamp: string
      block_count: string
    }
  }

  account_to_key: {
    body: {
      account: string
    }
    response: {
      key: string
    }
  }

  account_representative: {
    body: {
      account: string
    }
    response: {
      representative: string
    }
  }

  account_weight: {
    body: {
      account: string
    }
    response: {
      weight: string
    }
  }

  accounts_balances: {
    body: {
      accounts: string[]
    }
    response: {
      [account: string]: {
        balance: string
        pending: string
      }
    }
  }

  accounts_frontiers: {
    body: {
      accounts: string[]
    }
    response: {
      frontiers: {
        [account: string]: string
      }
    }
  }

  accounts_pending: {
    body: {
      accounts: string[]
      count?: number
    }
    response: {
      blocks: {
        [account: string]: string
      }
    }
  }

  available_supply: {
    body: {}
    response: {
      available: string
    }
  }

  generate_micro_block: {
    body: {
      last?: boolean
    }
    response: {
      contents: string
    }
  }

  block: {
    body: {
      hash: string
    }
    response: {
      contents: TransactionRequest
    }
  }

  blocks: {
    body: {
      hashes: string[]
    }
    response: {
      blocks: {
        [account: string]: TransactionRequest
      }
    }
  }

  block_account: {
    body: {
      hash: string
    }
    response: {
      account: string
    }
  }

  block_count: {
    body: {}
    response: {
      count: number
      unchecked: string
    }
  }

  block_count_type: {
    body: {}
    response: {
      send: string
      receive: string
      open: string
      change: string
    }
  }

  block_create: {
    body: {
      type: 'open' | 'send' | 'receive' | 'change' | 'state',
      logos: null,
      key: string //open, send, receive: PRIVATE KEY for logos wallet to 'sign' the block
      previous?: string
      work: string
      account?: string //open, send: The 'target' wallet which is being opened or debited
      representative?: string //open: A 'representative' wallet to use your balance as vote weight
      source?: string //open, receive: Always refers to the most recent block hash on YOUR account
      signature?: string
      transaction_fee?: string // Transaction fee for the transaction fee minimum
      destination?: string //send: destination logos wallet
      balance?: string //send: current balance of debited address
      amount?: string
    }
    response: {
      hash: string
      block: string
    }
  }

  chain: {
    body: {
      block: string
      count: number
    }
  }

  delegators: {
    body: {
      account: string
    }
    response: {
      delegators: {
        [account: string]: string
      }
    }
  }

  delegators_count: {
    body: {
      account: string
    }
    response: {
      count: string
    }
  }

  deterministic_key: {
    body: {
      seed: string
      index: string | number
    }
    response: {
      private: string
      public: string
      account: string
    }
  }

  frontiers: {
    body: {
      account: string
    }
    response: {
      frontiers: {
        [account: string]: string
      }
    }
  }

  epochs: {
    body: {
      hashes: string[]
    }
    response: {
      blocks: Epoch[]
    }
  }

  epochs_latest: {
    body: {
      hash?: string //starting hash
      count?: string | number //return limit
    }
    response: {
      history: Epoch[]
    }
  }

  micro_blocks: {
    body: {
      hashes: string[]
    }
    response: {
      blocks: MicroEpoch[]
    }
  }

  micro_blocks_latest: {
    body: {
      hash?: string //starting hash
      count?: string | number //return limit
    }
    response: {
      history: MicroEpoch[]
    }
  }

  batch_blocks: {
    body: {
      hashes: string[]
    }
    response: {
      blocks: BatchBlock[]
    }
  }

  batch_blocks_latest: {
    body: {
      count?: string | number,
      delegate_id: string | number,
      hash?: string //starting hash
    }
    response: {
      history: BatchBlock[]
    }
  }

  frontier_count: {
    body: {
      account: string
    }
    response: {
      count: string
    }
  }

  key_create: {
    body: any
    response: AccountInfo
  }

  key_expand: {
    body: any
    response: AccountInfo
  }

  krai_to_raw: {
    body: {
      amount: string | number
    }
    response: {
      amount: string
    }
  }

  history: {
    body: {
      hash: string
      count: number
    }
    response: TransactionHistory[]
  }

  ledger: {
    body: {
      account: string
      count?: number
      representative?: boolean
      weight?: boolean
      pending?: boolean
    }
    response: {
      accounts: {
        [account: string]: {
          frontier: string
          open_block: string
          representative_block: string
          balance: string
          modified_timestamp: string
          block_count: string
          representative?: string
          weight?: string
          pending?: string
        }
      }
    }
  }

  pending: {
    body: {
      account: string
      count: number
    }
    response: {
      blocks: string[]
    }
  }

  pending_exists: {
    body: {
      hash: string
    }
    response: {
      exists: '1' | '0'
    }
  }

  process: {
    body: {
      block: string,
      logos: null
    }
    response: {
      hash: string
    }
  }

  receive: {
    body: {
      wallet: string
      account: string
      block: string
    }
    response: {
      block: string
    }
  }

  receive_minimum: {
    body: {}
    response: {
      amount: string
    }
  }

  receive_minimum_set: {
    body: {
      amount: string
    }
    response: {
      success: string
    }
  }

  representatives: {
    body: {}
    response: {
      representatives: {
        [account: string]: string
      }
    }
  }

  successors: {
    body: {
      block: string
      count: number
    }
    response: {
      blocks: string[]
    }
  }

  work_generate: {
    body: {
      hash: string
    }
    response: {
      work: string
    }
  }

  work_validate: {
    body: {
      work: string
      hash: string
    }
    response: {
      valid: string
    }
  }
}

export type BatchBlock = {
  type: string
  previous: string
  hash: string
  block_count: string
  signature: string
  blocks: [TransactionRequest]
}

export type Epoch = {
  account: string
  epoch_number: string
  micro_block_tip: string
  transaction_fee_pool: string
  signature: string
  delegates: [delegate]
}

export type MicroEpoch = {
  timestamp: string
  previous: string
  hash: string
  delegate: string
  epoch_number: string
  micro_block_number: string
  last_micro_block: string
  tips: [string]
  number_batch_blocks: string
  signature: string
}

export type TransactionRequest = {
  type: string
  account: string
  representative: string
  source: string
  work: string
  signature: string
}

export type delegate = {
  account: string
  vote: string
  stake: string
}

export type TransactionHistory = {
  type: string
  account: string
  hash: string
  amount: string
}

export type SendBlock = {
  key: string
  destination: string
  amount: string
  previous: string
  transaction_fee: string
  work: string
}

export type ReceiveBlock = {
  key: string
  previous: string
  work: string
  source: string
}

export type OpenBlock = {
  key: string
  source: string
  previous: string
  representative: string
  work: string
}

export type ChangeBlock = {
  previous: string
  key: string
  work: string
  representative: string
}

export type AccountInfo = {
  public: string
  private: string
  account: string
}
