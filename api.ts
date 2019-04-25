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
      history: Request[]
    }
  }

  account_info: {
    body: {
      account: string //target wallet
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
    response: Request
  }

  blocks: {
    body: {
      hashes: string[]
    }
    response: {
      blocks: Request[]
    }
  }

  block_count: {
    body: {}
    response: {
      count: number
      unchecked: string
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

  epoch_delegates: {
    body: {
      epoch: "current" | "next"
    }
    response: {
      delegates: DelegateIPs
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
      blocks: RequestBlock[]
    }
  }

  batch_blocks_latest: {
    body: {
      count?: string | number,
      delegate_id: string | number,
      hash?: string //starting hash
    }
    response: {
      history: RequestBlock[]
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
    response: Request[]
  }

  process: {
    body: {
      request: string
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

export type RequestBlock = {
  delegate: string
  epoch_number: string
  sequence: string
  timestamp: string
  previous: string
  signature: string
  type: string
  request_count: string
  requests: Request[]
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

export type Request = {
  type: string
  origin: string
  signature: string
  previous: string
  next: string
  fee: string
  sequence: string
  work: string
  number_transactions: string
  transactions: MultiSendRequest[]
  hash: string
}

export type MultiSendRequest = {
  destination: string
  amount: string
}

export type delegate = {
  account: string
  vote: string
  stake: string
}

export type AccountInfo = {
  public: string
  private: string
  account: string
}

export type DelegateIP = {
  ip: string
}

export type DelegateIPs = {
  0: DelegateIP,
  1: DelegateIP,
  2: DelegateIP,
  3: DelegateIP,
  4: DelegateIP,
  5: DelegateIP,
  6: DelegateIP,
  7: DelegateIP,
  8: DelegateIP,
  9: DelegateIP,
  10: DelegateIP,
  11: DelegateIP,
  12: DelegateIP,
  13: DelegateIP,
  14: DelegateIP,
  15: DelegateIP,
  16: DelegateIP,
  17: DelegateIP,
  18: DelegateIP,
  19: DelegateIP,
  20: DelegateIP,
  21: DelegateIP,
  22: DelegateIP,
  23: DelegateIP,
  24: DelegateIP,
  25: DelegateIP,
  26: DelegateIP,
  27: DelegateIP,
  28: DelegateIP,
  29: DelegateIP,
  30: DelegateIP,
  31: DelegateIP
}
