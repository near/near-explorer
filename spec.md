# NEAR Explorer Specification

NEAR block explorer is the first version of the developer dashboard.
Developer dashboard on top regular explorer will include logging in and working with contracts of the given user.

## Functionality

Functionality is listed in terms of priority:

Milestone 1.

- Current block height, last X blocks
- List available networks (testnets, mainnet)
- Current block producers / validators
- Transaction per seconds / last tps

Milestone 2.

- See specific account / contract by account id
- See details of specific transaction by hash
- App specific transactions, app state

Milestone 3.

- Map of the block producer's locations based on IP addresses
- Graph of Tx/s over last day

Milestone 4.

- Login via NEAR Wallet
- See applications controlled / deployed by given account
- Open NEAR Studio to edit code (if code available).
- Deploy from one network to another (promote from testnet to mainnet)

## Technology

Use Next.js to provide backend + frontend in Node.js + React interface.
Redux for managing data flow in the frontend.

Store received blocks in the local db.
Can start with sqlite db if there is good ORM.

### Structure of the project

The project should have three parts:
 - Frontend, React
 - Backend, Node (for example Next.js for both frontend and backend). This backend works with database to provide data to frontend.
 - NodeSync, job that connected to the node, and syncs it's state into the database.

 Additionally we can have an extra end point for telemetry from the other nodes directly to the explorer.

### Database structure

Tables:

- Block -- describes block, note that there can be skips in the height and forks will be different height. The best block at any time is block with largest weight.
    - hash (primary key)
    - height
    - prev_hash
    - timestamp
    - weight (u128)
    - author_id -- Account ID that authored
    - List<AccountId> -- list of approvals (if we need to look up on this, we can split it into separate table)
- Chunk -- part of the block that belongs to some shard.
    - hash (primary key)
    - block_hash
    - shard_id
    - author_id -- Account ID that authored
- Transaction -- includes both transactions and receipts.
    - hash (primary key)
    - originator
    - destination
    - kind: SendMoneyTransaction, CreateAccountTransaction, SignedTransaction, DeployContractTransaction, FunctionCallTransaction, StakeTransaction, SwapKeyTransaction, AddKeyTransaction, DeleteKeyTransaction, Receipt
    - args -- JSON of the transaction's arguments
    - parent_hash - can be NULL
    - chunk_hash -- chunk hash that this tx was included
    - status -- transaction status (Completed or Failed). Unknown wouldn't make it here.
    - logs -- log from executing transaction
- Account -- Same data structure for accounts and contracts.
    - account_id (primary key, all account ids [a-zA-Z0-9.-_@])
    - balance (u128)
    - stake (u128)
    - last_block_index
    - bytes -- how many bytes this account / contracts takes.
    - code -- byte code of the account.
- AccessKey -- access keys for accounts
    - account_id (owner of the access key)
    - contract_id (different account_id as well)
    - method_name (can be NULL)
    - amount (u128)
- Node
    - ip address -- can be empty
    - moniker -- custom name of the node, can be empty
    - account_id -- account used on this node, can be empty
    - node_id - public key (base58) that is used to identify the node
    - last_seen - timestamp
    - last_height - last height known

## Near RPC reference

Standard JSON RPC 2.0 is used across the board.

Next methods are available:

### Status
`status` returns current status of the node:
`http post http://127.0.0.1:3030/ jsonrpc=2.0 method=status params:="[]" id="dontcare"`
Result:
```
{
    "id": "dontcare",
    "jsonrpc": "2.0",
    "result": {
        "chain_id": "test-chain-nmZGf",
        "rpc_addr": "0.0.0.0:3030",
        "sync_info": {
            "latest_block_hash": "ugvtXLvad6DMGIYOf/NpgHt2AWbnhooTH53kp2GwB+w=",
            "latest_block_height": 17034,
            "latest_block_time": "2019-05-26T04:50:11.150214Z",
            "latest_state_root": "PHvWhgQjY37IOAiaUgnpDiZKwlcfzu+c585hGuIS5Qo=",
            "syncing": false
        }
    }
}
```

### Send transaction (async)

`broadcast_tx_async`: sends transaction and returns right away with the hash of the transaction in base58.

`http post http://127.0.0.1:3030/ jsonrpc=2.0 method=broadcast_tx_async params:="[<base 58 of the SignedTransaction>]" id="dontcare"`

### Send transaction (wait until done)

`broadcast_tx_commit`: sends transaction and returns only until transaction fully gets executed (including receipts). Has timeout of 5 (?) seconds.

`http post http://127.0.0.1:3030/ jsonrpc=2.0 method=broadcast_tx_async params:="[<base 58 of the SignedTransaction>]" id="dontcare"`

Result (`FinalTransactionResult`):
```
TODO
```

### Query
`query(path: string, data: bytes)`: queries information in the state machine / database. Where `path` can be:

