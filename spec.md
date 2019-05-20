# NEAR Explorer Specification

## Functionality

Functionality is listed in terms of priority:

- Current block height, last X blocks
- List available networks (testnets, mainnet)
- Current block producers / validators
- Transaction per seconds / last tps
- See specific account / contract by account id
- See details of specific transaction by hash
- App specific transactions, app state

Extra:
- Map of the block producer's locations based on IP addresses
- Graph of Tx/s over last day

## Technology

Use Next.js to provide backend + frontend in Node.js + React interface.
Redux for managing data flow in the frontend.

## Near RPC reference

Standard JSON RPC 2.0 is used across the board.

Next methods are available:

- `status`: returns current status of the node.
- `query(path: string, data: bytes)`: queries information in the state machine / database. Where `path` can be
    - `account/<name>` - returns view of account information, e.g. `{"amount": 1000000, "nonce": 102, "account_id": "test.near"}`
    - `contract/<name>/<method name>` - calls `<method name>` in contract `<name>` as view function with `data` as parameters.
    - `contract/<name>` - returns full state of the contract (might be expensive if contract has large state).
- `block(height: u64)`: returns block for given height. If there was re-org, this may differ.
- `tx_status(hash: bytes)`: queries status of the transaction by hash, returns FinalTransactionResult that includes status, logs and result: `{"status": "Completed", "logs": [{"hash": "<hash>", "lines": [], "receipts": [], "result": null}]}`.

## References

- Ether scan - https://etherscan.io
- Polkadot Telemetry - https://github.com/paritytech/substrate-telemetry
