# geofire-example
Example project showing how to make use of Geofire for Firebase in NodeJS

# Usage

- `npm-install`
- Create `.env` file at root project directory with Firebase config details similar to the following:

```
FB_API_KEY=xxxxxxxxxx
FB_AUTH_DOMAIN=xxxxxxxxxx.firebaseapp.com
FB_DB_URL=https://xxxxxxxxxx.firebaseio.com
```

### Add dummy Items

`node index add`

### Query for nearby Items

`node index query`
