//Initiate Maps
function initMap(){
    // Creates Map
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: {lat: 38.5585, lng: -121.4218}
    });

    //Create Directions service object to use the route method and get a result for request
    directionsService = new google.maps.DirectionsService();

    //Create Directinos renderer object which we will use to display the route
    directionsDisplay = new google.maps.DirectionsRenderer();

    //Bind the directionsRendere to the map
    directionsDisplay.setMap(map);

    //create autocomplete objects for all inputs
    var options = {
        componentRestrictions: {'country': ['us']},
        fields: ['geometry', 'name'],
        types: ['establishment']
    }

    var input1 = document.getElementById("origin");
    autocomplete1 = autoCom(input1, options);

    var input2 = document.getElementById("destinations");
    autocomplete2 = autoCom(input2, options);
}

//Function creates the autocomplete function when user enters text
function autoCom(input, options){
    var input = new google.maps.places.Autocomplete(input, options);
    return input;
}

// Creates a global variable named waypoints
let waypoints = [];
let setTime = [];

//Function allows user to add waypoints on google maps 
function addWayPoint(){

    var address = document.getElementById("destinations").value;
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': address}, function (results, status){
        if(status == google.maps.GeocoderStatus.OK && results.length > 0){
            address = results[0].formatted_address;

            waypoints.push({
                location: address,
                stopover: true
            });
            document.getElementById("output2").innerHTML = "";
        }else{
            document.getElementById("output2").innerHTML = "<span style='color:red;'>Please enter a valid destination address</span>"
        }
    })


    var settingTime = new Date();
    startTime = document.getElementById("setTime");

    if(startTime.value === ""){
        //output3.innerHTML = "Please enter a set time for this address." 
        document.getElementById("output3").innerHTML = "<span style='color:red;'>Please enter a set time for this address</span>"
    }else{
        //Splits hours and minutes
        var timeSplit = startTime.value.split(':'), hours, minutes;
        hours = timeSplit[0];
        minutes = timeSplit[1];

        //Assigns the Date object settingTime with the hours and minutes given to it
        settingTime.setHours(hours, minutes);

        setTime.push(settingTime);
        document.getElementById("output3").innerHTML = "";
    }
}

//Function used to display the array of waypoints in the console to check if the 
//array contains the right waypoints
function listPoints(){
    document.getElementById("popup-1").classList.toggle("active");

    //priorityCalc();

    var points = waypoints;

    const list = document.querySelector(".list-content ul");
    list.innerHTML = "";

    for(let i = 0; i < points.length; i++){
        const myList = document.createElement("li");
        const address = document.createElement("button");
        address.id = "address" + [i];

        //Creates a save button for each button with their own individual ids
        const save = document.createElement("button");
        save.innerHTML = "Save";
        save.id = "save-button" + [i];

        //Creates a delete button for each button with their own individual ids
        const erase = document.createElement("button");
        erase.innerHTML = "Delete";
        erase.id = "delete-button" + [i];

        myList.innerHTML = points[i].location;
        address.innerText = myList.innerText;
        address.className = "button-list";
        
        list.appendChild(address);
        list.appendChild(save);
        list.appendChild(erase);

        document.getElementById("delete-button" + [i]).addEventListener("click", function() {
            deleteData(i, points.length);
        });
        document.getElementById("save-button" + [i]).addEventListener("click", function() {
            saveData(i, points.length);
        });
    }
    
    //SOME DEBUG CODE
    //console.log(remove);
    //console.log(list);
    //console.log(list.innerText);

    //var items = document.querySelector("button");
    //console.log(items);
    //var items2 = items.getElementsByTagName("button");
    //console.log(items2);

}

//Function will allow user to delete waypoints from the array
function deleteData(num, total){
    deleteButton = document.getElementById("delete-button" + num);
    saveButton = document.getElementById("save-button" + num);
    address = document.getElementById("address" + num);

    address.style.display = "none";
    address.remove();

    saveButton.style.display = "none";
    saveButton.remove();

    deleteButton.style.display = "none";
    deleteButton.remove();

    //priortizeWaypoints[num].newWaypoints.splice(num,1);

    //TEMPORARY FIX. 
    waypoints.splice(num,1);
    //if(waypoints === null || typeof waypoints === 'undefined'){
    priortizeWaypoints.splice(num,1);
    //}
    
}

//WORK IN PROGRESS
//Function will save Addresses for future use. Client wants to be able to save addresses
//for places that will frequently be part of their program.
function saveData(num, total){
    console.log("Save the world");

    saveButton = document.getElementById("save-button" + num);
    address = document.getElementById("address" + num);

    localStorage.setItem("address" + num, address.innerText);
}

function getEndPoint(){
    let endPoint = priortizeWaypoints;

    if(endPoint.newWaypoints === 0 || endPoint.newWaypoints === null || endPoint.length === 0){
        return document.getElementById("destinations").value = "";
    }else{
        endPoint = priortizeWaypoints[priortizeWaypoints.length - 1].newWaypoints;
        //endPoint = endPoint.pop();
        return endPoint.location;
    }
}

