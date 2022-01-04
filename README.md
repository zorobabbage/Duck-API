# nfd-api

Uses an Sqlite3 db with every duck to allow for sorting on the server side

## Single duck

    /duck/[id]

```https://api.duck.community/duck/8```

-----

## Multiple ducks:
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





```https://api/duck.community/ducks?from=1&to=20&sortBy=overallRarity&order=asc```
