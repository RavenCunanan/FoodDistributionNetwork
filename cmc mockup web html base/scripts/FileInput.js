let additional_points = 0;
/**
 * 
 * @param {*} e 
 */
function handle_form(e) {
    e.preventDefault();

    let foodType = $("#food-type-input").val()
    let foodGroup = $("#food-group-input").val()
    let perishable = $("#perishable-input").val()
    let spoilDate = $("#spoil-date-input").val()
    let foodQuantity = $("#food-quantity-input").val()
    let foodVolume = $("#food-volume-input").val()
    let marketValue = $("#market-value-input").val()
    
    let req = {
        "foodType": foodType,
        "foodGroup": foodGroup,
        "perishable": perishable,
        "spoilDate": spoilDate,
        "foodQuantity": foodQuantity,
        "foodVolume": foodVolume,
        "marketValue": marketValue
    }
    
    axios.post("/submit", req).then(res => {
        // actions to take on success
    });
    
}

/**
 * 
 * @param {*} e 
 */
/*
function process_file(e) {
    // process the file
}
*/

//Arrays for variables
let food_type_array = [];
let food_group_array = [];
let perishable_array = [];
let spoil_date_array = [];
let food_quantity_array = [];
let market_value_array = [];
let milk_array = [];
let eggs_array = [];
let tree_nuts_array = [];
let peanuts_array = [];
let shellfish_array = [];
let wheat_array = [];
let soybeans_array = [];
let set_time_array = [];
let meridian_array = [];
let address_array = [];
//Parse
let selectedFile;
//Accepts the file
document.getElementById("uploadfile").addEventListener("change", (event) => {
    selectedFile = event.target.files[0]
})
//Starts reading the file when user clicks the Submit button
document.getElementById("submitFile").addEventListener("click", () => {
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) =>{
        //console.log(event.target.result);
        let data = event.target.result;
        let workbook = XLSX.read(data, {type:"binary", cellDates:true, dateNF:"mm/dd/yyyy;@"});
        //console.log(workbook);

        workbook.SheetNames.forEach(sheet => {
            let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
            console.log(rowObject);

            //Will iterate over the stored values and take those with the Address header and insert it into waypoint
            //waypoint is a global variable used to create waypoints on the google maps api.
            for(let i =0; i<rowObject.length; i++){
                document.getElementById("destinations").value = rowObject[i].Address;
                var newTime = amPM(rowObject[i].SetTime, rowObject[i].Meridian);
                document.getElementById("setTime").value = newTime;
                addWayPoint();
        
                /*
                store variables into different arrays so
                that we can rearrange the variables when
                determining which location has the earliest set time
                in app.js
                */
                address_array[i] = rowObject[i].Address;
                food_type_array[i] = rowObject[i].FoodType;               
                food_group_array[i] = rowObject[i].FoodGroup;           
                perishable_array[i] = rowObject[i].Perishable;           
                spoil_date_array[i] = rowObject[i].SpoilDate;          
                food_quantity_array[i] = rowObject[i].Quantity;          
                market_value_array[i] = rowObject[i].Value;         
                milk_array[i] = rowObject[i].Milk;       
                eggs_array[i] = rowObject[i].Eggs;       
                tree_nuts_array[i] = rowObject[i].TreeNuts;
                peanuts_array[i] = rowObject[i].Peanuts;   
                shellfish_array[i] = rowObject[i].Shellfish;
                wheat_array[i] = rowObject[i].Wheat;
                soybeans_array[i] = rowObject[i].Soybeans;
                set_time_array[i] = rowObject[i].SetTime;
                meridian_array[i] = rowObject[i].Meridian;  
            }   
        })
        
    }
})

//Converts users given time from csv/xlsx into a common time that is able
//to be read by javascript.
function amPM(time, meridian){
    var newTime = "";
    var timeSplit = time.split(':'), hours, minutes;
    hours = timeSplit[0];
    minutes = timeSplit[1];

    if(meridian === "AM"){
        return time.setTime;
    }
    if(meridian === "PM"){
        hours = parseInt(hours) + 12;
        newTime = hours.toString() + ':' + minutes;
        return newTime;
    }
}


/**
 * 
 * @param {*} e 
 */
function add_more_points(e) {
    $(`#gmap-input-${additional_points}`).unbind("change", add_more_points)
    $(`#gmap-input-${additional_points}`).after(`
        <label for="gmap-input-${additional_points}">Additional Location</label>
        <input type="text" id="gmap-input-${additional_points+1}"  onchange="add_more_points()"/>
    `);
    additional_points++;
}

$("form").submit(handle_form);
$(`#gmap-input-${additional_points}`).change(add_more_points)
/* $("input[type=file]").on("change", process_file) */