function copyWaypoints(){
    var newArray = [];
    for(let i =0; i < priortizeWaypoints.length; i++){
        //console.log(priortizeWaypoints);
        newArray[i] = priortizeWaypoints[i].newWaypoints;
    }
    return newArray;
}

function sortFunction(a,b){
    if(a[0] === b[0]){
        return 0;
    }else{
        return (a[0] < b[0]) ? -1:1
    }
}

//
let priortizeWaypoints = [];

function priorityCalc(){
    var timeLeft = [];

    var curTime = new Date();
    
    for(let i = 0; i<setTime.length; i++){

        var timeDif = new Date();
        var curHours = 2 + setTime[i].getHours() - curTime.getHours();
        var curMinutes = setTime[i].getMinutes() - curTime.getMinutes();


        if(curHours < 0 && curHours.toString.length == 1){
            curHours = "-0" + Math.abs(curHours);
        }
        if(curMinutes < 0 && curHours > 0){
            curHours = curHours - 1;
            curMinutes = 60 + curMinutes;
        }
        if(curMinutes < 0 && curHours < 0){
            curMinutes = Math.abs(curMinutes);
        }
        if(curHours < 10 && curHours >= 0){
            curHours = "0" + curHours;
        }
        if(curMinutes < 10 && curMinutes >= 0){
            curMinutes = "0" + curMinutes;
        }

        timeDif.setHours(curHours, curMinutes);

        timeLeft.push(timeDif);
    }

    priortizeWaypoints.length = 0;

    for(let i = 0; i < waypoints.length; i++){    

        if(waypoints[i] === null || waypoints[i] === "" || typeof waypoints[i] === 'undefined' || timeLeft[i] === "" || timeLeft[i] === null || typeof timeLeft[i] === 'undefined'){
            console.log("Something is empty or undefined.");

            document.getElementById("output").innerHTML = "<span style='color:red;'>Please enter a Destination.</span>"
            directionsDisplay.setDirections({ routes: []});
        }else{
            priortizeWaypoints.push({
                newWaypoints: waypoints[i],
                remainingTime: timeLeft[i],
                address: address_array[i],
                food_type: food_type_array[i],
                food_group:food_group_array[i],
                perishable:perishable_array[i],
                spoil_date: spoil_date_array[i],
                food_quantity: food_quantity_array[i],
                market_value: market_value_array[i],
                milk: milk_array[i],
                eggs: eggs_array[i],
                tree_nuts: tree_nuts_array[i],
                peanuts: peanuts_array[i],
                shellfish: shellfish_array[i],
                wheat: wheat_array[i],
                soybeans: soybeans_array[i],
                set_time: set_time_array[i],
                meridian: meridian_array[i],
            });
        }
    }
    priortizeWaypoints.sort((a,b) => a.remainingTime - b.remainingTime);
    console.log(priortizeWaypoints);
}

//Function used to Calculate a route from Beginning to End with waypoints in between
function calcRoute(){
    priorityCalc();
    var points = copyWaypoints();

    var endPoint = getEndPoint();

    //create request
    if(points.length === 0){
        var request={
            origin: document.getElementById("origin").value,
            destination: endPoint,
            travelMode: google.maps.TravelMode.DRIVING, //can change to walk or bicycle
        }
    }else{
        points.splice(-1);
        var request={
            origin: document.getElementById("origin").value,
            destination: endPoint,
            waypoints: points,
            //optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING, //can change to walk or bicycle
        }
        //SOME DEBUG TEST CODE
        //console.log(request.destination);
        //console.log(request.waypoints[waypoints.length-1].location);
        //console.log(request.waypoints.location);    
    }

    //console.log(origin);
    //console.log(waypoints);

    //pass request to route method
    directionsService.route(request, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
            //get distance and time
            const output = document.querySelector('#output');

            var total_distance = 0;
            var total_duration = 0;
            leg_parts = result.routes[0];
    
            //Calculates distance and time for each leg. For example, a leg is from route A to B.
            //This function will calculate total distance and time from A to B to C, and etc.
            for(let i = 0; i < leg_parts.legs.length; i++){
                total_distance += leg_parts.legs[i].distance.value;
                total_duration += leg_parts.legs[i].duration.value;
            }
            
            total_distance = (total_distance/1609).toFixed(2);  //convert to miles from meters
            total_duration = Math.trunc(total_duration/60);     //convert to minutes from seconds
            output.innerHTML = "<div class='alert-info'> From: " + document.getElementById("origin").value + ".<br />To: " 
                                    + request.destination + ". <br /> Driving distance: " + total_distance + " miles" + ". <br /> Duration: "
                                    + total_duration + " minutes" + ". </div>";

            //display route
            directionsDisplay.setDirections(result);
        }else{
            //delete route from map
            directionsDisplay.setDirections({ routes: []});

            //show error message
            document.getElementById("output").innerHTML = "<span style='color:red;'>Please fill out all the forms correctly.</span>"
        }
    });
}
