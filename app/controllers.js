var app = angular.module('rulesManager', []);
app.controller('jsonGUIController', function($scope, $timeout) {

    $scope.tubUnderEdit = {};
    $scope.category = {};
    $scope.tubEditOriginal = {};
    $scope.originalCategory = "";
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
            "instances" :
            [
                {
                    "open" : true,
                    "date_received" : "",
                    "date_opened" : "2019-06-17",
                    "date_closed" : ""
                }
            ],
            "Vars" : [
                {
                    [initialKey] : initialValue
                },
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
            "instances" :
            [
                {
                    "open" : false,
                    "date_received" : "",
                    "date_opened" : "",
                    "date_closed" : ""
                }
            ],
            "Vars" : [
                {
                    [initialKey] : initialValue
                },
            ]
        }
    ];
    $scope.selectedFlavour = $scope.flavours[0];
    $scope.currentDisplay = [
        {key: Object.keys($scope.selectedFlavour.Vars[$scope.index])[0], value: $scope.selectedFlavour.Vars[$scope.index][initialKey]},
    ];

    var clearAll = function() {
        $scope.tubUnderEdit.key = $scope.tubUnderEdit.value = '';
        $scope.category = {};
        $scope.load = { };
        $scope.catEdit = false;
        $scope.edit = false;
    }

    var findItem = function() {
        // return the index if the item key is found in currentDisplay, -1 otherwise
        var i = 0, final = -1;
        angular.forEach($scope.currentDisplay, function(item) {
            if (item.key == $scope.tubUnderEdit.key) {
                final = i;
            }
            i++;
        });
        return final;
    };

    var findCategory = function() {
        // return the index if the category is found, -1 otherwise
        var i = 0, final = -1;
        angular.forEach($scope.flavours, function(item) {
            if (item.Name == $scope.category.name) {
                final = i;
            }
            i++;
        });
        return final;
    };

    $scope.addItem = function () {
        if (findItem() > -1) {
            toastr.warning("Key already used.");
        } else {
            $scope.currentDisplay.push({key: $scope.tubUnderEdit.key, value: $scope.tubUnderEdit.value});

            // duplicate last element on the list
            var lastIndex = Object.keys($scope.selectedFlavour.Vars).length;
            var lastItem = jQuery.extend(true, {}, $scope.selectedFlavour.Vars[lastIndex - 1]);
            $scope.selectedFlavour.Vars.push(lastItem);

            // replace content of last element on the list
            $scope.selectedFlavour.Vars[lastIndex][$scope.tubUnderEdit.key] = $scope.tubUnderEdit.value;

            // remove duplicated element
            delete $scope.selectedFlavour.Vars[lastIndex][Object.keys(lastItem)[0]];

            clearAll();
            toastr.success("Item added successfully.");
        }
    };

    $scope.addCategory = function () {
        var i = findCategory();
        if (i > -1) {
            $scope.selectedFlavour = $scope.flavours[i];
            // $scope.updateSelection();
            toastr.warning("Category already exists.");
            $("#categoryInput").focus();
        } else {
            $scope.multiple = true; // we always have at least one category, and we just added one, so there must be multiple now

            // duplicate last category on the list
            var lastIndex = $scope.flavours.length;
            var lastItem = jQuery.extend(true, {}, $scope.flavours[lastIndex - 1]);
            $scope.flavours.push(lastItem);

            // replace name of last category on the list
            $scope.flavours[lastIndex].Name = $scope.category.name;
            
            // change selected category
            $scope.selectedFlavour = $scope.flavours[lastIndex];

            // empty values from new category
            while ($scope.selectedFlavour.Vars.length > 0) {
                $scope.deleteItem(0);
                toastr.remove();
            }

            toastr.success("Category added successfully.");
        }
        $scope.category = {};
        $scope.updateSelection();
    };

    $scope.loadFile = function () {
        var file = document.getElementById("fileLoader").files[0];
        var fileReader = new FileReader();
        
	    fileReader.onload = function(e) {
            $scope.load = angular.fromJson(fileReader.result);
            
            angular.forEach($scope.load, function(item) {
                $scope.category.name = item.Name;
                var i = findCategory();
                if (i > -1) {
                    // if a category in $scope.load is already in $scope.flavours, combine their entries
                    angular.forEach(item.Vars, function(innerItem) {
                        // prioritize the content that is alerady in the GUI
                        $scope.tubUnderEdit.key = Object.keys(innerItem)[0];
                        if (findItem() < 0) {
                            $scope.flavours[i].Vars.push(innerItem);
                        }
                    });
                    $scope.updateSelection();
                } else {
                    // otherwise, add the entire category from $scope.load to $scope.flavours
                    $scope.flavours.push(item);

                    // we now certainly have at least 2 categories
                    $scope.multiple = true;
                }
            });

            clearAll();
            toastr.success("File imported successfully.");
            $scope.$apply();
        }

        fileReader.readAsText(file, $scope);	
    }

    $scope.exportFile = function() {
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

    $scope.updateSelection = function() {
        var items = $scope.selectedFlavour.Vars;
        $scope.currentDisplay = [];

        angular.forEach(items, function(item) {
            $scope.currentDisplay.push({key: Object.keys(item)[0], value: Object.values(item)[0]});
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
        $scope.category.name = $scope.selectedFlavour.Name;
        $scope.originalCategory = $scope.category.name;
        $scope.catEdit = true;
    };

    $scope.applyChanges = function() {
        if ($scope.tubEditOriginal.key == $scope.tubUnderEdit.key && $scope.tubEditOriginal.value == $scope.tubUnderEdit.value) {
            // nothing changed, change nothing
            $scope.tubUnderEdit = $scope.tubEditOriginal = {};
            $scope.edit = false;
            toastr.warning("No changes made.");
        } else if ($scope.tubEditOriginal.key != $scope.tubUnderEdit.key) {
            // can't use findItem() here because it finds the last instance, not the earlier one
            var dup = false;
            var i = 0;
            angular.forEach($scope.currentDisplay, function(item) {
                if (item.key == $scope.tubUnderEdit.key && i != $scope.index) {
                    dup = true;
                }
                i++;
            });
            // key changed, need to delete the old entry and make a new one regardless of whether or not value changed
            if (dup) {
                toastr.warning("Key already used.");
                $("#itemInput").focus();
            } else {
                $scope.selectedFlavour.Vars[$scope.index][$scope.tubUnderEdit.key] = $scope.tubUnderEdit.value;
                delete $scope.selectedFlavour.Vars[$scope.index][$scope.tubEditOriginal.key];
                clearAll();
            }
        } else if ($scope.original.value != $scope.tubUnderEdit.value) {
            // key did not change but value did change, so just adjust the value
            $scope.selectedFlavour.Vars[$scope.index][$scope.tubUnderEdit.key] = $scope.tubUnderEdit.value;
            clearAll();
        }
    };

    $scope.applyCategoryChanges = function() {
        if ($scope.originalCategory == $scope.category.name) {
            // nothing changed, do nothing
            $scope.category = {};
            $scope.catEdit = false;
            toastr.warning("No changes made.");
        } else {
            var i = findCategory();
            if (i > -1) {
                toastr.warning("Category already exists.");
            } else {
                // perform modification
                $scope.selectedFlavour.Name = $scope.category.name;
                $scope.category = {};
                $scope.catEdit = false;
                toastr.success("Category modified successfully.");
            }
        }
    };

    $scope.deleteItem = function(index){
        $scope.tubUnderEdit = $scope.tubEditOriginal = {};
        $scope.edit = false;

        $scope.currentDisplay.splice(index, 1);
        $scope.selectedFlavour.Vars.splice(index, 1);
        toastr.success("Item removed successfully.");
    };

    $scope.deleteCategory = function() {
        if (confirm("Are you sure you want to delete this category?")) {
            $scope.category.name = $scope.selectedFlavour.Name;
            $scope.flavours.splice(findCategory(), 1);
            $scope.selectedFlavour = $scope.flavours[0];
            $scope.updateSelection();

            clearAll();

            if ($scope.flavours.length == 1) {
                $scope.multiple = false; // we're down to 1 category, so remove the "Delete Category" button
            } else {
                $scope.multiple = true;
            }
        }
    };
});