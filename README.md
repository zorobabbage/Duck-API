# nfd-api


Uses an Sqlite3 db with every duck to allow for sorting on the server side.
Also contains the rewards api to allow frontend to read MongoDB.

#### .env

Supply the following
    mainnet_contract
    testnet_contract
    network

## NFDs

#### Single duck

    /duck/[id]

```https://api.duck.community/duck/8```

-----

#### Multiple ducks:
    /ducks/

#### from
    ID that the pagination should be from inclusive


#### to
     ID that the pagination should to from inclusive

```https://api.duck.community/ducks?from=1&to=20```

#### sortBy:
    - baseRarity
    - beakRarity
    - eyesRarity
    - hatRarity
    - outfitRarity
    - overallRarity

#### Order:
    - asc
    - desc

#### Filters
    - base
    - beak
    - eyes
    - hat
    - outfit
    - background


```https://api/duck.community/ducks?from=1&to=20&sortBy=overallRarity&order=asc```    
```https://api.duck.community/ducks?from=1&to=24&sortBy=overallRarity&order=desc&outfit=Black+Deezys```

#### Owner
    Can filter request by the duck owner as well.
    Here's my ducks:

```https://api.duck.community/ducks?owner=0x24DdeDbf3A3DF608f4C9fbF56153866947e1b159```

-----

## rewards
```https://api/duck.community/rewards```
