var app = angular.module('tubTracker', [ 'mp.datePicker' ]);
app.controller('jsonGUIController', function($scope, $timeout) {

    $scope.tubUnderEdit = {};
    $scope.flavourUnderEdit = {};
    $scope.tubEditOriginal = {};
    $scope.flavourEditOriginal = {};
    $scope.index = 0;
    $scope.nextID = 1;
    $scope.load = { };
    $scope.edit = false;
    $scope.add = false;
    $scope.flavourAdd = false;
    $scope.flavourEdit = false;
    $scope.flavours = [
        {
            "flavour" : "Placeholder",
            "supplier" : "Nestle",
            "quantity" : 
            {
                "value" : 11.4,
                "unit" : "L"
            },
            "price" :
            {
                "value" : 34.99,
                "unit" : "CAD"
            },
            "format" : "tub",
            "type" : "ice cream",
            "tubs" :
            [
                {
                    "id" : 0,
                    "status" : "open",
                    "date_received" : "2019-06-17",
                    "date_opened" : "2019-06-17",
                    "date_closed" : ""
                }
            ],
            "avgDaysOpen" : "N/A"
        }
    ];
    $scope.selectedFlavour = $scope.flavours[0];
    $scope.currentDisplay = $scope.selectedFlavour.tubs;

    var clearAll = function() {
        $scope.tubUnderEdit = {};
        $scope.flavourUnderEdit = {};
        $scope.load = { };
        $scope.flavourEdit = false;
        $scope.edit = false;
    }

    var findFlavour = function() {
        // return the index if the flavour is found, -1 otherwise
        var i = 0, final = -1;
        angular.forEach($scope.flavours, function(x) {
            if (x.flavour == $scope.flavourUnderEdit.flavour) {
                final = i;
            }
            i++;
        });
        return final;
    };

    $scope.addTub = function () {
        if ($scope.add == false) {
            // show the tub input fields
            $scope.add = true;
        } else {
            if ($scope.validTub($scope.tubUnderEdit)) {
                // if the date_opened or date_closed fields were left blank, create them
                if ($scope.tubUnderEdit.date_opened == undefined) {
                    $scope.tubUnderEdit.date_opened = "";
                }
                if ($scope.tubUnderEdit.date_closed == undefined) {
                    $scope.tubUnderEdit.date_closed = "";
                }

                // assign the new tub an incremented ID
                $scope.tubUnderEdit.id = $scope.nextID;
                $scope.nextID += 1;

                // add tub to list
                $scope.currentDisplay.push($scope.tubUnderEdit);

                // reset variables
                $scope.tubUnderedit = {};
                $scope.dateReceivedInputActive = false;
                $scope.dateOpenedInputActive = false;
                $scope.dateClosedInputActive = false;
                $scope.add = false;
                clearAll();
                toastr.success("Item added successfully.");
            }
        }      
    };

    $scope.addFlavour = function () {
        if ($scope.flavourAdd == false) {
            $scope.flavourAdd = true;
        } else if ($scope.validFlavour("")){
            // add an empty tubs field to the flavour
            $scope.flavourUnderEdit.tubs = [];

            // add flavour to list
            $scope.flavours.push($scope.flavourUnderEdit);
            $scope.selectedFlavour = $scope.flavourUnderEdit;
            $scope.updateSelection();

            // reset variables
            $scope.flavourUnderEdit = {};
            $scope.flavourAdd = false;
            clearAll();
            toastr.success("Flavour added successfully.");
        }
    };

    $scope.updateSelection = function() {
        $scope.currentDisplay = $scope.selectedFlavour.tubs;
        clearAll();
    };

    // initiate editing tub
    $scope.editTub = function(index) {
        $scope.index = index;
        $scope.tubUnderEdit = $scope.currentDisplay[$scope.index];
        $scope.tubEditOriginal = jQuery.extend(true, {}, $scope.tubUnderEdit);
        $scope.edit = true;
    };

    // initiate editing flavour
    $scope.editFlavour = function() {
        $scope.flavourUnderEdit = $scope.selectedFlavour;
        $scope.flavourEditOriginal = jQuery.extend(true, {}, $scope.flavourUnderEdit);
        $scope.flavourEdit = true;
    };

    // save edited tub info
    $scope.applyChanges = function() {
        if ($scope.compareTubs($scope.tubEditOriginal, $scope.tubUnderEdit)) {
            // nothing changed, change nothing
            $scope.tubUnderEdit = $scope.tubEditOriginal = {};
            $scope.edit = false;
            toastr.warning("No changes made.");
        } else if ($scope.validTub($scope.tubUnderEdit)) {
            // tub info has changed, save it
            $scope.selectedFlavour.tubs[$scope.index] = $scope.tubUnderEdit;
            toastr.success("Tub modified successfully.");
            clearAll();
        }
    };

    // save edited flavour info
    $scope.applyFlavourChanges = function() {
        if ($scope.compareFlavours($scope.flavourEditOriginal, $scope.flavourUnderEdit)) {
            // nothing changed, do nothing
            $scope.flavourUnderEdit = $scope.flavourEditOriginal = {};
            $scope.flavourEdit = false;
            toastr.warning("No changes made.");
        } else if ($scope.validFlavour()) {
            // perform modification
            $scope.selectedFlavour = $scope.flavourUnderEdit;
            $scope.flavourUnderEdit = {};
            $scope.flavourEditOriginal = {};
            $scope.flavourEdit = false;
            toastr.success("Flavour modified successfully.");
        }
    };

    // tub deletion logic
    $scope.deleteTub = function(index){
        if (confirm("Are you sure you want to delete this tub?")) {
            $scope.tubUnderEdit = $scope.tubEditOriginal = {};
            $scope.edit = false;
            $scope.selectedFlavour.tubs.splice($scope.index, 1);
            toastr.success("Tub removed successfully.");
        }
    };

    // flavour deletion logic
    $scope.deleteFlavour = function() {
        if (confirm("Are you sure you want to delete this flavour?")) {
            $scope.flavourUnderEdit = $scope.selectedFlavour;
            $scope.flavours.splice(findFlavour(), 1);
            $scope.selectedFlavour = $scope.flavours[0];
            $scope.flavourUnderEdit = {};
            $scope.updateSelection();
            clearAll();
        }
    };

    // TODO change this to a proper server-hosted JSON file
    $scope.uploadFlavours = function() {
        var file = document.getElementById("fileLoader").files[0];
        var fileReader = new FileReader();
        
	    fileReader.onload = function(e) {
            $scope.flavours = angular.fromJson(fileReader.result);
            $scope.selectedFlavour = $scope.flavours[0];
            $scope.currentDisplay = $scope.selectedFlavour.tubs;

            // find maximum tub ID
            $scope.nextID = 1;
            angular.forEach($scope.flavours, function(flavour) {
                angular.forEach(flavour.tubs, function(tub) {
                    if (tub.id > $scope.nextID) {
                        $scope.nextID = tub.id;
                    }
                });
            });
            $scope.nextID += 1;

            clearAll();
            toastr.success("File imported successfully.");
            $scope.$apply();
        }

        fileReader.readAsText(file, $scope);
    };

    // TODO change this from a download link to a proper server-hosted JSON file
    $scope.saveChanges = function() {
        var data = new Blob([angular.toJson($scope.flavours, true)], {type: 'text/plain'});
        var downloadLink = document.getElementById('filedownload');
        downloadLink.href = window.URL.createObjectURL(data);
        $timeout(function() {
            downloadLink.click(); // performs click to start download
        }, 100);

        /* $.post( "test.html", function( data ) {
            $( ".result" ).html( data );
          }); */
    };

    $scope.openFile = function() {
    	$("#fileLoader").click();
    };

    $scope.openTub = function(index) {
        $scope.currentDisplay[index].date_opened = new Date();
        $scope.currentDisplay[index].status = "open";
    };

    $scope.closeTub = function(index) {
        $scope.currentDisplay[index].date_closed = new Date();
        $scope.currentDisplay[index].status = "finished";
    };

    // basic validation: validate that date_received and status are filled
        // some rickety date validation is provided by the date pickers
    // TODO upgrade data validation to check for proper dates
        // proper date format
        // open date can't be before received data
        // closed date can't be before open date
        // date not on a day that the store was closed?
    $scope.validTub = function(tub) {
        if ($scope.tubUnderEdit.status == undefined || tub.date_received == undefined) {
            toastr.warning("Date received and status required.")
        } else if (tub.status == "open" && (tub.date_opened == undefined || tub.date_opened == "")) {
            toastr.warning("Open tub needs an opening date.");
        } else if (tub.status == "open" && (tub.date_closed != undefined && tub.date_closed != "")) {
            toastr.warning("Open tub can't have a closing date.");
        } else if (tub.status == "closed" && ((tub.date_closed != undefined && tub.date_closed != "") || (tub.date_opened != undefined && tub.date_opened != ""))) {
            toastr.warning("Closed tub can't have an opening or closing date.");
        } else if (tub.status == "finished" && (tub.date_opened != undefined && tub.date_opened != "")  && (tub.date_closed == undefined || tub.date_closed == "")) {
            toastr.warning("Finished tub needs a closing date.");
        } else if (tub.status == "finished" && (tub.date_opened == undefined || tub.date_opened == "") && (tub.date_closed != undefined && tub.date_closed != "")) {
            toastr.warning("Finished tub needs an opening date.");
        } else {
            return true;
        }
        return false;
    };

    // basic "all fields required" data validation 
        // TODO implement duplicate flavour validation
    $scope.validFlavour = function() {
        if ($scope.flavourUnderEdit.flavour == undefined 
            || $scope.flavourUnderEdit.flavour == ""
            || $scope.flavourUnderEdit.supplier == undefined
            || $scope.flavourUnderEdit.supplier == ""
            || $scope.flavourUnderEdit.quantity.value == undefined
            || $scope.flavourUnderEdit.quantity.value == ""
            || $scope.flavourUnderEdit.quantity.unit == undefined
            || $scope.flavourUnderEdit.quantity.unit == ""
            || $scope.flavourUnderEdit.price.value == undefined
            || $scope.flavourUnderEdit.price.value == ""
            || $scope.flavourUnderEdit.price.unit == undefined
            || $scope.flavourUnderEdit.price.unit == ""
            || $scope.flavourUnderEdit.format == undefined
            || $scope.flavourUnderEdit.format == ""
            || $scope.flavourUnderEdit.type == undefined
            || $scope.flavourUnderEdit.type == "") {
                // very basic "all fields required" data validation
                toastr.warning("All fields must be filled in.");
        } else {
            return true;
        }
        return false;
    };
    
    // compare all data of two tubs
    $scope.compareTubs = function(a, b) {
        if (a.date_received != b.date_received
            || a.status != b.status
            || a.date_opened != b.date_opened
            || a.date_closed != b.date_closed) {
                return false;
        } else {
            return true;
        }
    };

    // compare all data of two flavours
        // return true if identical
        // return false if different
    $scope.compareFlavours = function(a, b) {
        if (a.flavour != b.flavour
            || a.supplier != b.supplier
            || a.quantity.value != b.quantity.value
            || a.quantity.unit != b.quantity.unit
            || a.price.value != b.price.value
            || a.price.unit != b.price.unit
            || a.format != b.format
            || a.type != b.type) {
                return false;
        } else {
            return true;
        } 
    };

    // calculate average number of days open of a flavour
    $scope.avgDaysOpen = function(flavour) {
        var total = 0;

        angular.forEach(flavour.tubs, function(tub) {
            if (tub.status == "finished") {
                var dateData = tub.date_opened.split("-");
                var openedDate = new Date(dateData[0], dateData[1] - 1, dateData[2]);
                dateData = tub.date_closed.split("-");
                var closedDate = new Date(dateData[0], dateData[1] - 1, dateData[2]);
                var seconds = Math.abs(closedDate - openedDate) / 1000;
                var days = Math.floor(seconds / 86400);
                // TODO subtract the number of days that Frostbite was closed during this period
                total += days;
            }
        });

        if (flavour.tubs.length > 0) {
            flavour.avgDaysOpen = Math.floor(total / flavour.tubs.length);
        } else {
            flavour.avgDaysOpen = "N/A";
        }
    };

    // DATE PICKER SHOW/HIDE FUNCTIONS
    $scope.dateReceivedInput = function () {
        $scope.dateReceivedInputActive = true;
        $scope.dateOpenedInputActive = false;
        $scope.dateClosedInputActive = false;
    };
    $scope.openInput = function () {
        $scope.dateReceivedInputActive = false;
        $scope.dateOpenedInputActive = false;
        $scope.dateClosedInputActive = false;
    };
    $scope.dateOpenedInput = function () {
        $scope.dateReceivedInputActive = false;
        $scope.dateOpenedInputActive = true;
        $scope.dateClosedInputActive = false;
    };
    $scope.dateClosedInput = function () {
        $scope.dateReceivedInputActive = false;
        $scope.dateOpenedInputActive = false;
        $scope.dateClosedInputActive = true;
    };

    // DATE PICKER FUNCTIONS
    $scope.formatDate = function (date) {
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }
    
        return date && date.getFullYear()
            + '-' + pad(date.getMonth() + 1)
            + '-' + pad(date.getDate());
    };
    $scope.parseDate = function (s) {
        var tokens = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    
        return tokens && new Date(tokens[1], tokens[2] - 1, tokens[3]);
    };
});