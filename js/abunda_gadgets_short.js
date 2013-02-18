// JScript File

function drawCategoryPage(data) {
    if (data.valid) {
        jQuery("#carrier_selection").get(0).innerHTML = "";
        jQuery("#device_selection").get(0).innerHTML = "";
        jQuery("#condition_selection").get(0).innerHTML = "";
        jQuery("#quote").get(0).innerHTML = "";
        jQuery("#category_selection").get(0).innerHTML = "<p>Loading</p>";
        jQuery("#manufacturer_selection").get(0).innerHTML = "<p>Select a gadget above</p>";
        var output = "<p>Select My Gadget:</p><select name='gad_cat' id='gad_cat' onChange='changeCat()'><option value='-1'>Gadgets</option>"
        for (i = 0; i < data.output.data.length; i++) {
            output += "<option value='" + data.output.data[i].id + "'>" + data.output.data[i].name + "</option>";
        }
        output += "<option value='-2'>Other</option>";
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
    jQuery("#carrier_selection").get(0).innerHTML = "";
    var output = "<p>Manufacturer:</p><select name='gad_man' id='gad_man' onChange='changeMan()'>";
    var ids = Object.keys(mans);
    if (ids.length > 1) {
        output += "<option value='-1'>Choose a Manufacturer</option>";
    }
    for (i = 0; i < ids.length; i++) {
        output += "<option value='" + ids[i] + "'>" + mans[ids[i]] + "</option>";
    }
    output += "<option value='-2'>I don't know</option>";
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
    jQuery("#device_selection").get(0).innerHTML = "";
    var output = "<p>Carrier:</p><select name='gad_car' id='gad_car' onChange='changeCar()'>";
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
    jQuery("#condition_selection").get(0).innerHTML = "";
    var output = "<p>Select a device</p><select name='gad_dev' id='gad_dev' onChange='changeDev()'>";
    var ids = Object.keys(devs);
    if (ids.length > 1) {
        output += "<option value='-1'>Choose a device</option>";
    }
    for (i = 0; i < ids.length; i++) {
        output += "<option value='" + ids[i] + "'>" + devs[ids[i]] + "</option>";
    }
    output += "<option value='-2'>I Don't Know</option>";
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
    var output = "<p>Select a condition</p><input type='hidden' name='quote_val' id='quote_val' value='0'><select name='gad_cond' id='gad_cond' onChange='changeCond()'>";
    var ids = conditions.prices;
    if (ids.length > 1) {
        output += "<option value='-1'>Choose a condition</option>";
    }
    for (i = 0; i < ids.length; i++) {
        output += "<option value='" + i + "'>" + ids[i].condition + "</option>";
    }
    output += "<option value='-2'>Damaged</option>";
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
    if (condID < 0) {
        jQuery("#quote").get(0).innerHTML = "";
        if (condID == -2) {
            ShowDescription("damaged");
        }
        if (jQuery("#quote_container_div").is(":visible")) {
            jQuery("#quote_container_div").slideUp();
        }
        return;
    }
    if (!jQuery("#quote_container_div").is(":visible")) {
        jQuery("#quote_container_div").slideDown();
    }
    ShowDescription("featured");
    jQuery("#quote_val").val((conditions.prices[condID].price));
    jQuery("#quote").get(0).innerHTML = "<span class='text-small'>This is an estimated quote based on the accuracy of the information entered.</span><h1>$" + (conditions.prices[condID].price) + ".00</h1>";
}

function changeDev() {
    var catID = jQuery("#gad_cat").val();
    var manID = jQuery("#gad_man").val();
    var carID = jQuery("#gad_car").val();
    var devID = jQuery("#gad_dev").val();
    if (devID < 0) {
        jQuery("#condition_selection").get(0).innerHTML = "";
        jQuery("#quote").get(0).innerHTML = "";
        if (devID == -2) {
            ShowDescription("unknown");
        }
        HideQuote();
        return;
    }
    HideDescription();
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
    if (carID < 0) {
        jQuery("#device_selection").get(0).innerHTML = "";
        jQuery("#condition_selection").get(0).innerHTML = "";
        jQuery("#quote").get(0).innerHTML = "";
        if (carID == -2) {
            ShowDescription("unknown");
        }
        HideQuote();
        return;
    }
    HideDescription();
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
    if (manID < 0) {
        jQuery("#carrier_selection").get(0).innerHTML = "";
        jQuery("#device_selection").get(0).innerHTML = "";
        jQuery("#condition_selection").get(0).innerHTML = "";
        jQuery("#quote").get(0).innerHTML = "";
        if (manID == -2) {
            ShowDescription("unknown");
        }
        HideQuote();
        return;
    }
    HideDescription();
    cars = Object();
    var request = jQuery.ajax("http://" + abundacalc.server + "/trade/process/ajax-post-public.php?action=get&object=TradePermProductData&category_id=" + catID + "&manufacturer_id=" + manID, { dataType: 'jsonp' });
    request.success(function (data) {
        buildUniqueArray(cars, "carrier_id", data, "carrier_name");
        drawCarPage();
    });
}

function changeCat() {
    var catID = jQuery("#gad_cat").val();
    if (catID < 0) {
        jQuery("#manufacturer_selection").get(0).innerHTML = "";
        jQuery("#carrier_selection").get(0).innerHTML = "";
        jQuery("#device_selection").get(0).innerHTML = "";
        jQuery("#condition_selection").get(0).innerHTML = "";
        jQuery("#quote").get(0).innerHTML = "";
        if (catID == -2) {
            ShowDescription("other");
        }
        else {
            HideDescription();
        }
        HideQuote();
        if (jQuery("#large_container_div").is(":visible")) {
            jQuery("#large_container_div").slideUp();
        }
        return;
    }
    if (!jQuery("#large_container_div").is(":visible")) {
        jQuery("#large_container_div").slideDown();
    }
    HideDescription();
    HideQuote();
    mans = Object();
    var request = jQuery.ajax("http://" + abundacalc.server + "/trade/process/ajax-post-public.php?action=get&object=TradePermProductData&category_id=" + catID, { dataType: 'jsonp' });
    request.success(function (data) {
        if (data.valid) {
            buildUniqueArray(mans, "manufacturer_id", data, "mfg_name");
            drawMfgPage();
        }
    });
}

function changeFree() {
    if (jQuery("#choose_dvd").val() == '-2') {
    }
    else if (jQuery("#choose_dvd").val() < 0) {
        jQuery("[type='submit']").attr("disabled", "disabled");
        return;
    }

    jQuery("[type='submit']").removeAttr("disabled")
}

function HideForm() {
    if(jQuery("#master_container_contact").is(":visible")) {
        jQuery("#master_container_contact").slideUp();
    }
}

function ShowForm() {
    if (!jQuery("#master_container_contact").is(":visible")) {
        jQuery("#master_container_contact").slideDown();
    }
}

function HideQuote() {
    if (jQuery("#quote_container_div").is(":visible")) {
        jQuery("#quote_container_div").slideUp();
    }
}

function ShowDescription(anyDevice) {
    if (anyDevice == 'featured') {
        jQuery("#desc_desc").get(0).innerHTML = "Please add any additional information such as detailed condition description and accessories included or not included.";
    }
    else if (anyDevice == 'damaged') {
        jQuery("#desc_desc").get(0).innerHTML = "Please add any additional information such as detailed condition description and accessories included or not included.";
    }
    else {
        jQuery("#desc_desc").get(0).innerHTML = "Please tell us about your gadget including complete model information, detailed condition description, and accessories included or not included.";
    }
    if (!jQuery(".description_container").is(":visible")) {
        jQuery(".description_container").slideDown();
    }
    ShowForm();
}

function HideDescription() {
    if (jQuery(".description_container").is(":visible")) {
        jQuery(".description_container").slideUp();
    }
    HideForm();
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
        if (jQuery("#finalize").is(":visible")) {
            finalize_quote();
            return;
        }
        else {
            drawCategoryPage(data);
        }
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

function finalize_quote() {
    var request = jQuery.ajax("http://" + abundacalc.server + "/trade/process/finalize_quote.php", {
        dataType: 'jsonp',
        data: {
            ean: getParameterByName('gad_dev'),
            val: getParameterByName('quote_val'),
            cond: getParameterByName('gad_cond'),
            description: getParameterByName('description_entry'),
            name: getParameterByName('my_name'),
            email: getParameterByName('email'),
            phone: getParameterByName('phone'),
            street: getParameterByName('address_street'),
            city: getParameterByName('address_city'),
            state: getParameterByName('address_state'),
            zip: getParameterByName('address_zip')
        }
    });
    
    request.success(function (data) {
        window.location.href = "http://abundatrade.com/free-cd-dvd-with-gadget-trade.php";
    });
}

function determineStart() {
    if (getParameterByName("gadget") == 'true') {

        if (getParameterByName("dvd") != "") {
            changeFree();
        }

        if (getParameterByName("gad_cat") != "") {
            setCat = getParameterByName("gad_cat");
        }
        if (getParameterByName("gad_man") != "") {
            setMan = getParameterByName("gad_man");
        }
        if (getParameterByName("gad_car") != "") {
            setCar = getParameterByName("gad_car");
        }
        if (getParameterByName("gad_dev") != "") {
            setDev = getParameterByName("gad_dev");
        }
        if (getParameterByName("gad_cond") != "") {
            setCond = getParameterByName("gad_cond");
        }

        getCategories();
    }
}

jQuery(determineStart());