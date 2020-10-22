(function(){
$(document).ready(function(){

    // hook up an event handler for the load button click
    // wait to initialize until the button is clicked

    // $("#initializeButton").click(function(){
      $(document).ready(function () {

        //disable the buttion after it has been clicked
        // $("initializeButton").prop('disabled', true);

        tableau.extensions.initializeAsync().then(function(){


//  //  After initialization, ask Tableau what sheets are available
    const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
 
    // Find a specific worksheet
    var worksheet = worksheets.find(function (sheet) {
      return sheet.name === "Name of Worksheet I want";
    });

    // Or iterate through the array of worksheets
    worksheets.forEach(function (worksheet) {
      //  process each worksheet...
      // get the summary data for the sheet
 worksheet.getSummaryDataAsync().then(function (sumdata) {

  const worksheetData = sumdata;
  // The getSummaryDataAsync() method returns a DataTable
  // Map the DataTable (worksheetData) into a format for display, etc.
console.log(worksheetData._data[0][0]._value, Math.round(worksheetData._data[0][1]._value));
    

        createGauges(worksheetData);
        buildSumDataTable(worksheetData);
			
 });
    

});
       
        }, function(err){
            //something went wrong in initialization
            $("#resultBox").html("Error while Initializing: " + err.toString());
        });   
    });
});





  function buildSumDataTable(worksheetData){

    $('#sumDataTable > tbody tr').remove();
    const sumDataTable = $('#sumDataTable > tbody')[0];
    console.log('sumDataTable: ' + sumDataTable);
    console.dir(sumDataTable);
  

  for (var i =0; i< worksheetData._data.length; i++){
    var label =  worksheetData._data[i][0]._value, 
        value = (worksheetData._data[i][1]._value*100).toFixed(1); 
        
        var newRow = sumDataTable.insertRow(sumDataTable.rows.length)
        var nameCell = newRow.insertCell(0);
        var valueCell = newRow.insertCell(1);

       nameCell.innerHTML = label;
       valueCell.innerHTML = value;
       console.log('value'+ value);


  }
    $('th').css({"font-size": "100%", "font-weight": "bold"});
    $('td').css({"font-size":"100%"});
  }

})();