# nfd-api

Uses an Sqlite3 db with every duck to allow for sorting on the server side

## Single duck

    /duck/[id]

```localhost:5000/nfd/8```

-----

## Multiple ducks:
    /ducks/

#### from
    ID that the pagination should be from inclusive


#### to
     ID that the pagination should to from inclusive

```localhost:5000/ducks?from=1&to=20```

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





```localhost:5000/ducks?from=1&to=20&sortBy=overallRarity&order=asc```
