// Flavourlist data array for filling in info box
var flavourListData = [];
var idInEditing = '';

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the flavour table on initial page load
  populateTable();

  // flavour_name link click
  $('#flavourList table tbody').on('click', 'td a.linkshowflavour', showFlavourInfo);
  // Add Flavour button click
  $('#btnAddFlavour').on('click', addFlavour);
  // Edit Flavour link click
  $('#flavourList table tbody').on('click', 'td a.linkeditflavour', editFlavour);
  // Delete Flavour link click
  $('#flavourList table tbody').on('click', 'td a.linkdeleteflavour', deleteFlavour);
  // Edit Tub link click
  $('#flavourHistory table tbody').on('click', 'td a.linkedittub', editTub);
  // Delete Tub link click
  $('#flavourHistory table tbody').on('click', 'td a.linkdeletetub', deleteTub);
  // Open Tub button click
  $('#btnOpenTub').on('click', openTub);
  // Close Tub button click
  $('#btnCloseTub').on('click', closeTub);

});

// Functions =============================================================

// Fill flavour list table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/flavours/flavourlist', function( data ) {

    // Stick our flavour data array into a flavourlist variable in the global object
    flavourListData = data;

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowflavour" rel="' + this.flavour_name + '">' + this.flavour_name + '</a></td>';
      tableContent += '<td>' + this.supplier + '</td>';
      tableContent += '<td><a href="#" class="linkeditflavour" rel="' + this._id + '">edit</a></td>';
      tableContent += '<td><a href="#" class="linkdeleteflavour" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#flavourList table tbody').html(tableContent);
  });
};

// Fill flavour history table with data
function populateFlavourHistory(flavourName) {
  // Empty content string
  var tableContent = '';

  $.getJSON( '/flavours/tubHistory', function( data ) {

    // For each item in our JSON that matches the flavour we're interested in, add a table row and cells to the content string
    $.each(data, function(){
      if (this.flavour == flavourName) {
        tableContent += '<tr>';
        tableContent += '<td>' + this.date_opened + '</td>';
        tableContent += '<td>' + this.date_closed + '</td>';
        tableContent += '<td>' + getWorkingDays(this.date_opened, this.date_closed) + '</td>';
        tableContent += '<td><a href="#" class="linkedittub" rel="' + this._id + '">edit</a></td>';
        tableContent += '<td><a href="#" class="linkdeletetub" rel="' + this._id + '">delete</a></td>';
        tableContent += '</tr>';
      }
    });

    // Inject the whole content string into our existing HTML table
    $('#flavourHistory table tbody').html(tableContent);
  });
}

// Show Flavour Info
function showFlavourInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();
  
    // Retrieve flavour_name from link rel attribute
    var thisFlavourName = $(this).attr('rel');
  
    /* populate flavour info */
    // Get Index of object based on id value
    var arrayPosition = flavourListData.map(function(arrayItem) { return arrayItem.flavour_name; }).indexOf(thisFlavourName);

    // Get our Flavour Object
    var thisFlavourObject = flavourListData[arrayPosition];

    //Populate Info Box
    $('#flavourInfoFlavour').text(thisFlavourObject.flavour_name);
    $('#flavourInfoSupplier').text(thisFlavourObject.supplier);
    $('#flavourInfoType').text(thisFlavourObject.product_type);
    $('#flavourInfoQuantity').text(thisFlavourObject.quantity_per_unit);
    $('#flavourInfoPrice').text(thisFlavourObject.price);

  /* populate flavour history */
  populateFlavourHistory(thisFlavourName);
};

// Add Flavour
function addFlavour(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addFlavour input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {
    // If it is, compile all flavour info into one object
    var flavourEntry = {
      'flavour_name': $('#addFlavour fieldset input#inputFlavourName').val(),
      'supplier': $('#addFlavour fieldset input#inputFlavourSupplier').val(),
      'product_type': $('#addFlavour fieldset input#inputFlavourProductType').val(),
      'quantity_per_unit': $('#addFlavour fieldset input#inputFlavourQuantityPerUnit').val(),
      'price': $('#addFlavour fieldset input#inputFlavourPrice').val(),
    }
  
    // if we're editing a flavour, change the content in the DB for this flavour entry
    if (idInEditing != '') {
      // Use AJAX to put the object to our editflavour service
      $.ajax({
        type: 'PUT',
        data: flavourEntry,
        url: '/flavours/editflavour/' + idInEditing,
        dataType: 'JSON'
      }).done(function( response ) {
  
        // Check for successful (blank) response
        if (response.msg === '') {
  
          // Clear the form inputs
          $('#addFlavour fieldset input').val('');
  
          // Update the table
          populateTable();

          // reset into Add mode
          idInEditing = '';
          $("#addFlavourHeader").text("Add Flavour");
          $("#btnAddFlavour").text("Add Flavour");
  
        }
        else {
  
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);
  
        }
      });
    }
    // otherwise, add the flavour to the DB for the first time
    else {    
      // Use AJAX to post the object to our addflavour service
      $.ajax({
        type: 'POST',
        data: flavourEntry,
        url: '/flavours/addflavour',
        dataType: 'JSON'
      }).done(function( response ) {
  
        // Check for successful (blank) response
        if (response.msg === '') {
  
          // Clear the form inputs
          $('#addFlavour fieldset input').val('');
  
          // Update the table
          populateTable();
  
        }
        else {
  
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);
  
        }
      });
    }
  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