- `account/<account_id>` - returns view of account information, e.g. `{"amount": 1000000, "nonce": 102, "account_id": "test.near"}`
- `access_key/<account_id>` - returns all access keys for given account.
- `access_key/<account_id>/<public_key>` - returns details about access key for given account with this public key. If there is no such access key, returns nothing.
- `contract/<account_id>` - returns full state of the contract (might be expensive if contract has large state).
- `call/<account_id>/<method name>` - calls `<method name>` in contract `<account_id>` as view function with `data` as parameters.

`http post http://127.0.0.1:3030/ jsonrpc=2.0 method=query params:="[\"account/test.near\",[]]" id="dontcare"`
```
{
    "id": "dontcare",
    "jsonrpc": "2.0",
    "result": {
        "code": 0,
        "codespace": "",
        "height": 0,
        "index": -1,
        "info": "",
        "key": "YWNjb3VudC90ZXN0Lm5lYXI=",
        "log": "exists",
        "proof": [],
        "value": "eyJhY2NvdW50X2lkIjoidGVzdC5uZWFyIiwibm9uY2UiOjAsImFtb3VudCI6MTAwMDAwMDAwMDAwMCwic3Rha2UiOjUwMDAwMDAwLCJwdWJsaWNfa2V5cyI6W1sxNjIsMTIyLDE0MCwyMTksMTcyLDEwNSw4MCw3OCwxOTAsMTY1LDI1NSwxNDAsMTExLDQzLDIyLDE0OSwyMTEsMTUyLDIyNywyMjcsNjcsMjIyLDIzNCw3Nyw5NiwxNTYsNjYsMjMsMTcyLDk2LDc2LDEzN11dLCJjb2RlX2hhc2giOiJBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBPSJ9"
    }
}
```
Where `value` is base58 encoded JSON of the account status:
`'{"account_id":"test.near","nonce":0,"amount":1000000000000,"stake":50000000,"public_keys":[[162,122,140,219,172,105,80,78,190,165,255,140,111,43,22,149,211,152,227,227,67,222,234,77,96,156,66,23,172,96,76,137]],"code_hash":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="}'`.
Note, this is Tendermint-like compatibility, that should be refactored.

### Block
`block(height: u64)`: returns block for given height. If there was re-org, this may differ.

`http post http://127.0.0.1:3030/ jsonrpc=2.0 method=block params:="[1000]" id="dontcare"`
```
{
    "id": "dontcare",
    "jsonrpc": "2.0",
    "result": {
        "header": {
            "approval_mask": [],
            "approval_sigs": [],
            "hash": [
                152,
                72,
                70,
                145,
                206,
                4,
                234,
                230,
                138,
                61,
                51,
                245,
                104,
                247,
                229,
                226,
                0,
                81,
                99,
                179,
                159,
                164,
                118,
                40,
                82,
                168,
                190,
                157,
                36,
                107,
                207,
                247
            ],
            "height": 1000,
            "prev_hash": [
                201,
                21,
                255,
                187,
                50,
                174,
                160,
                138,
                224,
                60,
                191,
                52,
                52,
                222,
                223,
                83,
                205,
                87,
                192,
                50,
                228,
                37,
                212,
                147,
                229,
                187,
                189,
                160,
                162,
                118,
                238,
                248
            ],
            "prev_state_root": [
                60,
                123,
                214,
                134,
                4,
                35,
                99,
                126,
                200,
                56,
                8,
                154,
                82,
                9,
                233,
                14,
                38,
                74,
                194,
                87,
                31,
                206,
                239,
                156,
                231,
                206,
                97,
                26,
                226,
                18,
                229,
                10
            ],
            "signature": [
                171,
                152,
                134,
                58,
                164,
                127,
                171,
                95,
                167,
                221,
                67,
                138,
                89,
                210,
                250,
                97,
                192,
                29,
                6,
                101,
                15,
                210,
                52,
                187,
                15,
                184,
                173,
                173,
                31,
                60,
                59,
                61,
                73,
                12,
                54,
                21,
                7,
                159,
                75,
                124,
                212,
                67,
                90,
                225,
                77,
                129,
                255,
                232,
                120,
                242,
                217,
                238,
                13,
                36,
                230,
                17,
                37,
                222,
                76,
                193,
                123,
                177,
                195,
                5
            ],
            "timestamp": 1558593531626085000,
            "total_weight": {
                "num": 1000
            },
            "tx_root": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ]
        },
        "transactions": []
    }
}
```

### Transaction Status
`tx_status(hash: bytes)`: queries status of the transaction by hash, returns FinalTransactionResult that includes status, logs and result: `{"status": "Completed", "logs": [{"hash": "<hash>", "lines": [], "receipts": [], "result": null}]}`.

### WebSockets

WebSockets for receiving new blocks at TODO.

## References

- Ether scan - https://etherscan.io
- Polkadot Telemetry - https://github.com/paritytech/substrate-telemetry
- POA Network block explorer - https://github.com/poanetwork/blockscout
