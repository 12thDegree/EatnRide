// ---  NOTES and bits ---
//this could be good for choosing chosen radio buttons and such....
// <input id="length" type="textbox" value="10" size="2" onchange="getLength()" style="background-color:#addfff;"> 


// EDAMAM
// Application ID : dfbb09f0
// This is the application ID, you should send with each API request.
// Application Keys : 91d74ea2e7a999ec6be397ee4bc017ac	—

// Health labels: “vegan”, “vegetarian”, “paleo”, “dairy-free”, “gluten-free”, “wheat-free”, “fat-free”, “low-sugar”, “egg-free”, “peanut-free”, “tree-nut-free”, “soy-free”, “fish-free”, “shellfish-free” (labels are per serving)
// var healthLabels = selectHealth
// var edamEndPoint = "https://api.edamam.com/search";



//AJAX Calls -- individual now, -- should be able to chain in the same click event. 
$(document).ready(function () {
    $('#survey-btn').click(function () {
        let query = $('#foodQuery').val();
        $('#foodQuery').val("");
        let radioSelect = $("input[name='inlineRadioOptions']:checked").val();

        $.ajax({
            url: `https://api.edamam.com/search?q=${query}&healthLabels=${radioSelect}&appid=91d74ea2e7a999ec6be397ee4bc017ac`,
            type: 'GET',
            data: {
                format: 'json'
            },
            success: function (response) {
                $('.recipeResulty').text(`Your recipe is...'${query} is ${response.main.humidity}%`);
            },
            error: function () {
                $('#errors').text("There was an error processing. make do and go for a ride somewhere, back the way you came.");
            }
        });
    });
});

//Google Maps
// API key: AIzaSyA7RRGELPMjrN2TfvvR1MO05lGJXXzMHck

//This is a quick AJAX attempt, the other stuff below I think is the way i have to go. 
$(document).ready(function () {
    $('#survey-btn').click(function () {
        let location = $('#Location').val(); //WHY is location grey? 
        $('#Location').val("");
        let distance = $('#distance'); //why is disntance grey? 

        $.ajax({
            //need real url with real parameters. 
            url: 'https://maps.googleapis.com/maps/api/directions/json?origin=${location}&destination=${location}&avoid=highway&mode=bicycling&key=AIzaSyA7RRGELPMjrN2TfvvR1MO05lGJXXzMHck',
            type: 'GET',
            success: function (response) {
                //jquery div, show map
            },
            error: function () {
                $('#errors').text("There was an error processing. You could always make do and go for a ride somewhere?");
            }
        });
    });
});



//... MAKE THE ROUTE ................................................
//Stuff for integration with the RouteLoops engine
var RlUrl;
var RLroutes = [];
var myText;
//...........................................................................
var targetLengthInMeters; //This one is adjusted by the scale factor to try and zero in on the length you want.
var fixedPoints = new Array;

