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
  let configSettings = [];
  let gauge = [];
  const gaugeSettingsKey = 'gaugeSettings';
 
  function GaugeSetting (label){
    var size, min, max, minTick, majTick;
    this.label = label;
    this.size = size;
    this.min = min;
    this.max = max;
    this.minTick = minTick;
    this.majTick = majTick;
  }

  

  $(document).ready(function () {
    
    // The only difference between an extension in a dashboard and an extension
    // running in a popup is that the popup extension must use the method
    // initializeDialogAsync instead of initializeAsync for initialization.
    // This has no affect on the development of the extension but is used internally.
    tableau.extensions.initializeDialogAsync().then(function (openPayload) {
      // The openPayload sent from the parent extension in this sample is the
      // default time interval for the refreshes.  This could alternatively be stored
      // in settings, but is used in this sample to demonstrate open and close payloads.
      // $('#interval').val('120');
      $('#closeButton').click(closeDialog);
      // console.log('openPayload:' + openPayload);
      let dashboard = tableau.extensions.dashboardContent.dashboard;
    //   let visibleDatasources = [];
    //   selectedDatasources = parseSettingsForActiveDataSources();

      // Loop through datasources in this sheet and create a checkbox UI
      // element for each one.  The existing settings are used to
      // determine whether a datasource is checked by default or not.
      dashboard.worksheets.forEach(function (worksheet) {
        worksheet.getSummaryDataAsync().then(function (sumdata) {

          const worksheetData = sumdata;
          // The getSummaryDataAsync() method returns a DataTable
          // Map the DataTable (worksheetData) into a format for display, etc.
        // console.log('diaglog: '+worksheetData._data[0][0]._value, Math.round(worksheetData._data[0][1]._value));
            
        
               
                buildSumDataTable(worksheetData, openPayload);
              
         });
    
      });
    });
  });

  /**
   * Helper that parses the settings from the settings namesapce and
   * returns a list of IDs of the datasources that were previously
   * selected by the user.
   */
  function buildSumDataTable(worksheetData, openPayload){

    // $('#sumDataTable > tbody tr').remove();
    const sumDataTable = $('#sumDataTable > tbody')[0];
    // console.log('sumDataTable: ' + sumDataTable);
    // console.dir(sumDataTable);
  

    // console.log('dialog openPayload: ' + openPayload);
    var curSet = new GaugeSetting();
     for (var i =0; i< worksheetData._data.length; i++){
        var label =  worksheetData._data[i][0]._value;

        if(openPayload[i]) {
          curSet = JSON.parse(openPayload)[i];
        // console.log('openPayLoad: '+ JSON.parse(openPayload)[i]);
        // console.log('curSet: ' + curSet);
        // console.log('curSet oom: ' +curSet.oom)
        };
        var newRow = sumDataTable.insertRow(sumDataTable.rows.length)
        var nameCell = newRow.insertCell(0);
        var sizeCell = newRow.insertCell(1);
        var minCell = newRow.insertCell(2);
        var maxCell = newRow.insertCell(3);
        var minTickCell = newRow.insertCell(4);
        var majTickCell = newRow.insertCell(5);
        var orderOfMCell = newRow.insertCell(6)
    
          nameCell.innerHTML = label;
          $("<input type='number' value = '" + (undefined !=curSet.size ? parseInt(curSet.size) : 220) + "' id='size" + i +"'>").appendTo(sizeCell);
          $("<input type='number' value = '"+ (undefined !=curSet.min ? parseInt(curSet.min) : 0) + "' id='min" + i +"'>").appendTo(minCell);
         $("<input type='number' value = '" + (undefined !=curSet.max ? parseInt(curSet.max) : 100) + "' id='max" + i +"'>").appendTo(maxCell);
         $("<input type='number' value = '" + (undefined !=curSet.minorTicks ? parseInt(curSet.minorTicks) : 10) + "' id='minTick" + i +"'>").appendTo(minTickCell);
         $("<input type='number' value = '" + (undefined !=curSet.majorTicks ? parseInt(curSet.majorTicks) : 11) + "' id='majTick" + i +"'>").appendTo(majTickCell);
         $("<input type='number' value = '" + (undefined !=curSet.oom ? parseInt(curSet.oom) : -2) + "' id='oom" + i +"'>").appendTo(orderOfMCell);
          gauge[i]= new GaugeSetting();
          gauge[i].label= label;
          gauge[i].size = undefined != curSet.size ? parseInt(curSet.size) : 220;
          gauge[i].min = undefined != curSet.min ? parseInt(curSet.min) : 0;
          gauge[i].max = undefined != curSet.max ? parseInt(curSet.max) : 100;
          gauge[i].minorTicks = undefined != curSet.minorTicks ? parseInt(curSet.minorTicks) : 10;
          gauge[i].majorTicks = undefined != curSet.majorTicks ? parseInt(curSet.majorTicks) : 11;
          gauge[i].oom = undefined != curSet.oom ? parseInt(curSet.oom) : -2;
          



  }
    $('th').css({"font-size": "100%", "text-align" : "left","font-weight": "bold"});
    // $('td').css({"font-size":"100%"});
    
    $('input').on('change', function(event){
      var val, label, name, id;
          configSettings.label = []
      val = $(this).val()
      
      // console.log('maxi: ' + val);
      // console.log('eventid: ' + event.target.id.match(/\d+/));
      // console.log('event: ' + event.target.id.match(/\D+/));
      label =$(this).parent().siblings().first().text()
      // console.log('label: ' + label);
      configSettings.label = label;
      name = event.target.id.match(/\D+/) 
      id = event.target.id.match(/\d+/)  
      // console.log('name: '+  name + ', id: ' + id);
      // console.log('gauge[id]: ' + JSON.stringify(gauge[id]));
  
     
      if (name == 'size'){
        gauge[id].size = val; 
      } else if (name == 'min'){
        gauge[id].min = val; 
      } else if (name == 'max'){
        gauge[id].max = val;
      } else if (name == 'minTick'){
        gauge[id].minorTicks = val;
      } else if (name == 'majTick'){
        gauge[id].majorTicks = val;            
      } else {
        gauge[id].oom = val;
      }
      
      
      // configSettings.label.push({ dimension : val})
      // configSettings.label.value = val;
      // console.log('gauge[0]: ' + JSON.stringify(gauge[0]));
      // console.log('gauge[1]: ' + JSON.stringify(gauge[1]));
      // console.log('gauge[2]: ' + JSON.stringify(gauge[2]));
      // console.log('gauges: '+ JSON.stringify(gauge));
      
    })
    
  }

  function closeDialog () {
    
    // console.log('closeDialog: ' + JSON.stringify(gauge));
    tableau.extensions.settings.set(gaugeSettingsKey, JSON.stringify(gauge));

    tableau.extensions.settings.saveAsync().then((newSavedSettings) => {
      tableau.extensions.ui.closeDialog(" ");
      newSavedSettings = JSON.stringify(gauge);
      // console.log('settings saved')
    });
  }
})();
