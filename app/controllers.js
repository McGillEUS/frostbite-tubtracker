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
            "flavour" : "Chocolate",
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
                    "id" : 1,
                    "open" : true,
                    "date_received" : "2019-06-17",
                    "date_opened" : "2019-06-17",
                    "date_closed" : ""
                }
            ]
        },
        {
            "flavour" : "Mango",
            "supplier" : "Ripples",
            "quantity" : 
            {
                "value" : 11.4,
                "unit" : "L"
            },
            "price" :
            {
                "value" : 44.99,
                "unit" : "CAD"
            },
            "format" : "tub",
            "type" : "sorbet",
            "tubs" :
            [
                {
                    "id" : 2,
                    "open" : false,
                    "date_received" : "2019-06-17",
                    "date_opened" : "",
                    "date_closed" : ""
                }
            ]
        },
        {
            "flavour" : "Oreo Ice Cream Sandwich",
            "supplier" : "Nestle",
            "quantity" : 
            {
                "value" : 12,
                "unit" : "unit"
            },
            "price" :
            {
                "value" : 20.99,
                "unit" : "CAD"
            },
            "format" : "individual",
            "type" : "sandwich",
            "tubs" :
            [
                {
                    "id" : 3,
                    "open" : false,
                    "date_received" : "2019-06-17",
                    "date_opened" : "2019-06-17",
                    "date_closed" : "2019-06-19"
                }
            ]
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
        angular.forEach($scope.flavours, function(flavour) {
            if (flavour == $scope.flavourUnderEdit) {
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
            // TODO implement proper data validation
                // verify that necessary fields are filled
                // date_received must be a valid date
                // open must be true or false
                // if open is true => 
                    // date_opened must be a valid date
                    // date_closed must be empty
                // if open is false => 
                    // date_closed must be a valid date OR empty
                        // if valid date => date_open must be a valid date
                        // if empty => date_open must be empty

            // temporary validation: validate that date_received and opened status are filled
                // some rickety date validation is provided by the date pickers
            console.log($scope.tubUnderEdit.open);
            console.log($scope.tubUnderEdit.date_opened);
            console.log($scope.tubUnderEdit.date_closed);
            if ($scope.tubUnderEdit.open == undefined || $scope.tubUnderEdit.date_received == undefined) {
                toastr.warning("Date received and opened status required.")
            } else if ($scope.tubUnderEdit.open == "true" && ($scope.tubUnderEdit.date_opened == undefined || $scope.tubUnderEdit.date_opened == "")) {
                toastr.warning("Open tub needs an opening date.");
            } else if ($scope.tubUnderEdit.open == "true" && ($scope.tubUnderEdit.date_closed != undefined && $scope.tubUnderEdit.date_closed != "")) {
                toastr.warning("Open tub can't have a closing date.");
            } else if ($scope.tubUnderEdit.open == "false" && ($scope.tubUnderEdit.date_opened != undefined && $scope.tubUnderEdit.date_opened != "")  && ($scope.tubUnderEdit.date_closed == undefined || $scope.tubUnderEdit.date_closed == "")) {
                toastr.warning("Closed tub needs a closing date.");
            } else if ($scope.tubUnderEdit.open == "false" && ($scope.tubUnderEdit.date_opened == undefined || $scope.tubUnderEdit.date_opened == "") && ($scope.tubUnderEdit.date_closed != undefined && $scope.tubUnderEdit.date_closed != "")) {
                toastr.warning("Closed tub needs an opening date.");
            } else {
                // if the date_open or date_closed fields were left blank, create them
                if ($scope.tubUnderEdit.date_open == undefined) {
                    $scope.tubUnderEdit.date_open = "";
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
        } else {
            // TODO
        }
        var i = findFlavour();
        if (i > -1) {
            // $scope.selectedFlavour = $scope.flavours[i]; // TODO figure out if this is still needed
            toastr.warning("Flavour already exists.");
            $("#flavourInputFlavour").focus();
        } else {
            // duplicate last flavour on the list
            var lastIndex = $scope.flavours.length;
            var lastItem = jQuery.extend(true, {}, $scope.flavours[lastIndex - 1]);
            $scope.flavours.push(lastItem);

            // replace last flavour on the list
            $scope.flavours[lastIndex] = $scope.flavourUnderEdit;
            
            // change selected flavour
            $scope.selectedFlavour = $scope.flavours[lastIndex];

            // empty values from new flavour
            while ($scope.selectedFlavour.tubs.length > 0) {
                $scope.deleteTub(0);
                toastr.remove();
            }

            toastr.success("Flavour added successfully.");
        }
        $scope.flavourUnderEdit = {};
        $scope.updateSelection();
    };

    $scope.updateSelection = function() {
        $scope.currentDisplay = $scope.selectedFlavour.tubs;
        clearAll();
    };

    $scope.editTub = function(index) {
        $scope.index = index;
        $scope.tubUnderEdit = $scope.currentDisplay[index];
        $scope.tubEditOriginal = jQuery.extend(true, {}, $scope.tubUnderEdit);
        $scope.edit = true;
    };

    $scope.editFlavour = function() {
        $scope.flavourUnderEdit = $scope.selectedFlavour;
        $scope.flavourEditOriginal = $scope.flavourUnderEdit;
        $scope.flavourEdit = true;
    };

    $scope.applyChanges = function() {
        if ($scope.tubEditOriginal.key == $scope.tubUnderEdit) {
            // nothing changed, change nothing
            $scope.tubUnderEdit = $scope.tubEditOriginal = {};
            $scope.edit = false;
            toastr.warning("No changes made.");
        } else {
            // only instance info has changed, update it and save
            $scope.selectedFlavour.tubs[$scope.index] = $scope.tubUnderEdit;
            clearAll();
        }
    };

    $scope.applyFlavourChanges = function() {
        if ($scope.flavourEditOriginal == $scope.flavourUnderEdit) {
            // nothing changed, do nothing
            $scope.flavourUnderEdit = $scope.flavourEditOriginal = {};
            $scope.flavourEdit = false;
            toastr.warning("No changes made.");
        } else {
            if (findFlavour() > -1) {
                toastr.warning("Flavour already exists.");
            } else {
                // perform modification
                $scope.selectedFlavour = $scope.flavourUnderEdit;
                $scope.flavourUnderEdit = {};
                $scope.flavourEdit = false;
                toastr.success("Flavour modified successfully.");
            }
        }
    };

    $scope.deleteTub = function(index){
        if (confirm("Are you sure you want to delete this tub?")) {
            $scope.tubUnderEdit = $scope.tubEditOriginal = {};
            $scope.edit = false;

            $scope.currentDisplay.splice($scope.index, 1);
            $scope.selectedFlavour.tubs.splice($scope.index, 1);
            toastr.success("Tub removed successfully.");
        }
    };

    $scope.deleteFlavour = function() {
        if (confirm("Are you sure you want to delete this flavour?")) {
            $scope.flavourUnderEdit = $scope.selectedFlavour;
            $scope.flavours.splice(findFlavour(), 1);
            $scope.selectedFlavour = $scope.flavours[0];
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

            console.log($scope.nextID);

            clearAll();
            toastr.success("File imported successfully.");
            $scope.$apply();
        }

        fileReader.readAsText(file, $scope);    // TODO what does this do?
    };

    // TODO change this from a download link to a proper server-hosted JSON file
    $scope.saveChanges = function() {
        var data = new Blob([angular.toJson($scope.flavours, true)], {type: 'text/plain'});
        var downloadLink = document.getElementById('filedownload');
        downloadLink.href = window.URL.createObjectURL(data);
        $timeout(function() {
            downloadLink.click(); // performs click to start download
        }, 100);
    };

    $scope.openFile = function() {
    	$("#fileLoader").click();
    };

    $scope.openTub = function(index) {
        $scope.currentDisplay[index].date_opened = new Date();
        $scope.currentDisplay[index].open = true;
    };

    $scope.closeTub = function(index) {
        $scope.currentDisplay[index].date_closed = new Date();
        $scope.currentDisplay[index].open = false;
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