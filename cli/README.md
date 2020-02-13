# NEAR Explorer CLI

This is an UNSTABLE convenience tool which helps to make some routine calls to NEAR Explorer
Backend.

This CLI uses internal APIs which are not really meant for public use, but we still need to query
some information once in a while, so here is the convenience tool to do that.

## Setup

Install NPM dependencies:

```
$ npm install
```

## Usage

Run `./bin/near-explorer` without parameters to get a help message with all the available
parameters.

The common example of querying the production testnet NEAR Explorer:

```
$ ./bin/near-explorer query
```

You can specify `--endpoint` and `--chain-id` if you want to query other backends.

To query `staging` network data running on production NEAR Explorer:

```
$ ./bin/near-explorer --chain-id staging query
```

To query a locally running NEAR Explorer backend (WAMP):

```
$ ./bin/near-explorer --endpoint http://localhost:8080/ws --chain-id localhostnet query
```
