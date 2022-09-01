# Norwegian Coast API

[API Documentation](https://wiki.barentswatch.net/display/BO/AIS)

To use their service, you must create an account and an access_token.

To do this with cURL in Linux, use this command:

The main parameters to substitute would be `DIN KLIENT` and `DIN SECRET`. To find/create these values, go here:

[My page - BarentsWatch](https://www.barentswatch.no/minside/)

After that, scroll down and you should find the `API access (for developers)` option. Click on that and you should find `My clients`. From here, you can create new clients and for each client, you can create new client secrets. Replace `DIN KLIENT` with a `Client ID` and replace `DIN SECRET` with a `Client secret` that you have created.

```
curl -X POST https://id.barentswatch.no/connect/token \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=DIN KLIENT' \
--data-urlencode 'client_secret=DIN SECRET' \
--data-urlencode 'scope=ais' \
--data-urlencode 'grant_type=client_credentials'
```

For Windows:
```
curl -X POST https://id.barentswatch.no/connect/token -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "client_id=DIN KLIENT" --data-urlencode "client_secret=DIN SECRET" --data-urlencode "scope=ais" --data-urlencode "grant_type=client_credentials"
```

After you've created your access_token, you can call the endpoints with these cURL commands by replacing `DITT ACCESS_TOKEN`:

Linux:
```
curl 'https://live.ais.barentswatch.no/v1/ais' -H 'Authorization: bearer DITT ACCESS_TOKEN'
```

Windows:
```
curl "https://live.ais.barentswatch.no/v1/ais" -H "Authorization: bearer DITT ACCESS_TOKEN"
```

## Translating cURL command into JavaScript

### Getting the access_token
- -X POST https://id.barentswatch.no/connect/token - Sending a POST request
- Content-Type: application/x-www-form-urlencoded
- client_id: DIN KLIENT
- client_secret: DIN SECRET
- scope: ais
- grant_type: client_credentials

### Getting AIS Data Stream
- curl "https://live.ais.barentswatch.no/v1/ais" - Sending a GET request (cURL default if no HTTP method is defined)
- Authorization: bearer DITT ACCESS_TOKEN

Using an online cURL converter, these commands are generated:

Getting access_token:
```javascript
fetch('https://id.barentswatch.no/connect/token', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'client_id=DIN KLIENT&client_secret=DIN SECRET&scope=ais&grant_type=client_credentials'
});
```

Getting AIS Data Stream:
```javascript
fetch('https://live.ais.barentswatch.no/v1/ais', {
    headers: {
        'Authorization': 'bearer DITT ACCESS_TOKEN'
    }
});
```

---

## JSON

Example of a JavaScript object literal:
```javascript
let pos = {
    lat: -45,
    long: 112
};
```

JSON data is written in a similar format. However, property names have to be in quotes.

```json
{
    "lat": -45,
    "long": 112
}
```

## APIs
- Endpoints - Basically URLs to send requests to