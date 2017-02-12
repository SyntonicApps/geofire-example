require('dotenv').config();

const GeoFire = require('geofire');
const firebase = require('firebase');

var config = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    databaseURL: process.env.FB_DB_URL
};
firebase.initializeApp(config);

/**
 * Creates a random latitude & longitude pair
 * @return {Array}
 */
function getRandomCoords() {
    var lat = (Math.random() * 90).toFixed(5);
    lat *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;

    var lon = (Math.random() * 180).toFixed(5);
    lon *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;

    return [lat, lon];
}

/**
 * Creates an 'Item' object in Firebase Database
 */
function addItem() {
    var database = firebase.database(); // Ref to Firebase Database
    var itemRef = database.ref('items'); // Ref to 'Item' table
    var geoFire = new GeoFire(database.ref('items_locations')); // Ref to 'Item Locations' table

    // Add new item to Firebase Database
    var newItemRef = itemRef.push();
    var coords = getRandomCoords();
    var name = Math.random().toString(36).substring(10);
    newItemRef.set({
        location: coords,
        name: name
    }).then(() => {
        console.log(`Item added with name: ${name}`);

        // Set GeoFire location for the new item
        geoFire.set(newItemRef.key, coords).then(() => {
            console.log(`Set location for Item with name ${name}`);
        });
    });
}

/**
 * Add a bunch of items
 */
function addItems() {
    for (let i = 0; i < 100; i++) {
        addItem();
    }
}

/**
 * Get nearby 'Item' objects
 */
function getNearbyItems() {
    var database = firebase.database(); // Ref to Firebase Database
    var geoFire = new GeoFire(database.ref('items_locations')); // Ref to 'Item Locations' table

    var center = getRandomCoords();
    var radius = 3000;
    var geoQuery = geoFire.query({
        center: center,
        radius: radius // km
    });

    console.log(`Finding Items near ${center} within ${radius} km`);
    geoQuery.on('key_entered', function(key, location) {
        console.log(`Key entered radius: ${key} with location: ${location}`);
    });
}


/**
 * Use the NodeJS process arguments to perform any requested tasks
 */
var processCLIArgs =  (function() {
    var args = process.argv.slice(2);
    switch (args[0]) {
    case 'add':
        addItems();
        break;
    case 'query':
        getNearbyItems();
        break;
    }
}());
