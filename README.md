# FccScrape
A web scraper to pull some data from a users FreeCodeCamp profile.

## Prerequisites
* nodejs (developed using 6.10.3)
* mongodb (developed using 3.4.4)

## Getting Setup
```
git clone https://github.com/BWoodson/FccScrape.git

cd FccScrape

cp server\config\config.example.json server\config\config.json
```

edit config.json as needed

```
npm install

npm start
```

## API
### GET /scrape/:id
Returns JSON of the profile