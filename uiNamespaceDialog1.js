'use strict';

/**
 * UINamespace Sample Extension
 *
 * This is the popup extension portion of the UINamespace sample, please see
 * uiNamespace.js in addition to this for context.  This extension is
 * responsible for collecting configuration settings from the user and communicating
 * that info back to the parent extension.
 *
 * This sample demonstrates two ways to do that:
 *   1) The suggested and most common method is to store the information
 *      via the settings namespace.  The parent can subscribe to notifications when
 *      the settings are updated, and collect the new info accordingly.
 *   2) The popup extension can receive and send a string payload via the open
 *      and close payloads of initializeDialogAsync and closeDialog methods.  This is useful
 *      for information that does not need to be persisted into settings.
 */

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {
  /**
   * This extension collects the IDs of each datasource the user is interested in
   * and stores this information in settings when the popup is closed.
   */
  const datasourcesSettingsKey = 'selectedDatasources';
  let selectedDatasources = [];

  $(document).ready(function () {
    // The only difference between an extension in a dashboard and an extension
    // running in a popup is that the popup extension must use the method
    // initializeDialogAsync instead of initializeAsync for initialization.
    // This has no affect on the development of the extension but is used internally.
    tableau.extensions.initializeDialogAsync().then(function (openPayload) {
      // The openPayload sent from the parent extension in this sample is the
      // default time interval for the refreshes.  This could alternatively be stored
      // in settings, but is used in this sample to demonstrate open and close payloads.
      $('#interval').val(openPayload);
      $('#closeButton').click(closeDialog);

      let dashboard = tableau.extensions.dashboardContent.dashboard;
      let visibleDatasources = [];
      selectedDatasources = parseSettingsForActiveDataSources();

      // Loop through datasources in this sheet and create a checkbox UI
      // element for each one.  The existing settings are used to
      // determine whether a datasource is checked by default or not.
      dashboard.worksheets.forEach(function (worksheet) {
        worksheet.getSummaryDataAsync().then(function (sumdata) {

          const worksheetData = sumdata;
          // The getSummaryDataAsync() method returns a DataTable
          // Map the DataTable (worksheetData) into a format for display, etc.
        console.log(worksheetData._data[0][0]._value, Math.round(worksheetData._data[0][1]._value));
            
        
                createGauges(worksheetData);
                buildSumDataTable(worksheetData);
              
         });
    
      });
    });
  });

  /**
   * Helper that parses the settings from the settings namesapce and
   * returns a list of IDs of the datasources that were previously
   * selected by the user.
   */
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
})();
