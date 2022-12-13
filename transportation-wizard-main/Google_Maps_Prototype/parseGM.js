let selectedFile;
//Accepts the file
document.getElementById("uploadfile").addEventListener("change", (event) => {
    selectedFile = event.target.files[0]
})
//Starts reading the file when user clicks the Submit button
document.getElementById("fileConfirm").addEventListener("click", () => {
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) =>{
        let data = event.target.result;
        let workbook = XLSX.read(data, {type:"binary", cellDates:true, dateNF:"mm/dd/yyyy;@"});

        workbook.SheetNames.forEach(sheet => {
            let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
            console.log(rowObject);

            //Will iterate over the stored values and take those with the Address header and insert it into waypoint
            //waypoint is a global variable used to create waypoints on the google maps api.
            for(let i =0; i<rowObject.length; i++){
                document.getElementById("destinations").value = rowObject[i].Address;
                var newTime = amPM(rowObject[i].SetTime,rowObject[i].Meridian);
                document.getElementById("setTime").value = newTime;
                addTime();
                addWayPoint();
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
