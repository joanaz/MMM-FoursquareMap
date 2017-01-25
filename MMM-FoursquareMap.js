/* global Module */

/* Magic Mirror
 * Module: MMM-FoursquareMap
 *
 * 
 * MIT Licensed.
 */

Module.register('MMM-FoursquareMap', {

  defaults: {},

  start: function() {
    Log.info('Starting module: ' + this.name);
    this.places = []
    this.sendSocketNotification('START', {});
  },

  getStyles: function() {
    return [
      "MMM-FoursquareMap.css",
    ]
  },

  getScripts: function() {
    return [
      "GoogleMap.js",
      // "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"
    ]
  },

  socketNotificationReceived: function(notification, payload) {
    Log.info(this.name + "received a socket notification:\n" + notification);
    if (notification === "CHECKINS") {
      this.places = payload.map(item => new google.maps.LatLng(item.lat, item.lng)).slice(0, 9)
      this.updateDom()
    }
  },

  initMap: function(el) {
    if (this.places.length > 0) {
      // Create a map and center it on Manhattan.
      var ORIGIN = {
        lat: 40.739932,
        lng: -74.001130
      }

      var map = new google.maps.Map(el, {
        zoom: 15,
        center: {
          lat: ORIGIN.lat,
          lng: ORIGIN.lng
        }
      });

      // Instantiate a directions service.
      var directionsService = new google.maps.DirectionsService;

      // Create a renderer for directions and bind it to the map.
      var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
      });

      // Display the route between the initial start and end selections.
      this.calculateAndDisplayRoute(directionsDisplay, directionsService);
    }
  },

  calculateAndDisplayRoute: function(directionsDisplay, directionsService) {
    var waypoints = []
    for (let i = 1; i < this.places.length - 1; i++) {
      waypoints.push({
        location: this.places[i],
        stopover: true
      })
    }

    // Retrieve the start and end locations and create a DirectionsRequest using
    // WALKING directions.
    directionsService.route({
      origin: this.places[0],
      destination: this.places[this.places.length - 1],
      waypoints: waypoints,
      travelMode: 'WALKING'
    }, function(response, status) {
      // Route the directions
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  },

  getDom: function() {
    wrapper = document.createElement("div");
    wrapper.className = 'map';
    this.initMap(wrapper)
    return wrapper;
  }
});