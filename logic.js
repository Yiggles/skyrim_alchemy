var usedEffects = [];
var usedIgredients = [];

function resetData() {
    usedEffects = [];
    usedIgredients = [];
}

function resetLists(num) {
    var _selectBox = document.getElementById("cmb_select_ingredient" + num);
    var _listBox = document.getElementById("resultList" + num);

    removeOptions(_selectBox);
    _listBox.innerHTML = "";

}

function init() {
    activate_combobox("cmb_select_ingredient1", getEffects(), function(selectedValue1) {
        // on the first box, always clear usage data!!!
        resetData();
        fillResultList("resultList1", selectedValue1);
        usedEffects.push(selectedValue1);
        resetLists(2);
        resetLists(3);

        // create and fill the second box
        activate_combobox("cmb_select_ingredient2", getFilteredEffects(), function(selectedValue2) {
            fillResultList("resultList2", selectedValue2);
            usedEffects.push(selectedValue2);
            resetLists(3);

            // create and fill the third box
            activate_combobox("cmb_select_ingredient3", getFilteredEffects(), function(selectedValue3) {
                fillResultList("resultList3", selectedValue3);
                usedEffects.push(selectedValue3);
            });
        });
    });
}


// fills a result list
function fillResultList(id, selectedValue) {
    var list = getFilteredIngredientsForEffect(selectedValue);
    var resultList = document.getElementById(id);

    resultList.innerHTML = "";
    list.forEach(function(e, i) {
        var _listElem = document.createElement("li");
        _listElem.textContent = e.ingredient
        _listElem.value = e.ingredient
        resultList.appendChild(_listElem);

        usedIgredients.push(e);
    });


}

function removeOptions(selectbox) {
    var i;
    for (i = selectbox.options.length - 1; i >= 0; i--) {
        selectbox.remove(i);
    }
}


// creates a select box with prefilled values
function activate_combobox(id, valueList, callback) {

    // create select box, assign ID and register callback
    var _selectBox = document.getElementById(id);
    _selectBox.onchange = function() {
        callback(_selectBox.options[_selectBox.selectedIndex].value);
    }

    removeOptions(_selectBox);

    var _option = document.createElement("option");
    _option.textContent = "Select effect....";
    _option.value = "Select effect....";
    _selectBox.appendChild(_option);

    // add options from given list to the select box
    for (var i = 0; i < valueList.length; i++) {
        var _value = valueList[i];
        var _option = document.createElement("option");
        _option.textContent = _value;
        _option.value = _value;
        _selectBox.appendChild(_option);
    }

}

function getFilteredIngredientsForEffect(effect) {
    var _ingredients = getIngredientsForEffect(effect);
    var _result = _ingredients.filter(function(item) {
        return usedIgredients.indexOf(item) === -1;
    });

    return _result;
}


// get a list of ingredients that have a specific effect
function getIngredientsForEffect(effect) {
    var listOfIngredientsForEffect = [];
    data.forEach(function(elem, index) {
        if (elem.effects.includes(effect)) {
            listOfIngredientsForEffect.push(elem);
        }
    });
    return listOfIngredientsForEffect;
}

// get a list of all ingredients
function getIngredients() {
    var listOfIngredients = []
    data.forEach(function(elem, index) {
        listOfIngredients.push(elem.ingredient);
    });
    return listOfIngredients;
}

function getFilteredEffects() {
    var _effects = getEffects();
    var _result = _effects.filter(function(item) {
        return usedEffects.indexOf(item) === -1;
    });
    return _result;
}

// get a unique list of all effects
function getEffects() {
    var listOfEffects = []
    data.forEach(function(e, i) {
        listOfEffects = listOfEffects.concat(e.effects);
    });
    return unique(listOfEffects);
}

// utility function to make a list unique
function unique(a) {
    return a.sort().filter(function(value, index, array) {
        return (index === 0) || (value !== array[index - 1]);
    });
}

// load the raw data list and create an object for each record
function loadData() {
    var data = [];
    for (var i = 0; i < raw_data.length; i++) {
        data.push(eval({
            ingredient: raw_data[i][0],
            effects: [
                raw_data[i][1],
                raw_data[i][2],
                raw_data[i][3],
                raw_data[i][4]
            ]
        }));
    }

    return data;
}