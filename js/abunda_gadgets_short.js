﻿// JScript File

function SetGadgetPage(page) {
    for (i = 0; i < 4; i++) {
        console.log(jQuery(".page" + i).get(0));
        jQuery("#abundatrade_gadget .page" + i).get(0).innerHTML = '';
        jQuery("#abundatrade_gadget .page" + i).removeClass('gad_left');
        jQuery("#abundatrade_gadget .page" + i).removeClass('gad_open');
        jQuery("#abundatrade_gadget .page" + i).removeClass('gad_right');
        if (i < page) {
            jQuery("#abundatrade_gadget .page" + i).addClass('gad_left');
        }
        if (i == page) {
            jQuery("#abundatrade_gadget .page" + i).addClass('gad_open');
            drawPage(page);
        }
        if (i > page) {
            jQuery("#abundatrade_gadget .page" + i).addClass('gad_right');
        }
    }
}

function drawCategoryPage(data) {
    if (data.valid) {
        jQuery("#carrier_selection").get(0).innerHTML = "";
        jQuery("#device_selection").get(0).innerHTML = "";
        jQuery("#condition_selection").get(0).innerHTML = "";
        jQuery("#quote").get(0).innerHTML = "";
        jQuery("#category_selection").get(0).innerHTML = "<p>Loading</p>";
        jQuery("#manufacturer_selection").get(0).innerHTML = "<p>Select a category above</p>";
        var output = "<p>Category:</p><select id='gad_cat' onChange='changeCat()'><option value='-1'>Choose a category</option>"
        for (i = 0; i < data.output.data.length; i++) {
            output += "<option value='" + data.output.data[i].id + "'>" + data.output.data[i].name + "</option>";
        }
        jQuery("#category_selection").get(0).innerHTML = output + "</select>";

        if (setCat != null) {
            jQuery("#gad_cat").val(setCat);
            changeCat();
        }
    }
}

function drawMfgPage() {
    jQuery("#device_selection").get(0).innerHTML = "";
    jQuery("#condition_selection").get(0).innerHTML = "";
    jQuery("#quote").get(0).innerHTML = "";
    jQuery("#manufacturer_selection").get(0).innerHTML = "<p>Loading</p>";
    jQuery("#carrier_selection").get(0).innerHTML = "<p>Select a manufacturer above</p>";
    var output = "<p>Manufacturers:</p><select id='gad_man' onChange='changeMan()'>";
    var ids = Object.keys(mans);
    if (ids.length > 1) {
        output += "<option value='-1'>Choose a manufacturer</option>";
    }
    for (i = 0; i < ids.length; i++) {
        output += "<option value='" + ids[i] + "'>" + mans[ids[i]] + "</option>";
    }
    jQuery("#manufacturer_selection").get(0).innerHTML = output + "</select>";
    if (ids.length == 1) {
        changeMan();
    }
    else if (setMan != null) {
        jQuery("#gad_man").val(setMan);
        changeMan();
    }
}

function drawCarPage() {
    jQuery("#condition_selection").get(0).innerHTML = "";
    jQuery("#quote").get(0).innerHTML = "";
    jQuery("#carrier_selection").get(0).innerHTML = "<p>Loading</p>";
    jQuery("#device_selection").get(0).innerHTML = "<p>Select a carrier above</p>";
    var output = "<p>Carrier:</p><select id='gad_car' onChange='changeCar()'>";
    var ids = Object.keys(cars);
    if (ids.length > 1) {
        output += "<option value='-1'>Choose a carrier</option>";
    }
    for (i = 0; i < ids.length; i++) {
        output += "<option value='" + ids[i] + "'>" + cars[ids[i]] + "</option>";
    }
    jQuery("#carrier_selection").get(0).innerHTML = output + "</select>";
    if (ids.length == 1) {
        changeCar();
    } else if (setCar != null) {
        jQuery("#gad_car").val(setCar);
        changeCar();
    }
}

function drawDevPage() {
    jQuery("#quote").get(0).innerHTML = "";
    jQuery("#device_selection").get(0).innerHTML = "<p>Loading</p>";
    jQuery("#condition_selection").get(0).innerHTML = "<p>Select a device</p>";
    var output = "<p>Select a device</p><select id='gad_dev' onChange='changeDev()'>";
    var ids = Object.keys(devs);
    if (ids.length > 1) {
        output += "<option value='-1'>Choose a device</option>";
    }
    for (i = 0; i < ids.length; i++) {
        output += "<option value='" + ids[i] + "'>" + devs[ids[i]] + "</option>";
    }
    jQuery("#device_selection").get(0).innerHTML = output + "</select>";
    if (ids.length == 1) {
        changeDev();
    }
    else if (setDev != null) {
        jQuery("#gad_dev").val(setDev);
        changeDev();
    }
}

