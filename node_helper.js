'use strict';
const NodeHelper = require('node_helper');
const request = require('request')
const KEYS = require('./keys.json')

var today = new Date().toJSON().slice(0, 10).replace(/-/g, '')
var URL = "https://api.foursquare.com/v2/users/self/checkins?oauth_token=" + KEYS.foursquare_access_token + "&v=" + today

module.exports = NodeHelper.create({
  start_map: function() {
    var self = this
    request(URL, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        let r = JSON.parse(body);
        let coords = r.response.checkins.items.map((item) => ({
          lat: item.venue.location.lat,
          lng: item.venue.location.lng
        }))

        self.sendSocketNotification("CHECKINS", coords);
      }
    })
  },

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'START') {
      this.start_map();
    }
  }
});