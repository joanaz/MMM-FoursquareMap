/* global Module */

/* Magic Mirror
 * Module: MMM-Smile
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
      // "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
    ]
  },
  getScripts: function() {
    return [
      "GoogleMap.js"
      // "https://maps.googleapis.com/maps/api/js?key=AIzaSyD07hzlSwL-K-HYH2n8AB9-Ez7gPzxTMls"
    ]
  },

  // // Override socket notification handler.
  socketNotificationReceived: function(notification, payload) {
    Log.info(this.name + "received a socket notification:\n" + notification);
    var self = this
    if (notification === "RESULT") {
      this.places = payload.map(item => new google.maps.LatLng(item.lat, item.lng))
        // Log.info(this.places)

      this.updateDom()
    }

  },

  initMap: function(el) {
    if (this.places.length > 0) {
      var ORIGIN = {
        lat: 40.739932,
        lng: -74.001130
      }

      var markerArray = []

      // Create a map and center it on Manhattan.
      var map = new google.maps.Map(el, {
        zoom: 15,
        center: {
          lat: ORIGIN.lat,
          lng: ORIGIN.lng
        }
      });


      // Display the route between the initial start and end selections.

      // Instantiate a directions service.
      var directionsService = new google.maps.DirectionsService;
      // Create a renderer for directions and bind it to the map.
      var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
      });

      // Instantiate an info window to hold step text.
      var stepDisplay = new google.maps.InfoWindow;
      this.calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);

    }
  },

  calculateAndDisplayRoute: function(directionsDisplay, directionsService,
    markerArray, stepDisplay, map) {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }
    var self = this
    var waypoints = []
    for (var i = 1; i < this.places.length - 1; i++) {
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
      // Route the directions and pass the response to a function to create
      // markers for each step.
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        // self.showSteps(response, markerArray, stepDisplay, map);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  },

  showSteps: function(directionResult, markerArray, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {

      var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;

      // Log.info(map)

      marker.setMap(map);
      marker.setPosition(myRoute.steps[i].start_location);
      this.attachInstructionText(
        stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
  },

  attachInstructionText: function(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function() {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  },

  getDom: function() {
    Log.info("hello")
    wrapper = document.createElement("div");
    wrapper.className = 'thin large bright map';
    this.initMap(wrapper)
    return wrapper;
  }
});