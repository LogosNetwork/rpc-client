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
      count?: number //return limit,
      details?: boolean
      head?: string
    }
    response: {
      history: TransactionRequest[]
    }
  }

  account_info: {
    body: {
      account: string //target wallet
      logos: null
    }
    response: {
      balance: string
      block_count: string
      frontier: string
      modified_timestamp: string
      open_block: string
      receive_tip: string
      representative_block: string
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

  available_supply: {
    body: {}
    response: {
      available: string
    }
  }

  generate_microblock: {
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

  block_count: {
    body: {}
    response: {
      count: number
      unchecked: string
    }
  }

  block_create: {
    body: {
      type: 'state',
      key: string //send: PRIVATE KEY for logos wallet to 'sign' the block
      previous?: string
      work: string
      transaction_fee?: string // Transaction fee for the transaction fee minimum
      destination?: string //send: destination logos wallet
      amount?: string
    }
    response: {
      hash: string
      block: string
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

  key_create: {
    body: any
    response: AccountInfo
  }

  key_expand: {
    body: any
    response: AccountInfo
  }

  history: {
    body: {
      hash: string
      count: number
    }
    response: TransactionRequest[]
  }

  process: {
    body: {
      block: string
      logos: null
    }
    response: {
      hash: string
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
  delegate: string
  epoch_number: string
  sequence: string
  timestamp: string
  previous: string
  signature: string
  type: string
  blocks_count: string
  blocks: TransactionRequest[]
  paricipation_map: string
  next: string
  hash: string
}

export type Epoch = {
  account: string
  epoch_number: string
  micro_block_tip: string
  transaction_fee_pool: string
  signature: string
  delegates: delegate[]
}

export type MicroEpoch = {
  timestamp: string
  previous: string
  hash: string
  delegate: string
  epoch_number: string
  micro_block_number: string
  last_micro_block: string
  tips: string[]
  number_batch_blocks: string
  signature: string
}

export type TransactionRequest = {
  account: string
  previous: string
  sequence: string
  transcation_type: string
  transcation_fee: string
  signature: string
  number_transactions: string
  transactions: MultiSendRequest[]
  hash: string
  batch_hash: string
  index_in_batch: string 
}

export type MultiSendRequest = {
  target: string
  amount: string
}

export type delegate = {
  account: string
  vote: string
  stake: string
}

export type SendBlock = {
  key: string
  destination: string
  amount: string
  previous: string
  transaction_fee: string
  work: string
}

export type AccountInfo = {
  public: string
  private: string
  account: string
}