function drawCondPage() {
    jQuery("#condition_selection").get(0).innerHTML = "<p>Loading</p>";
    jQuery("#quote").get(0).innerHTML = "";
    var output = "<p>Select a condition</p><select id='gad_cond' onChange='changeCond()'>";
    var ids = conditions.prices;
    if (ids.length > 1) {
        output += "<option value='-1'>Choose a condition</option>";
    }
    for (i = 0; i < ids.length; i++) {
        output += "<option value='" + i + "'>" + ids[i].condition + "</option>";
    }
    jQuery("#condition_selection").get(0).innerHTML = output + "</select>";
    if (ids.length == 1) {
        changeCond();
    }
    else if (setCond != null) {
        jQuery("#gad_cond").val(setCond);
        changeCond();
    }
}

var mans = Object();
var cars = Object();
var devs = Object();
var conditions = Object();

var setCat = null;
var setCar = null;
var setDev = null;
var setCond = null;
var setMan = null;

function changeCond() {
    var catID = jQuery("#gad_cat").val();
    var manID = jQuery("#gad_man").val();
    var carID = jQuery("#gad_car").val();
    var devID = jQuery("#gad_dev").val();
    var condID = jQuery("#gad_cond").val();
    jQuery("#quote").get(0).innerHTML = "<h1>$" + (conditions.prices[condID].price) + ".00</h1>";
}

function changeDev() {
    var catID = jQuery("#gad_cat").val();
    var manID = jQuery("#gad_man").val();
    var carID = jQuery("#gad_car").val();
    var devID = jQuery("#gad_dev").val();
    conditions = Object();
    var request = jQuery.ajax("http://" + abundacalc.server + "/trade/process/ajax-post-public.php?action=get&object=TradePermProductData&category_id=" + catID + "&manufacturer_id=" + manID + "&carrier_id=" + carID + "&ean=" + devID, { dataType: 'jsonp' });
    request.success(function (data) {
        buildUniqueArray(conditions, 'prices', data, 'prices', true);
        drawCondPage();
    });
}

function changeCar() {
    var catID = jQuery("#gad_cat").val();
    var manID = jQuery("#gad_man").val();
    var carID = jQuery("#gad_car").val();
    devs = Object();
    var request = jQuery.ajax("http://" + abundacalc.server + "/trade/process/ajax-post-public.php?action=get&object=TradePermProductData&category_id=" + catID + "&manufacturer_id=" + manID + "&carrier_id=" + carID, { dataType: 'jsonp' });
    request.success(function (data) {
        buildUniqueArray(devs, 'ean', data, 'title');
        drawDevPage();
    });
}

function changeMan() {
    var catID = jQuery("#gad_cat").val();
    var manID = jQuery("#gad_man").val();
    cars = Object();
    var request = jQuery.ajax("http://" + abundacalc.server + "/trade/process/ajax-post-public.php?action=get&object=TradePermProductData&category_id=" + catID + "&manufacturer_id=" + manID, { dataType: 'jsonp' });
    request.success(function (data) {
        buildUniqueArray(cars, "carrier_id", data, "carrier_name");
        drawCarPage();
    });
}

function changeCat() {
    var catID = jQuery("#gad_cat").val();
    mans = Object();
    var request = jQuery.ajax("http://" + abundacalc.server + "/trade/process/ajax-post-public.php?action=get&object=TradePermProductData&category_id=" + catID, { dataType: 'jsonp' });
    request.success(function (data) {
        if (data.valid) {
            buildUniqueArray(mans, "manufacturer_id", data, "mfg_name");
            drawMfgPage();
        }
    });
}

function buildUniqueArray(ar, name, data, to, override) {
    var vname = '';
    for (i = 0; i < data.output.data.length; i++) {
        vname = data.output.data[i][name];
        if (override) {
            vname = name;
        }
        if (ar[vname] == null) ar[vname] = data.output.data[i][to];
    }
}

function getCategories() {
    var request = jQuery.ajax("http://" + abundacalc.server + "/trade/process/ajax-post-public.php?action=get&object=TradeCategory", { dataType: 'jsonp' });
    request.success(function (data) {
        drawCategoryPage(data);
    });
}

function findMessage(data) {
    var ids = Object.keys(data);
    for (var i = 0; i < ids.length; i++) {
        if (data[ids[i]]['name'] != null) {
            if (data[ids[i]]['name'] == 'your-message') {
                return ids[i];
            }
        }
    }
    return 4;
}

function determineStart() {
    if (getParameterByName("gadget") == 'true') {
        if (getParameterByName("cat") != "") {
            setCat = getParameterByName("cat");
        }
        if (getParameterByName("man") != "") {
            setMan = getParameterByName("man");
        }
        if (getParameterByName("car") != "") {
            setCar = getParameterByName("car");
        }
        if (getParameterByName("dev") != "") {
            setDev = getParameterByName("dev");
        }
        if (getParameterByName("cond") != "") {
            setCond = getParameterByName("cond");
        }

        // This is our hook to capture the form data
        jQuery("div.wpcf7 > form").bind('form-submit-validate', function (a, data, options, veto) {
            var id = findMessage(data);
            data[id].value += "Featured gadget: " + devs[jQuery("#gad_dev").val()] + "\n with condition: " + conditions.prices[jQuery("#gad_cond").val()].condition + "\n Quoted at: " + conditions.prices[jQuery("#gad_cond").val()].price;
        });

        getCategories();
    }
}

jQuery(window).ready(determineStart());