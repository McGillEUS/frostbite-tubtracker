var app = angular.module('rulesManager', []);
app.controller('jsonGUIController', function($scope, $timeout) {

    $scope.tubUnderEdit = {};
    $scope.flavourUnderEdit = {};
    $scope.tubEditOriginal = {};
    $scope.flavourEditOriginal = {};
    $scope.index = 0;
    $scope.nextID = 1;
    $scope.load = { };
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
                    "date_received" : "",
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
                    "date_received" : "",
                    "date_opened" : "",
                    "date_closed" : ""
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
        $scope.currentDisplay.push($scope.tubUnderEdit);

        // duplicate last element on the list
        var lastIndex = $scope.selectedFlavour.tubs.length;
        var lastItem = jQuery.extend(true, {}, $scope.selectedFlavour.tubs[lastIndex - 1]);
        $scope.selectedFlavour.tubs.push(lastItem);

        // assign the new tub an incremented ID
        $scope.tubUnderEdit.id = $scope.nextID;
        $scope.nextID += 1;

        // replace content of last element on the list
        $scope.selectedFlavour.tubs[lastIndex] = $scope.tubUnderEdit;

        // remove duplicated element
        // delete $scope.selectedFlavour.Vars[lastIndex][Object.keys(lastItem)[0]];
            // TODO figure out if this is still needed

        clearAll();
        toastr.success("Item added successfully.");
    };

    $scope.addFlavour = function () {
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
});