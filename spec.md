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
            "latest_block_hash": [
                155,
                184,
                255,
                47,
                47,
                105,
                85,
                83,
                49,
                209,
                81,
                156,
                30,
                108,
                0,
                180,
                240,
                80,
                187,
                241,
                35,
                130,
                79,
                248,
                147,
                11,
                244,
                108,
                210,
                193,
                150,
                106
            ],
            "latest_block_height": 617,
            "latest_block_time": "2019-05-23T06:38:11.297633Z",
            "latest_state_root": [
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
            "syncing": false
        }
    }
}
```

### Query
`query(path: string, data: bytes)`: queries information in the state machine / database. Where `path` can be
    - `account/<name>` - returns view of account information, e.g. `{"amount": 1000000, "nonce": 102, "account_id": "test.near"}`
    - `contract/<name>/<method name>` - calls `<method name>` in contract `<name>` as view function with `data` as parameters.
    - `contract/<name>` - returns full state of the contract (might be expensive if contract has large state).

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
Where `value` is base64 encoded JSON of the account status:
`'{"account_id":"test.near","nonce":0,"amount":1000000000000,"stake":50000000,"public_keys":[[162,122,140,219,172,105,80,78,190,165,255,140,111,43,22,149,211,152,227,227,67,222,234,77,96,156,66,23,172,96,76,137]],"code_hash":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="}'`.
Note, this is Tendermint-like compatibility, that should be refactored.

### Block
`block(height: u64)`: returns block for given height. If there was re-org, this may differ.

### Transaction Status
`tx_status(hash: bytes)`: queries status of the transaction by hash, returns FinalTransactionResult that includes status, logs and result: `{"status": "Completed", "logs": [{"hash": "<hash>", "lines": [], "receipts": [], "result": null}]}`.

### WebSockets

WebSockets for receiving new blocks at TODO.

## References

- Ether scan - https://etherscan.io
- Polkadot Telemetry - https://github.com/paritytech/substrate-telemetry
- POA Network block explorer - https://github.com/poanetwork/blockscout
