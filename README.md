# MMM-FoursquareMap
This is an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It maps a user's Foursquare checkins.


## Tokens

Get your Foursquare access token [here](https://developer.foursquare.com/).

Get your Google Maps API key [here](https://developers.google.com/maps/documentation/javascript/).

Create a keys.json, save your Foursquare access token and Google Maps API key in it like this:

```Javascript
{
  "foursquare_access_token": "YOUR FOURSQUARE ACCESS TOKEN",
  "google_maps_api_key": "YOUR GOOGLE MAPS API KEY"
}
```


## Usage

The entry in config.js can look like the following. (NOTE: You only have to add the variables to config if want to change its standard value.)

```
{
	module: 'MMM-FoursquareMap',
    position: "middle_center",
	config: {}
}
```

Note: only the last 10 places you checked in will be displayed. The Google Maps API will return a "ZERO_RESULTS" error if the first place and the last place can't be reached through walking.
