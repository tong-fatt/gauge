(function(){
    'use strict';
    const defaultIntervalInMin = '15';
    let activeDatasourceIdList = [];
    let config = [];
    let lastSetting = ''
$(document).ready(function(){

    // hook up an event handler for the load button click
    // wait to initialize until the button is clicked

    // $("#initializeButton").click(function(){
      $(document).ready(function () {

        //disable the buttion after it has been clicked
        // $("initializeButton").prop('disabled', true);
tableau.extensions.initializeAsync({'configure': configure}).then(function(){


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
            
            console.log('createGauges worksheet: ' + JSON.stringify(config.gaugeSettings));
                buildSumDataTable(worksheetData);


          tableau.extensions.settings.addEventListener(tableau.TableauEventType.SettingsChanged, (settingsEvent) => {
            console.log('initial config1:' + settingsEvent._newSettings.gaugeSettings);
            createGauges(worksheetData, settingsEvent._newSettings.gaugeSettings);
        }); 
  
			
 });
    

});
       // This event allows for the parent extension and popup extension to keep their
      // settings in sync.  This event will be triggered any time a setting is
      // changed for this extension, in the parent or popup (i.e. when settings.saveAsync is called).
      // tableau.extensions.settings.addEventListener(tableau.TableauEventType.SettingsChanged, (settingsEvent) => {
     
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
    $('th').css({"font-size": "200%", "font-weight": "bold"});
    $('td').css({"font-size":"200%"});
  }


  function configure () {
    // This uses the window.location.origin property to retrieve the scheme, hostname, and
    // port where the parent extension is currently running, so this string doesn't have
    // to be updated if the extension is deployed to a new location.
    const popupUrl = `${window.location.origin}/gg-like-gauge/gaugeDialog.html`;

    /**
     * This is the API call that actually displays the popup extension to the user.  The
     * popup is always a modal dialog.  The only required parameter is the URL of the popup,
     * which must be the same domain, port, and scheme as the parent extension.
     *
     * The developer can optionally control the initial size of the extension by passing in
     * an object with height and width properties.  The developer can also pass a string as the
     * 'initial' payload to the popup extension.  This payload is made available immediately to
     * the popup extension.  In this example, the value '5' is passed, which will serve as the
     * default interval of refresh.
     */
    tableau.extensions.ui.displayDialogAsync(popupUrl, lastSetting, { height: 500, width: 1200 }).then((closePayload) => {
      // The promise is resolved when the dialog has been expectedly closed, meaning that
      // the popup extension has called tableau.extensions.ui.closeDialog.
      $('#inactive').hide();
      $('#active').show();
      console.log('getAll settings:' + tableau.extensions.settings.getAll().gaugeSettings);
      lastSetting = tableau.extensions.settings.getAll().gaugeSettings;
     
      
    }).catch((error) => {
      // One expected error condition is when the popup is closed by the user (meaning the user
      // clicks the 'X' in the top right of the dialog).  This can be checked for like so:
      switch (error.errorCode) {
        case tableau.ErrorCodes.DialogClosedByUser:
          console.log('Dialog was closed by user');
          break;
        default:
          console.error(error.message);
      }
    });
  }

  
  /**
   * Helper that is called to set state anytime the settings are changed.
   */
  function updateExtensionBasedOnSettings (settings) {
    // var config
    console.log('settings changed: ' + settings.gaugeSettings)
    if (settings.gaugeSettings) {
      
      config = settings.gaugeSettings;
    
      console.log('configg: ' + config);}
  
   returns }

})();