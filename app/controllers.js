var app = angular.module('rulesManager', []);
app.controller('jsonGUIController', function($scope, $timeout) {

    $scope.tubUnderEdit = {};
    $scope.flavourUnderEdit = {};
    $scope.tubEditOriginal = {};
    $scope.flavourEditOriginal = {};
    $scope.index = 0;
    var initialKey = "TEMPLATE_KEY";
    var initialValue = "1234";
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

/*     var findTub = function() {
        // return the index if $scope.tubUnderEdit.key is found in currentDisplay, -1 otherwise
        var i = 0, final = -1;
        angular.forEach($scope.currentDisplay, function(tub) {
            if (tub.id == $scope.tubUnderEdit.id) {
                final = i;
            }
            i++;
        });
        return final;
    }; */

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

    $scope.addItem = function () {
        $scope.currentDisplay.push($scope.tubUnderEdit);

        // duplicate last element on the list
        var lastIndex = $scope.selectedFlavour.tubs.length;
        var lastItem = jQuery.extend(true, {}, $scope.selectedFlavour.tubs[lastIndex - 1]);
        $scope.selectedFlavour.tubs.push(lastItem);

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
            $("#categoryInput").focus();
        } else {
            $scope.multipleFlavoursExist = true; // we always have at least one flavour, and we just added one, so there must be multiple now

            // duplicate last flavour on the list
            var lastIndex = $scope.flavours.length;
            var lastItem = jQuery.extend(true, {}, $scope.flavours[lastIndex - 1]);
            $scope.flavours.push(lastItem);

            // replace last flavour on the list
            $scope.flavours[lastIndex] = $scope.flavourUnderEdit;
            
            // change selected flavour
            $scope.selectedFlavour = $scope.flavours[lastIndex];

            // empty values from new category
            while ($scope.selectedFlavour.tubs.length > 0) {
                $scope.deleteTub(0);
                toastr.remove();
            }

            toastr.success("Category added successfully.");
        }
        $scope.flavourUnderEdit = {};
        $scope.updateSelection();
    };

    $scope.updateSelection = function() {
        angular.forEach($scope.selectedFlavour.tubs, function(instance) {
            $scope.currentDisplay.push(instance);
        });

        clearAll();
    };

    $scope.editTub = function(index) {
        $scope.index = index;
        $scope.tubUnderEdit = $scope.currentDisplay[index];
        $scope.tubEditOriginal = jQuery.extend(true, {}, $scope.tubUnderEdit);
        $scope.edit = true;
    };

    $scope.editCategory = function() {
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
                toastr.success("Category modified successfully.");
            }
        }
    };

    $scope.deleteTub = function(index){
        if (confirm("Are you sure you want to delete this tub?")) {
            $scope.tubUnderEdit = $scope.tubEditOriginal = {};
            $scope.edit = false;

            $scope.currentDisplay.splice(index, 1);
            $scope.selectedFlavour.tubs.splice(index, 1);
            toastr.success("Tub removed successfully.");
        }
    };

    $scope.deleteFlavour = function() {
        if (confirm("Are you sure you want to delete this category?")) {
            $scope.flavourUnderEdit = $scope.selectedFlavour;
            $scope.flavours.splice(findFlavour(), 1);
            $scope.selectedFlavour = $scope.flavours[0];
            $scope.updateSelection();

            clearAll();

            if ($scope.flavours.length == 1) {
                $scope.multipleFlavoursExist = false; // we're down to 1 category, so remove the "Delete Category" button
            } else {
                $scope.multipleFlavoursExist = true;
            }
        }
    };
});