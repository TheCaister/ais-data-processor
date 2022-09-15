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

## CORS
If you want to disable CORS, you can check out this extension:

[Moesif Origin & CORS Changer](https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc)

## How to Connect Between Client HTML and Server
On the Node server, you would import modules using require. On the HTML side, you would usually import modules from online sources and CDNs. A good site for pulling modules and script tags would be [cdnjs](https://cdnjs.com/). 

## Features to Potentially Implement
- Plot AIS data on a map (DONE!)
- Store AIS data in database
- Send AIS data off to a Message Queue service like RabbitMQ. Advantages of this include decoupling. Maybe have the server forward AIS data to the queue and have the client pull from it on the other side.
- Pretend that some of the AIS data is plane data. Create a button to toggle them. (DONE!)

### Toggling 
One way of going about this is by creating two overlays groups, one for ships and one for planes. Add them to the layers control and users should just be able to simply toggle them on and off.

How to determine if data is from a ship or a plane?

If we're separating planes and ships, we would of course want to figure out how to distinguish between them. One point to consider is their sources. If they're coming from two databases, separating them will be easy. However, if the ship and plane databases are merged, we would most likely need to check their attributes. Maybe we can add one more attribute - vesselType that can either be set to plane/ship or true/false? This means that more storage space will be taken. We can also check attributes that can only be attributed to certain vessel types. For example, only ships should have values for the MMSI field. Now, we can determine if a vessel is a plane or a ship by checking if the MMSI value is null.

### Refreshing/Limit on Icons
If we keep receiving the AIS stream and we keep plotting them on the map, eventually it'll become overwhelmed. This means we should place a limit on how many markers should be visible on the map. A simple way of doing this is by putting at the markers in a layers group and periodically check its size. Once the size has reached the threshold, clear the group.