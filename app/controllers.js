var app = angular.module('rulesManager', []);
app.controller('jsonGUIController', function($scope, $timeout) {

    $scope.item = {};
    $scope.category = {};
    $scope.original = {};
    $scope.originalCategory = "";
    $scope.index = 0;
    var initialCategory = "Default";
    var initialKey = "TEMPLATE_KEY";
    var initialValue = "1234";
    $scope.load = { };
    $scope.rules = [
        {
          "Name" : initialCategory,
          "Vars" : [
                {
                    [initialKey] : initialValue
                },
           ]
        }
    ];
    $scope.selectedCategory = $scope.rules[0];
    $scope.current = [
        {key: Object.keys($scope.selectedCategory.Vars[$scope.index])[0], value: $scope.selectedCategory.Vars[$scope.index][initialKey]},
    ];

    var clearAll = function() {
        $scope.item.key = $scope.item.value = '';
        $scope.category = {};
        $scope.load = { };
        $scope.catEdit = false;
        $scope.edit = false;
    }

    var findItem = function() {
        // return the index if the item key is found in current, -1 otherwise
        var i = 0, final = -1;
        angular.forEach($scope.current, function(item) {
            if (item.key == $scope.item.key) {
                final = i;
            }
            i++;
        });
        return final;
    };

    var findCategory = function() {
        // return the index if the category is found, -1 otherwise
        var i = 0, final = -1;
        angular.forEach($scope.rules, function(item) {
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
            $scope.current.push({key: $scope.item.key, value: $scope.item.value});

            // duplicate last element on the list
            var lastIndex = Object.keys($scope.selectedCategory.Vars).length;
            var lastItem = jQuery.extend(true, {}, $scope.selectedCategory.Vars[lastIndex - 1]);
            $scope.selectedCategory.Vars.push(lastItem);

            // replace content of last element on the list
            $scope.selectedCategory.Vars[lastIndex][$scope.item.key] = $scope.item.value;

            // remove duplicated element
            delete $scope.selectedCategory.Vars[lastIndex][Object.keys(lastItem)[0]];

            clearAll();
            toastr.success("Item added successfully.");
        }
    };

    $scope.addCategory = function () {
        var i = findCategory();
        if (i > -1) {
            $scope.selectedCategory = $scope.rules[i];
            // $scope.updateSelection();
            toastr.warning("Category already exists.");
            $("#categoryInput").focus();
        } else {
            $scope.multiple = true; // we always have at least one category, and we just added one, so there must be multiple now

            // duplicate last category on the list
            var lastIndex = $scope.rules.length;
            var lastItem = jQuery.extend(true, {}, $scope.rules[lastIndex - 1]);
            $scope.rules.push(lastItem);

            // replace name of last category on the list
            $scope.rules[lastIndex].Name = $scope.category.name;
            
            // change selected category
            $scope.selectedCategory = $scope.rules[lastIndex];

            // empty values from new category
            while ($scope.selectedCategory.Vars.length > 0) {
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
                    // if a category in $scope.load is already in $scope.rules, combine their entries
                    angular.forEach(item.Vars, function(innerItem) {
                        // prioritize the content that is alerady in the GUI
                        $scope.item.key = Object.keys(innerItem)[0];
                        if (findItem() < 0) {
                            $scope.rules[i].Vars.push(innerItem);
                        }
                    });
                    $scope.updateSelection();
                } else {
                    // otherwise, add the entire category from $scope.load to $scope.rules
                    $scope.rules.push(item);

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
        var data = new Blob([angular.toJson($scope.rules, true)], {type: 'text/plain'});
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
        var items = $scope.selectedCategory.Vars;
        $scope.current = [];

        angular.forEach(items, function(item) {
            $scope.current.push({key: Object.keys(item)[0], value: Object.values(item)[0]});
        });

        clearAll();
    };

    $scope.editItem = function(index) {
        $scope.index = index;
        $scope.item = $scope.current[index];
        $scope.original = jQuery.extend(true, {}, $scope.item);
        $scope.edit = true;
    };

    $scope.editCategory = function() {
        $scope.category.name = $scope.selectedCategory.Name;
        $scope.originalCategory = $scope.category.name;
        $scope.catEdit = true;
    };

    $scope.applyChanges = function() {
        if ($scope.original.key == $scope.item.key && $scope.original.value == $scope.item.value) {
            // nothing changed, change nothing
            $scope.item = $scope.original = {};
            $scope.edit = false;
            toastr.warning("No changes made.");
        } else if ($scope.original.key != $scope.item.key) {
            // can't use findItem() here because it finds the last instance, not the earlier one
            var dup = false;
            var i = 0;
            angular.forEach($scope.current, function(item) {
                if (item.key == $scope.item.key && i != $scope.index) {
                    dup = true;
                }
                i++;
            });
            // key changed, need to delete the old entry and make a new one regardless of whether or not value changed
            if (dup) {
                toastr.warning("Key already used.");
                $("#itemInput").focus();
            } else {
                $scope.selectedCategory.Vars[$scope.index][$scope.item.key] = $scope.item.value;
                delete $scope.selectedCategory.Vars[$scope.index][$scope.original.key];
                clearAll();
            }
        } else if ($scope.original.value != $scope.item.value) {
            // key did not change but value did change, so just adjust the value
            $scope.selectedCategory.Vars[$scope.index][$scope.item.key] = $scope.item.value;
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
                $scope.selectedCategory.Name = $scope.category.name;
                $scope.category = {};
                $scope.catEdit = false;
                toastr.success("Category modified successfully.");
            }
        }
    };

    $scope.deleteItem = function(index){
        $scope.item = $scope.original = {};
        $scope.edit = false;

        $scope.current.splice(index, 1);
        $scope.selectedCategory.Vars.splice(index, 1);
        toastr.success("Item removed successfully.");
    };

    $scope.deleteCategory = function() {
        if (confirm("Are you sure you want to delete this category?")) {
            $scope.category.name = $scope.selectedCategory.Name;
            $scope.rules.splice(findCategory(), 1);
            $scope.selectedCategory = $scope.rules[0];
            $scope.updateSelection();

            clearAll();

            if ($scope.rules.length == 1) {
                $scope.multiple = false; // we're down to 1 category, so remove the "Delete Category" button
            } else {
                $scope.multiple = true;
            }
        }
    };
});