// Edit Flavour
function editFlavour(event) {

  event.preventDefault();

  // set the form to Edit mode 
  idInEditing = $(this).attr('rel');
  
  // fill in text fields with info on the flavour from the database 
    // Get Index of flavour object based on id value
    var arrayPosition = flavourListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(idInEditing);
    // Get Flavour Object
    var thisFlavourObject = flavourListData[arrayPosition];

  //Populate text boxes
  $("#addFlavourHeader").text("Edit Flavour");
  $('#inputFlavourName').val(thisFlavourObject.flavour_name);
  $("#addFlavourHeader").val(thisFlavourObject.flavour_name);
  $('#inputFlavourSupplier').val(thisFlavourObject.supplier);
  $('#inputFlavourProductType').val(thisFlavourObject.product_type);
  $('#inputFlavourQuantityPerUnit').val(thisFlavourObject.quantity_per_unit);
  $('#inputFlavourPrice').val(thisFlavourObject.price);
  $("#btnAddFlavour").text("Edit Flavour");
};

// Delete Flavour
function deleteFlavour(event) {

    event.preventDefault();
  
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this flavour?');
  
    // Check and make sure the flavour confirmed
    if (confirmation === true) {
  
      // If they did, do our delete
      $.ajax({
        type: 'DELETE',
        url: '/flavours/deleteflavour/' + $(this).attr('rel')
      }).done(function( response ) {
  
        // Check for a successful (blank) response
        if (response.msg === '') {
        }
        else {
          alert('Error: ' + response.msg);
        }
  
        // Update the table
        populateTable();
  
      });
  
    }
    else {
  
      // If they said no to the confirm, do nothing
      return false;
  
    }
  
  };

  // Edit Tub
function editTub(event) {
  // TODO
};

// Delete Tub
function deleteTub(event) {
    event.preventDefault();
  
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this tub?');
  
    // Check and make sure the flavour confirmed
    if (confirmation === true) {
  
      // If they did, do our delete
      $.ajax({
        type: 'DELETE',
        url: '/flavours/deletetub/' + $(this).attr('rel')
      }).done(function( response ) {
  
        // Check for a successful (blank) response
        if (response.msg === '') {
            // TODO
        }
        else {
          alert('Error: ' + response.msg);
        }  
      });
  
        // Update the table
        populateFlavourHistory($('#flavourInfoFlavour').text());
    }
    else {
  
      // If they said no to the confirm, do nothing
      return false;
  
    }
  
  };

// get working days that a tub has been open
  // TODO move this information to be stored inside the DB, with a refresh of all the values whenever the semesterDates or daysClosed collections are altered
function getWorkingDays(openDate, closeDate) {
  // TODO
  return 0;
}

// open a tub in tubHistory
function openTub() {

  // Prevent Link from Firing
  event.preventDefault();

  // create entry for DB
  var tubEntry = {
    'flavour': $('#flavourInfoFlavour').text(),
    'supplier': $('#flavourInfoSupplier').text(),
    'product_type': $('#flavourInfoType').text(),
    'quantity_per_unit': {'value' : $('#flavourInfoQuantity').text(), 'unit' : 'litres'},      // TODO change once collections are restructured to match
    'price': {'value' : $('#flavourInfoPrice').text(), 'unit' : 'CAD'},                        // TODO change once collections are restructured to match
    'open': true,
    'date_opened': new Date(),
    'date_closed': '',
  }

  // Use AJAX to POST a tub to our addtub service
  $.ajax({
    type: 'POST',
    data: tubEntry,
    url: '/flavours/addtub',
    dataType: 'JSON'
  }).done(function( response ) {

    // Check for successful (blank) response
    if (response.msg === '') {
      // TODO
    } else {
      // If something goes wrong, alert the error message that our service returned
      alert('Error: ' + response.msg);

    }
  });

  // Update the table
  populateFlavourHistory($('#flavourInfoFlavour').text());
}

// close a tub in tubHistory
function closeTub() {
  // TODO
}