var app = angular.module('tubTracker', ['mp.datePicker', 'chart.js']);
app.controller('jsonGUIController', function($scope, $timeout) {
    /* FROSTBITE x OAP SECTION */
    $scope.oapDateLabels = ['Aug 26', 'Aug 27', 'Aug 28', 'Aug 29', 'Aug 30', 'Sep 3', 'Sep 4', 'Sep 5', 'Sep 6'];
    $scope.oapTimeLabels = ['12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM'];

    var oapPopulateDate = function (date) {
        var aug27 = new Date('2019-08-27T04:00:00');
        var aug28 = new Date('2019-08-28T04:00:00');
        var aug29 = new Date('2019-08-29T04:00:00');
        var aug30 = new Date('2019-08-30T04:00:00');
        var sep3 = new Date('2019-09-03T04:00:00');
        var sep4 = new Date('2019-09-04T04:00:00');
        var sep5 = new Date('2019-09-05T04:00:00');
        var sep6 = new Date('2019-09-06T04:00:00');

        if (date < aug27) {
            $scope.oapDateData[0]++;
        } else if (date > aug27 && date < aug28) {
            $scope.oapDateData[1]++;
        } else if (date > aug28 && date < aug29) {
            $scope.oapDateData[2]++;
        } else if (date > aug29 && date < aug30) {
            $scope.oapDateData[3]++;
        } else if (date > aug30 && date < sep3) {
            $scope.oapDateData[4]++;
        } else if (date > sep3 && date < sep4) {
            $scope.oapDateData[5]++;
        } else if (date > sep4 && date < sep5) {
            $scope.oapDateData[6]++;
        } else if (date > sep5 && date < sep6) {
            $scope.oapDateData[7]++;
        } else if (date > sep6) {
            $scope.oapDateData[8]++;
        }
    };
    var oapPopulateTime = function(hours) {
        // hours adjusted by 4 to account for time change
        if (hours >= 12 && hours < 13) {
            $scope.oapTimeData[0]++;
        } else if (hours >= 13 && hours < 14) {
            $scope.oapTimeData[1]++;
        } else if (hours >= 14 && hours < 15) {
            $scope.oapTimeData[2]++;
        } else if (hours >= 15 && hours < 16) {
            $scope.oapTimeData[3]++;
        } else if (hours >= 16 && hours < 17) {
            $scope.oapTimeData[4]++;
        } else if (hours >= 17 && hours < 18) {
            $scope.oapTimeData[5]++;
        } else if (hours >= 18 && hours < 19) {
            $scope.oapTimeData[6]++;
        } else if (hours >= 19 && hours < 20) {
            $scope.oapTimeData[7]++;
        } else if (hours >= 20 && hours < 21) {
            $scope.oapTimeData[8]++;
        }
    };
    $scope.saveOAPChanges = function () {
        // send edited data to the OAP sales file
        $.ajax({ 
            'url' : 'app/saveOAPSales.php',
            'data' : {'data' : JSON.stringify($scope.oapSales)},
            'type' : 'POST',
            'dataType' : 'json',
            'success' : function() {
            }
        });
    };
    $scope.populateOAPData = function (fullRefresh) {
        if (fullRefresh) {
            $scope.oapDateData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.oapTimeData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            angular.forEach($scope.oapSales, function(sale) {
                var date = new Date(sale.timestamp);
                oapPopulateDate(date);
                oapPopulateTime(date.getHours());
            });
        } else {
            var date = new Date($scope.oapSales[$scope.oapSales.length - 1].timestamp);
            oapPopulateDate(date);
            oapPopulateTime(date.getHours());
        }
    };
    $scope.oapSale = function(item) {
        var date = new Date();
        $scope.oapSales.push({"item" : item, "timestamp" : date});
        $scope.saveOAPChanges();
        $scope.populateOAPData(false);
    };
    $scope.undoOAPSale = function() {
        // remove the most recent sale from $scope.oapSales
        $scope.oapSales.pop();
        $scope.saveOAPChanges();
        $scope.populateOAPData(true);
    };

    // UTILITY FUNCTIONS
    $scope.today = function () {
        var now = new Date();
        var month = now.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = now.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        return now.getFullYear() + "-" + month + "-" + day;
    }

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
    
    // non-clearable variables
    $scope.nextID = 1;
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
    $scope.oapSales = [
        {
            "item" : "2 Scoops",
            "timestamp" : "2019-08-19T13:00:00.000Z"
        },
        {
            "item" : "1 Scoop",
            "timestamp" : "2019-08-25T13:05:00.000Z"
        }
    ];
    $scope.flavourBackup = [];
    $scope.selectedFlavour = $scope.flavours[0];
    $scope.currentDisplay = $scope.selectedFlavour.tubs;

    var resetNextID = function() {
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
    }

    $scope.findOpenTubs = function() {
        $scope.openTubs = [];
        $scope.openNestleTubs = [];
        $scope.openRipplesTubs = [];
        angular.forEach($scope.flavours, function(flavour) {
            angular.forEach(flavour.tubs, function(tub) {
                if (tub.status == "open") {
                    var openTubData = {
                        'flavour' : flavour,
                        'tub' : tub
                    };
                    $scope.openTubs.push(openTubData);
                    if (flavour.supplier == "Nestle") {
                        $scope.openNestleTubs.push(tub);
                    } else if (flavour.supplier == "Ripples") {
                        $scope.openRipplesTubs.push(tub);
                    }
                }
            });
        });
    };

    $scope.findClosedTubs = function() {
        $scope.closedTubs = [];
        $scope.closedNestleTubs = [];
        $scope.closedRipplesTubs = [];
        angular.forEach($scope.flavours, function(flavour) {
            angular.forEach(flavour.tubs, function(tub) {
                if (tub.status == "closed") {
                    var closedTubData = {
                        'flavour' : flavour,
                        'tub' : tub
                    };
                    $scope.closedTubs.push(closedTubData);
                    if (flavour.supplier == "Nestle") {
                        $scope.closedNestleTubs.push(tub);
                    } else if (flavour.supplier == "Ripples") {
                        $scope.closedRipplesTubs.push(tub);
                    }
                }
            });
        });
    };

    var loadData = function() {
        $.ajax({
            'async': false,
            'global': false,
            'url': "tubs/flavours.json",
            'dataType': "json",
            'success': function (data) {
                $scope.flavours = data;
            }
        });

        $.ajax({
            'async': false,
            'global': false,
            'url': "daysClosed.json",
            'dataType': "json",
            'success': function (data) {
                $scope.daysClosed = data;
            }
        });

        $.ajax({
            'async': false,
            'global': false,
            'url': "tubs/oapSales.json",
            'dataType': "json",
            'success': function (data) {
                $scope.oapSales = data;
            }
        });
        $scope.populateOAPData(true);

        $scope.flavourBackup = JSON.stringify($scope.flavours);

        $scope.selectedFlavour = $scope.flavours[0];
        $scope.currentDisplay = $scope.selectedFlavour.tubs;

        resetNextID();
        $scope.findOpenTubs();
        $scope.findClosedTubs();
    };
    loadData();

    var clearAll = function() {
        $scope.tubUnderEdit = {};
        $scope.flavourUnderEdit = {};
        $scope.tubEditOriginal = {};
        $scope.flavourEditOriginal = {};
        $scope.index = 0;
        $scope.edit = false;
        $scope.add = false;
        $scope.flavourAdd = false;
        $scope.flavourEdit = false;
        $scope.findOpenTubs();
        $scope.findClosedTubs();
    };
    clearAll();

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
            $scope.tubUnderEdit.date_received = $scope.today();
            $scope.tubUnderEdit.status = "closed";
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
                $scope.saveChanges();
                toastr.success("Item added successfully.");
            }
        }      
    };

    $scope.cancelTub = function () {
        if ($scope.edit == true) {
            $scope.selectedFlavour.tubs[$scope.index] = jQuery.extend(true, {}, $scope.tubEditOriginal);
        }
        clearAll();
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
            $scope.saveChanges();
            toastr.success("Flavour added successfully.");
        }
    };

    $scope.cancelFlavour = function () {
        if ($scope.flavourEdit == true) {
            $scope.selectedFlavour = jQuery.extend(true, {}, $scope.flavourEditOriginal);
        }
        clearAll();
    };

    $scope.updateSelection = function() {
        $scope.currentDisplay = $scope.selectedFlavour.tubs;
        clearAll();
    };

    // initiate editing tub
    $scope.editTub = function(index) {
        $scope.index = $scope.selectedFlavour.tubs.length - index - 1;
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
            $scope.saveChanges();
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
            clearAll();
            $scope.saveChanges();
            toastr.success("Flavour modified successfully.");
        }
    };

    // tub deletion logic
    $scope.deleteTub = function(index){
        if (confirm("Are you sure you want to delete this tub?")) {
            $scope.tubUnderEdit = $scope.tubEditOriginal = {};
            $scope.edit = false;
            $scope.selectedFlavour.tubs.splice($scope.index, 1);
            clearAll();
            $scope.saveChanges();
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
            $scope.saveChanges();
            toastr.success("Flavour removed successfully.");
        }
    };

    // upload JSON file of tub history
    $scope.uploadFlavours = function() {
        var file = document.getElementById("fileLoader").files[0];
        var fileReader = new FileReader();
        
	    fileReader.onload = function(e) {
            $scope.flavours = angular.fromJson(fileReader.result);
            $scope.flavourBackup = JSON.stringify($scope.flavours);
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

    // download JSON file of tub history
    $scope.exportChanges = function() {
        var data = new Blob([angular.toJson($scope.flavours, true)], {type: 'text/plain'});
        var downloadLink = document.getElementById('filedownload');
        downloadLink.href = window.URL.createObjectURL(data);
        $timeout(function() {
            downloadLink.click(); // performs click to start download
        }, 100);
    };

    // save flavour changes
    $scope.saveChanges = function() {

        // back up current flavour history to a separate file
        $.ajax({ 
            'url' : 'app/saveFlavourHistory.php',
            'data' : {'data' : $scope.flavourBackup},
            'type' : 'POST',
            'dataType' : 'json',
            'success' : function() {
            }
        });

        // now that it's saved, update the backup with the latest info
        $scope.flavourBackup = JSON.stringify($scope.flavours);

        // send edited data to the flavour.json file
        $.ajax({ 
            'url' : 'app/saveFlavours.php',
            'data' : {'data' : JSON.stringify($scope.flavours)},
            'type' : 'POST',
            'dataType' : 'json',
            'success' : function() {
            }
        });

        // send edited data to the open tubs status file
        $.ajax({ 
            'url' : 'app/saveOpenTubs.php',
            'data' : {'data' : JSON.stringify($scope.openTubs)},
            'type' : 'POST',
            'dataType' : 'json',
            'success' : function() {
            }
        });
    };

    $scope.openFile = function() {
    	$("#fileLoader").click();
    };

    $scope.openTub = function(index) {
        $scope.currentDisplay[$scope.selectedFlavour.tubs.length - index - 1].date_opened = $scope.today();
        $scope.currentDisplay[$scope.selectedFlavour.tubs.length - index - 1].status = "open";
        clearAll();
        $scope.saveChanges();
        toastr.success("Tub opened.");
    };

    $scope.openTubStatusPage = function(index) {
        $scope.closedTubs[index].tub.date_opened = $scope.today();
        $scope.closedTubs[index].tub.status = "open";
        clearAll();
        $scope.saveChanges();
        toastr.success("Tub opened.");
    };

    $scope.finishTub = function(index) {
        $scope.currentDisplay[$scope.selectedFlavour.tubs.length - index - 1].date_closed = $scope.today();
        $scope.currentDisplay[$scope.selectedFlavour.tubs.length - index - 1].status = "finished";
        clearAll();
        $scope.saveChanges();
        toastr.success("Tub finished.");
    };

    $scope.finishTubStatusPage = function(index) {
        $scope.openTubs[index].tub.date_closed = $scope.today();
        $scope.openTubs[index].tub.status = "finished";
        clearAll();
        $scope.saveChanges();
        toastr.success("Tub finished.");
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
    $scope.statusInput = function () {
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
});