//............... Functions to Build the Route  ................................................
function getRLpoints() {
    // if (pitchMarker) pitchMarker.setMap(null);
  
    if (fixedPoints.length > 0)
      fixedPointRoute(targetLengthInMeters);
    else {
        //alert("Circle route while pickOne = " + pickOne);
        circleRoute(targetLengthInMeters);
      }
    return;
}
//........................................................................
function circleRoute(length) {

    //alert("Doing a circular route");
  
    var radius = length / 2 / Math.PI;
    //log ("The radius of the circle is " + radius);
    var circlePoints = 4;
    var deg = [];
  
    //Choose a direction for this value
    if (travelHeading == 0)
      var direction = Math.random() * 2 * Math.PI;  //in radians
    else if (travelHeading == 1) //this is North
      var direction = Math.random() * Math.PI / 4 + 3 * Math.PI / 8;
    else if (travelHeading == 2) //this is Northeast
      var direction = Math.random() * Math.PI / 4 + 1 * Math.PI / 8;
    else if (travelHeading == 3) //this is East
      var direction = Math.random() * Math.PI / 4 - Math.PI / 8;
    else if (travelHeading == 4) //this is Southeast
      var direction = Math.random() * Math.PI / 4 + 13 * Math.PI / 8;
    else if (travelHeading == 5) //this is South
      var direction = Math.random() * Math.PI / 4 + 11 * Math.PI / 8;
    else if (travelHeading == 6) //this is Southwest
      var direction = Math.random() * Math.PI / 4 + 9 * Math.PI / 8;
    else if (travelHeading == 7) //this is West
      var direction = Math.random() * Math.PI / 4 + 7 * Math.PI / 8;
    else if (travelHeading == 8) //this is Northwest
      var direction = Math.random() * Math.PI / 4 + 5 * Math.PI / 8;
    //log("The direction of this point with be at " + direction*180/Math.PI + " degrees.");
  
    //Locate the point that is radius meters away from the Base Location in the direction chosen.
    //length assumed in meters, and then deltas in degrees.
    var dx = radius * Math.cos(direction);
    var dy = radius * Math.sin(direction);
    var delta_lat = dy / 110540;
    var delta_lng = dx / (111320 * Math.cos(BaseLocation.lat() * Math.PI / 180));
    center = new google.maps.LatLng(BaseLocation.lat() + delta_lat, BaseLocation.lng() + delta_lng);
    //log(" The center point will be at " + center);
    //placeMarker(center,'Circle Center');
  
    //Find circlePoints other points to use
    //First, call the initial direction direction+180, since we are looking in the opposite direction.
    deg[0] = direction + Math.PI;
    if (travelDirection == 0)//Clockwise
      var sign = -1;
    else
      var sign = +1;
  
    for (var i = 1; i < circlePoints + 1; i++) {
      deg[i] = deg[i - 1] + sign * 2 * Math.PI / (circlePoints + 1);
      dx = radius * Math.cos(deg[i]);
      dy = radius * Math.sin(deg[i]);
      delta_lat = dy / 110540;
      delta_lng = dx / (111320 * Math.cos(center.lat() * Math.PI / 180));
      rlPoints[i - 1] = new google.maps.LatLng(center.lat() + delta_lat, center.lng() + delta_lng);
      //placeMarker(pts[i-1],'p'+i);
    }
  }


//............................................................................
function getLength() {

    var length = document.getElementById("length").value;
    requestedLengthInMeters = length;
    targetLengthInMeters = length;
    document.getElementById("GoButton").innerHTML = "Create a Route of this Length";
  
    resetScale();
  
    return;
  }

//....................................................................
function resetScale() {
    scaleCount = 0;
    scaleFactor = 0.80;
    tooLong = 0;
    tooShort = 0;
    return;
  }

//.....................................................................................
function calcRoute() {

    if (rlPoints.length == 0) return;  //There is no reason to be here, yet.  You might have gotten here because people were changing Settings.
  
    countCalcs++;
  
    if (document.getElementById("unitSystem").value == 0)
      var units = google.maps.DirectionsUnitSystem.IMPERIAL;
    else if (document.getElementById("unitSystem").value == 1)
      var units = google.maps.DirectionsUnitSystem.METRIC;
  
    var wpts = [];
    for (var i = 0; i < rlPoints.length; i++) {
      wpts.push({
        location: rlPoints[i],
        stopover: false
      });
    }
    //alert("Wpts length is :"+wpts.length);
  
    travelMode = bicycling;
    travelDirection = document.getElementById("travelDirection").value;
    travelHeading = document.getElementById("travelHeading").value;
  
    var avoidHighways = true;
  
    var gTravelMode = google.maps.DirectionsTravelMode.BICYCLING;
    
  
    // Keep a record of the requests that are made. Swap to FIREBASE
    var storage;
    storage = "Base=" + BaseLocation.lat() + ":" + BaseLocation.lng();
    storage = storage + "&tM=" + travelMode;
    storage = storage + "&len=" + document.getElementById("length").value;
    storage = storage + "&unitS=" + document.getElementById("unitSystem").value;
    storage = storage + "&address=" + document.getElementById("address").value;
    storage = storage + "&function=calcRoute";
    //$.post("write_data.php?"+storage);
  
    var fromHere = BaseLocation;
    var toHere = BaseLocation;
  
    var request = {
      origin: fromHere,
      destination: toHere,
      waypoints: wpts,
      travelMode: gTravelMode,
      avoidHighways: avoidHighways,
      unitSystem: units
    };
  
    directionsService.route(request, examineRoute);
  
    return;
  }

//.......................................................................................


//lkasjhdfl;ksjdaf ooisdaufo;aisfd