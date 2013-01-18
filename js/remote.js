// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name remote.min.js
// ==/ClosureCompiler==

/*****************************************************************
* file: remote.js
*
* Abundatrade calculator communication and processing scripts.
* Handles the AJAX calls to the Abundatrade server.
*
*****************************************************************/

/*
jQuery('td:contains("024543525998")').parent()
.find('td')
.wrapInner('<div style="display: block;" />')
.parent()
.find('td > div')
.slideUp("slow", function(){

jQuery(this).parent().parent().remove();

});

^^ Hides a row ^^

jQuery('#my_table > tbody > tr')
.find('td')
.wrapInner('<div style="display: none;" />')
.parent()
.find('td > div')
.slideDown("slow", function(){

var $set = jQuery(this);
$set.replaceWith($set.contents());

^^ adds a row ^^

});

*/

/**
* The number of items [defunct]
*/
var number_item = 1;

/**
* A list of items to clean up
*/
var itemsToDispose = [];

/*
* function: clear_product_code() 
*
* Format the product code with alphanumerics only.
*
*/
function clean_product_code(element) {
    element.value = element.value.replace(/\W+/g, "");
}

/*
* function: validateEmail()
*
* prevalidates an email address
*
*/
function validateEmail(email, confirm) {
    if (email.toLowerCase() == confirm.toLowerCase()) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    else return 'nomatch';
}

function abundatrade_logout() {
    var request = jQuery.ajax({
        type: 'POST',
        url: 'http://' + abundacalc.server + '/trade/process/user/logout/',
        dataType: 'jsonp'
    });
    request.done(function(data) {
        get_login_status();
    });
}

var just_logging_in = false;

function abundatrade_login() {
    just_logging_in = true;
    submit_modal(null, null);
}

var loggedIn = false;

function do_tour() {
    if (jQuery('#abundaGadgetInput').length > 0 && jQuery('#gadget_abundatrade').css('display') == 'block') {
        // for gadget side
    }
    else {
        // for regular calculator
        jQuery.prompt(tourstates);
    }
}

function calc_state() {
    if (jQuery('#abundaGadgetInput').length > 0 && jQuery('#gadget_abundatrade').css('display') == 'block') {
        return 'gadget';
    }
    else {
        return 'normal';
    }
}

function get_login_status() {

    tour = "<span style='float:right;'><a href='#' onclick='do_tour(); return false;'>Take a tour</a></span>";

    if (jQuery("#login_status_abundatrade").val() != null) {
        jQuery("#login_status_abundatrade").get(0).innerHTML = "<img src='" + abundacalc.url + "/images/spinner.gif'>";
        var request = jQuery.ajax(
            {
                type: 'POST',
                url: 'http://' + abundacalc.server + '/trade/process/user/status/',
                dataType: 'jsonp'
            }
        );
        request.done(function(data) {
            if (data.status) {
                jQuery('#login_status_abundatrade').get(0).innerHTML = "Hello " + data.first_name + " " + data.last_name + " <em><a onclick=\"abundatrade_logout()\">logout</a></em> <em>View your <a href='http://abundatrade.com/trade/user/profile/' title='View your information, and edit past valuations!'>profile</a></em>" + tour;
                if (data.first_name == 'Super Cow')
                    loggedIn = false;
                else loggedIn = true;
            }
            else {
                jQuery('#login_status_abundatrade').get(0).innerHTML = "<em><a onclick=\"abundatrade_login()\">Login/Register</a></em>" + tour;
                loggedIn = false;
            }
        });
    }
}

/*
* function: clear_session()
*
* Clear out all data for this session, including prior saved data.
* Request goes to the backend to clear data.
*
*/
function clear_session(obj) {
    if (!jQuery(obj).hasClass('disabled')) {
        jQuery.prompt(
            'Are you sure you want to delete the entire listing?',
            {
                buttons: { Delete: true, Cancel: false },
                submit: function (e, v, m, f) {
                    if (v) {
                        var request = jQuery.ajax(
                            {
                                type: 'GET',
                                url: 'http://' + abundacalc.server + '/trade/process/request.php',
                                data: 'action=clear_session',
                                dataType: 'jsonp'
                            });

                        request.done(function (data) {
                            //jQuery('#abundaCalcTbl > tbody').children().remove();
                            jQuery('#abundaCalcBody_request').children().remove();

                            data.total_qty = "0.00";
                            data.currency_for_total = "$";
                            data.total = "0.00";
                            display_totals(data);
                        });

                        request.fail(function (data, textStatus, errorThrown) {
                            report_error("clear_session", data);
                        });
                    }
                }
            }
            );
    }
    number_item = 1;
}

function report_error(error_function, response) {
    jQuery.prompt("Please send us an error report or select OK to just continue", {
        title: "There was some kind of error!!", buttons: { "Submit Error Report": true, "OK": false }, submit: function (e, v, m, f) {
            if (v) {
                var request = jQuery.ajax({
                    type: 'POST',
                    url: 'http://' + abundacalc.server + '/trade/process/error.php',
                    data: 'error=' + error_function + '&response=' + escape(response.responseText) + '&app=' + navigator.appVersion + '&loc=' + escape(location.href),
                    dataType: 'jsonp'
                });
            }
        }
    });
}

/*
* function: new_session()
*
* Give user a new session id.  This detaches any prior connection to the backend data.
*
*/
function new_session(this_link) {
    number_item = 1;
    var request = jQuery.ajax(
        {
            type: 'GET',
            url: 'http://' + abundacalc.server + '/trade/process/request.php',
            data: 'action=new_session',
            dataType: 'jsonp'
        });
    request.done(function (data) { });
    request.fail(function (jqXHR, textStatus, errorThrown) {
        //alert("Request failed: " + textStatus + " - " + errorThrown);
        please_wait(false);
    });
}

/*
* function: display_totals()
*
* Render the header/footer totals from JSONP data.
*
*/
function display_totals(data, no_reset) {
    if (!no_reset) {
        jQuery('#product_code').val('');
    }
    jQuery('#item_count').html(data.total_qty);
    jQuery('#total_item_count').html(data.total_qty);
    jQuery('#grand_total').html(data.currency_for_total + data.total);
    jQuery('#total_prevaluation').html(data.currency_for_total + data.total);

    // Turn off the UI Lock
    //    
    please_wait(false);

    // Enable/Disable Submit based on Total Qty
    //
    if (jQuery('#total_item_count').text() > 0) {
        jQuery('#submitList').removeClass('disabled');
        jQuery('#submitList').removeAttr('style');
    } else {
        jQuery('#submitList').addClass('disabled');
        jQuery('#submitList').attr('style', 'cursor:default');
    }

    // Set the delete button
    //
    jQuery('.delete_this_row').attr('onclick', 'delete_the_row(this); return false;');
    if (!no_reset) {
        jQuery('#product_qty').val('1');
        jQuery('#product_code').focus();
    }
}

/**
* Opens the bulk upload bin real pretty like
*/
function bulk_open() {
    //do accordian stuff
    jQuery("#bulk_button").slideUp(1000);
    jQuery("#abundaCalcTbl").fadeOut(400).delay(100);
    jQuery("#second_content").slideUp(500);
    jQuery("#top_input_section").fadeOut(500);
    jQuery("#bulk").slideDown(500);
    return false;
}

/* Closes the bulk upload bin and reloads the session
*/
function bulk_close_window() {

    jQuery("#bulk").slideUp(500);
    jQuery("#top_input_section").fadeIn(500);
    jQuery("#second_content").slideDown(500);
    jQuery("#abundaCalcTbl").delay(100).fadeIn(400);
    jQuery("#bulk_button").slideDown(1000);
    load_previous_session(false);
    return false;
}

/** Gets the rows for the bulk upload bin */
function rows() {
    var lines;
    var TA = jQuery("#bulk_upload").val();
    if (document.all) { // IE
        lines = TA.split("\r\n");
    }
    else { //Mozilla
        lines = TA.split("\n");
    }

    return lines;
}

/** The bulk upload final page for submission */
var bulk_final = "<div style=''><div style='border: 1px solid #1C1C1C; text-align:justify; padding:5px;'>Your submission has been sent to Abundatrade for processing. We're getting the real time values of your items right now and will send you an email when it is complete. The progress bar below is how far along we are at processing your items.</div><br/><div id='bar_wrap' style='border: 1px solid #1C1C1C;    background-color: #313131;    -webkit-box-shadow: 0 0 1px #666, inset 0 1px 1px #222;    -moz-box-shadow: 0 0 1px #666, inset 0 1px 1px #222;    -o-box-shadow: 0 0 1px #666, inset 0 1px 1px #222;    box-shadow: 0 0 1px #666, inset 0 1px 1px #222;    background-image: -webkit-linear-gradient(#323232, #2E2E2E 50%, #323232);    background-image: -moz-linear-gradient(#323232, #2E2E2E 50%, #323232);    background-image: -o-linear-gradient(#323232, #2E2E2E 50%, #323232);'><div id='bar' class='bar' style='height: 30px;background-color: #5387BA; border-right: 1px solid #282828;-webkit-box-shadow: inset 0 0 1px #ddd; -moz-box-shadow: inset 0 0 1px #ddd; -o-box-shadow: inset 0 0 1px #ddd; box-shadow: inset 0 0 1px #ddd; background-image: -webkit-linear-gradient(#66A3E2, #5387BA 50%, #4B79AF 51%, #385D87); background-image: -moz-linear-gradient(#66A3E2, #5387BA 50%, #4B79AF 51%, #385D87); background-image: -o-linear-gradient(#66A3E2, #5387BA 50%, #4B79AF 51%, #385D87); -webkit-transition: all 1s ease; -moz-transition: all 1s ease; -o-transition: all 1s ease; width:0%;'></div></div><div class='captions' style='padding: 5px 2px 0;'><div class='left' id='progress'></div><div class='right' id='percent'>0%</div></div></div>";

/** Submits a bulk upload */
function bulk_submit_items() {

    submit_modal(submit_bulk, bulk_final);

    return; //stop execution here and delete all this and below later
}

/** Displays the bulk upload status */
function display_bulk_upload(display_prompt, id) {
    if (display_prompt) {
        jQuery.prompt({ state: { html: bulk_final, buttons: {}} }, {});
    }

    var donot_reset = false;

    if (id == null) {
        id = abundacalc['upload_id'];
        donot_reset = true;
    }

    var stop = setInterval(function () {
        var request = jQuery.ajax(
            {
                type: 'POST',
                url: 'http://' + abundacalc.server + '/trade/process/request.php',
                data: "action=get_status&id=" + id,
                dataType: 'jsonp'
            });

        request.success(function (data) {
            if (data.error == false || data.on == 0) {
                percent = data.on / data.total * 100;

                if (data.on == 1 && data.total == 1) {
                    jQuery("#progress").get(0).innerHTML = "Processing complete -- building your email";
                }
                else if (data.on == 2 && data.total == 2) {
                    //processing complete
                    clearInterval(stop);
                    jQuery("#bar").css('width', percent + "%")
                    jQuery("#progress").get(0).innerHTML = "Processing complete -- sending your valuation to you ";
                    jQuery("#percent").get(0).innerHTML = Math.round(percent) + "%";

                    if (!donot_reset) {
                        fin = setInterval(function () {
                            clearInterval(fin);
                            jQuery.prompt.close();
                            bulk_close_window();
                            load_previous_session(true);
                        }, 2000);
                    }
                }
                else {
                    //display status
                    jQuery("#bar").css('width', percent + "%")
                    jQuery("#progress").get(0).innerHTML = data.on + " of approx. " + data.total;
                    jQuery("#percent").get(0).innerHTML = Math.round(percent) + "%";
                }
            }
        });
    }, 1000);
}

/** Submits the jsonp bulk upload list */
function submit_bulk(val) {

    str = "";

    jQuery.each(val, function (i, obj) {
        str += '&' + i + '=' + obj;
    });

    str += '&bulkinput=' + encodeURI(jQuery("#bulk_upload").val());

    str += '&location=' + window.location.href;

    var request = jQuery.ajax(
{
    type: 'POST',
    url: 'http://' + abundacalc.server + '/trade/process/bulk_copy.php',
    data: str,
    dataType: 'jsonp'
});

    request.success(function (data) {
        new_session();
        id = data[0].data;
        display_bulk_upload(false, id);
    });
}

/*
* function: delete_the_row()
*
* Delete a selected row.
*
*/
function delete_the_row(obj) {
    var product_code = jQuery(obj).parents('tr').children('.upc').text();
    var request = jQuery.ajax(
        {
            type: 'GET',
            url: 'http://' + abundacalc.server + '/trade/process/deleteItem.php',
            data: 'product=' + product_code,
            dataType: 'jsonp'
        });

    request.success(function (data) {
        display_totals(data);
    });

    //count affected rows
    x = jQuery('td:contains("' + product_code + '")');
    number_item -= x.length;

    //jQuery(obj).parents('tr').remove();
    jQuery('td:contains("' + product_code + '")').parent()
         .find('td')
         .wrapInner('<div style="display: block;" />')
         .parent()
         .find('td > div')
         .slideUp("slow", function () {

             jQuery(this).parent().parent().remove();

         });
}

/*
* function: load_previous_session()
*
* Lookup the session on the Abundatrade backend and
* load up the table based on the results.
*
*/
function load_previous_session(pretty, ignore_errors) {
    var request = jQuery.ajax(
        {
            type: 'GET',
            url: 'http://' + abundacalc.server + '/trade/process/request.php',
            data: 'action=load_previous_session',
            dataType: 'jsonp'
        });

    request.success(function (data) {
        jQuery('#abundaCalcBody_request').children().remove();

        data.total_qty = "0.00";
        data.currency_for_total = "$";
        data.total = "0.00";

        for (i = 0; i < data.length; i++) {
            part = data[i];
            part.row = jQuery.parseJSON(part.row);
            part = build_row(part);
            jQuery('#abundaCalcTbl').prepend(part.row_html);
            if (pretty) {
                jQuery('td:contains("' + part.product_code + '")').parent()
                    .find('td')
                    .wrapInner('<div style="display: none;" />')
                    .parent()
                    .find('td > div')
                    .slideDown("slow", function () { var $set = jQuery(this); $set.replaceWith($set.contents()); })
            }

            display_totals(part, ignore_errors);
        }
        //build_row(data);
        //jQuery('#abundaCalcTbl > tbody').prepend(data.row_html);
        //jQuery('#abundaCalcTbl').prepend(data.row_html);
        //display_totals(data);
    });

    request.fail(function (jqXHR, textStatus, errorThrown) {
        if (!ignore_errors) {
            report_error('load_previous_session', jqXHR);
        }
    });
}

/** Compresses duplicates */
function addDuplicatesToQuantity(inputUPC, newupc) {
    var upcs = $$('td.upc');
    var quantities = $$('td.quantity');
    var duplicateQuantity = 0;

    //Compare the new UPC to each UPC in the existing list
    for (var idx = 0; idx < upcs.length; idx++) {
        //Check for existing UPCs matching the new UPC
        if (inputUPC == upcs[idx].children[0].innerHTML) {
            //Add the found UPC's quantity to the new UPC's
            //quantity
            duplicateQuantity += parseInt(quantities[idx].children[0].innerHTML);
            queueForDisposal(upcs[idx].getParent());
        }
    }
}

/** The last item looked up */
var lastItem;

/** Removes an item */
function Remove_Item(product_code) {
    var selector = 'td:contains("' + product_code + '")';
    x = jQuery(selector);
    number_item -= x.length;
    number_item++;
    jQuery(selector).parents('tr').remove();
}

/** Displays a waiting spinning thingy while we look up a product */
function waitFor(product_code) {
    jQuery('#product_code').val('');
    row_html = "<tr class='new response'> <td class='upc'>" + product_code + "</td> <td class='details'> <div class='td_details'> <strong>Getting the realtime values for your item</strong><br /><em></em></div> <div class='td_image'> <img src='" + abundacalc.url + "/images/spinner.gif" + "' alt='waiting' /> </div> </td> <td class='quantity'></td> <td class='item'><div class='item'></td> <td class='values'></td> <td class='delete'></tr>";
    jQuery('#abundaCalcTbl').prepend(row_html);
}

/* 
* function: lookup_item
*
*/
function lookup_item(obj) {
    if (!jQuery(obj).hasClass('disabled')) {

        // The product code must be at least 6 digits
        //
        if (jQuery('#product_code').val().length > 5) {
            //please_wait(true);

            serial = jQuery("#abundaInput").serialize();

            item_code = jQuery('#product_code').val();
            //Remove_Item(item);

            waitFor(item_code);

            var request = jQuery.ajax(
                {
                    type: 'GET',
                    url: 'http://' + abundacalc.server + '/trade/process/request.php',
                    data: serial,
                    dataType: 'jsonp'
                });

            request.done(function (data) {
                Remove_Item(item_code);
                data.row = jQuery.parseJSON(data.row);
                Remove_Item(data.product_code);
                build_row(data);
                lastItem = data;
                jQuery('#abundaCalcTbl').prepend(data.row_html);
                jQuery('td:contains("' + data.product_code + '")').parent()
                    .find('td')
                    .wrapInner('<div style="display: none;" />')
                    .parent()
                    .find('td > div')
                    .slideDown("slow", function () { var $set = jQuery(this); $set.replaceWith($set.contents()); })
                display_totals(data);
            });

            request.fail(function (jqXHR, textStatus, errorThrown) {
                report_error('lookup_item', jqXHR);
                please_wait(false);
            });

            // Warn if not at least 3 digits
            //
        } else {
            jQuery.prompt('The product code must be at least 6 characters long.<br/>Enter a UPC or Amazon ASIN.');
        }
    }
    return false;
}


/* 
* function: please_wait(<bool>)
* 
* <bool> = true, show wait (lock UI)
*          false, hide wait (unlock UI)
*/
function please_wait(UILocked) {

}

/** A regular submission final page */
var regular_display = "<center><p>Sending your trade request and locking in your quote!<br/><span style='font-size:xx-small;'>Give our pecking pigeons a second</span></p></center><center><img src='" + abundacalc.url + "/images/spinner.gif'/></center>";

function displayLogin(custom_message) {

    if (custom_message) {
        return custom_message;
    }

    if (!loggedIn) {
        return '<label for="user">Email Address:</label><br/><input type="text" id="abundatrade_user" name="abundatrade_user" value="" /><br/>'+
            '<label for="password">Password:</label><br/><input type="password" name="abundatrade_password" id="abundatrade_password" value=""/><br/>'+
            '<div style="display:none" id="logging_on"><img src="'+abundacalc.url+'/images/spinner.gif">Logging in -- please wait</div><span id="login_error" class="abundatrade_error" style="display:none;">Invalid Password/Email</span><br/>'+
            '<label for="remember">Remember me?</label><input type="checkbox" name="remember" id="remember"/><br/>'+
            '<a href="http://abundatrade.com/trade/user/reset/">Forgot your password?</a>';
    }
    return '<p>Welcome back!</p>';
}

function displayLoginButtons() {
    if (loggedIn) {
        return {Cancel: 0, 'Ready to submit': 1};
    }
    else {
        if (just_logging_in) {
            return {Cancel: 0, Login: -1, Register: 1};
        }
        return {Cancel: 0, Login: -1, Register: 1, 'Continue as Guest': 2};
    }
}

function checkpass() {
    orig = jQuery("#password").val();
    conf = jQuery("#confirmPass").val();
    if (orig.length < 8) {
        jQuery("#shortpass").show();
        return;
    }
    else {
        jQuery("#shortpass").hide();
    }
    
    if (conf.length == 0) {
        return;
    }
    else if (orig != conf){
        jQuery("#badpass").show();
        jQuery("#goodpass").hide();
    }
    else {
        jQuery("#goodpass").show().delay(2000).fadeOut();
        jQuery("#badpass").hide();
    }
}

function checkemail() {
    if (!isguest) {
        jQuery("#researching").fadeIn();
        request = jQuery.ajax({
           url: "http://" + abundacalc.server + "/trade/process/user/create/",
           dataType: "jsonp",
           data: "email="+jQuery("#email_abundatrade").val()
        });
        request.done(function(data) {
           jQuery("#researching").hide();
           if (data.error != "invalid request") {
               jQuery("#bademail").show();
           }
           else {
               jQuery("#bademail").hide();
           }
        });
    }
}

isguest = false;

function hide_for_guest() {
    isguest = true;
    //jQuery("").hide();
    jQuery("#confirmPass").hide();
    jQuery("#label_confirm").hide();
    jQuery("#label_pass").hide();
    jQuery("#password").hide();
}


function display_promo() {
    if (loggedIn) {
        return '<label for="promo_code">Promo Code</label><input type="text" name="promo_code" value=""/><br/><br/>';
    } else {
        return 'How did you hear about us?<div class="field">' +
        '<select id="referrals" name="hvReferral">' +
        '<option value="-1" selected>Please select one.</option>' +
        '<option value="13">Abundatrade Email</option>' +
        '<option value="25">Amazon or other marketplace</option>' +
        '<option value="1">I previously did a trade</option>' +
        '<option value="3">Referred by a friend</option>' +
        '<option value="24">First Magazine</option>' +
        '<option value="20">Inc. Magazine</option>' +
        '<option value="18">Radio Interview</option>' +
        '<option value="10">Fox News</option>' +
        '<option value="4">Google Search/Ad</option>' +
        '<option value="5">Yahoo Search/Ad</option>' +
        '<option value="16">Facebook</option>' +
        '<option value="17">Twitter</option>' +
        '<option value="15">Blog</option>' +
        '<option value="14">Youtube Video</option>' +
        '<option value="9">Other</option></select></div>' +
        '<div id="friend" style="display: none"><label for="referred">Enter the email address of your friend</label><br/><input type="text" name="referred" id="referred"/></div>'+
        '<div id="other" style="display: none"><label for="Other">Please tell us where you heard about us:</label><br/><div class="field"><input type="text" name="txtOther" value="" /></div></div>' +
        '<script type="text/javascript">'+
            'jQuery("#referrals").change(function() { '+
            'if(jQuery("#referrals").val() == 9) {'+
             'jQuery("#other").slideDown("slow");'+
             'jQuery("#friend").slideUp("slow");'+
            '} else if (jQuery("#referrals").val() == 3) {'+
             'jQuery("#friend").slideDown("slow");'+
             'jQuery("#other").slideUp("slow");'+
            '} else { '+
             'jQuery("#other").slideUp("slow"); '+
             'jQuery("#friend").slideUp("slow");'+
            '} '+
        '} );</script>' +
        '' +
        '<label for="phone_request">Would you like a scanning app for your smart phone?</label><br/>' +
        '<label for="scanner_yes">Yes Please: </label> <input checked="true" type="checkbox" name="phone_request"/><br/><br/>' +
        '<label for="newsletter">Would you like to get the newsletter?</label><br/>' +
        '<label for="newsletter_yes">Yes Please: </label><input checked="true" type="checkbox" name="newsletter"/><br/>';
    }
}

/** Live Lookups */
function check_for_new() {
    var stop = setInterval(function () {
        if (loggedIn) {
            load_previous_session(false, true);
        }
    }, 2000);
}

/** Submit a list */
function submit_modal(callback_to_submit, final_display, custom_message) {
    var state = 1;
    
    if (loggedIn) state = 5;

    var states =
            {
                state0: {
                    html: displayLogin(custom_message),
                    buttons: displayLoginButtons(),
                    focus: 1,
                    submit: function (ev, but, message, val) {
                        if (loggedIn) {
            if (but == 0) {
                return 0;
            }
            if (but == 1) {
                jQuery.prompt.goToState('state5');
                return false;
            }
        }
        else {
            if (but == 0)
                return 0;
            if (but == 1) {
                
                Register(register_pass(),final_display, callback_to_submit);
            }
            if (but == 2) {
                Register(register_guest(), final_display, callback_to_submit)
                
            }
            if (but == -1) {
                jQuery("#logging_on").fadeIn();
                request = jQuery.ajax({
                    url: 'http://' + abundacalc.server + '/trade/process/user/login/',
                    dataType: 'jsonp',
                    data: 'user='+jQuery('#abundatrade_user').val()+'&password='+jQuery("#abundatrade_password").val()+"&remember="+jQuery("#remember").is(":checked")
                });
                request.done(function(data) {
                    if (data.error) {
                        jQuery("#logging_on").fadeOut();
                        jQuery("#login_error").delay(800).show();
                    }
                    else {
                        jQuery("#login_error").hide();
                        if (just_logging_in) {
                            get_login_status();
                            just_logging_in = false;
                            jQuery.prompt.close();
                        } else {
                            get_login_status();
                            just_logging_in = false;
                            loggedIn = true;
                            jQuery.prompt.goToState('state5');
                        }
                    }
                });
            }

            return false;
    
                    }
                    }
                },
                state1: {
                    html: '<select id="sex" name="sex">' +
                        '<option value="-1" selected>Please select one.</option>' +
                        '<option value="Mr.">Mr.</option>'+
                        '<option value="Mrs.">Mrs.</option>'+
                        '<option value="Ms.">Ms.</option></select><br/>'+
                        '<label for="first_name">First Name:</label><br/><input type="text" id="name_first" name="first_name" value=""/><br/>' +
                        '<label for="last_name">Last Name:</label><br/><input type="text" id="name_last" name="last_name" value=""/><br/>' +
                        '<label for="email_abundatrade">Email:</label><br/><input onchange="checkemail()" id="email_abundatrade" name="email" value="" type="text" /><img id="researching" src="'+abundacalc.url+'/images/spinner.gif" style="display:none"><span style="display:none" id="bademail">This email is already registered</span><br/>' +
                        '<label for="confirm_email">Confirm Email:</label><br/><input name="confirm_email" type="text" value=""/>' +
                        '<input type="hidden" name="a" value="' + jQuery('#a').val() + '"/>',
                    buttons: { Cancel: 0, Next: 1 },
                    focus: 1,
                    submit: function (ev, but, message, val) {
                        fname = message.children('#name_first');
                        lname = message.children('#name_last');
                        sexm = message.children('#sex');

                        if (but != 0) {
                            if (val['sex'] == -1) {
                                sexm.css("border", "solid #ff0000 2px");
                                return false;
                            }
                            if (val['first_name'] == '') {
                                fname.css("border", "solid #ff0000 2px");
                                return false;
                            }
                            else {
                                fname.css("border", "");
                            }

                            if (val['last_name'] == '') {
                                lname.css("border", "solid #ff0000 2px");
                                return false;
                            }
                            else {
                                lname.css("border", "");
                            }

                            if (validateEmail(val['email'], val['confirm_email']) == 'nomatch') {
                                jQuery.prompt.goToState('nomatch');
                            } else if (validateEmail(val['email'], val['confirm_email'])) {
                                state += but;
                                jQuery.prompt.goToState('state' + state);
                            }
                            else {
                                jQuery.prompt.goToState('invalid');
                            }
                            return false;
                        }
                        else {
                            jQuery.prompt.close();
                        }
                    }
                },
                state2: {
                    html: '<label id="label_pass" for="password">Password:</label><br/><input type="password" id="password" name="password" /><span style="display:none" id="shortpass">Must be at least 8 characters</span><br/>'+
                        '<label id="label_confirm" for="confirmPass">Confirm Password:</label><br/><input type="password" id="confirmPass" name="confirmPass"/><span id="goodpass" style="display:none" >Matches!</span><span id="badpass" style="display:none" >Does not match!</span></br>' +
                        '<label for="address_street">Street Address:</label><br/><input type="text" id="address_street" name="address_street" /><br/>'+
                        '<label for="address_city">City:</label><br/><input type="text" id="address_city" name="address_city"/><br/>'+
                        '<label for="address_state">State:</label><br/><input type="text" id="address_state" name="address_state"/><br/>'+
                        '<label for="address_zip">Zip:</label><br/><input type="text" id="address_zip" name="address_zip"/><br/>'+
                        '<script type="text/javascript">jQuery("#password").keyup(checkpass); jQuery("#confirmPass").keyup(checkpass);</script>',
                    buttons: {Back: -1,Cancel:0, Next: 1},
                    submit: function (ev, but, message, val) {
                        if (but != 0) {
                            if (!isguest) {
                                pass = message.children('password');
                                conf = message.children('confirmPass');
                                if (val['password'] != val['confirmPass']) {
                                    jQuery('#password').css("border", "solid #ff0000 2px");
                                    jQuery('#confirmPass').css("border", "solid #ff0000 2px");
                                    jQuery('#badpass').show();
                                    return false;
                                }
                                if (val['password'].length < 8) {
                                    jQuery("#password").css("border", "solid #ff0000 2px");
                                    jQuery("#shortpass").show();
                                    return false;
                                }
                            }
                            if (val['address_zip'] == '') {
                                jQuery("#address_zip").css("border", "solid #ff0000 2px");
                                return false;
                            }
                            if (val['address_state'] == '') {
                                jQuery("#address_state").css("border", "solid #ff0000 2px");
                                return false;
                            }
                            if (val['address_city'] == '') {
                                jQuery("#address_city").css("border", "solid #ff0000 2px");
                                return false;
                            }
                            if (val['address_street'] == '') {
                                jQuery("#address_street").css("border", "solid #ff0000 2px");
                                return false;
                            }
                            
                            state+= but;
                            jQuery.prompt.goToState('state' + state);
                            return false;
                        }
                        
                        jQuery.prompt.close();
                    }
                },
                state3: {
                    buttons: { Back: -1, Cancel: 0, Next: 1 },
                    focus: 2,
                    submit: function (ev, but, message, val) {
                        if (but != 0) {

                            lname = message.children('#referrals');

                            if (val['hvReferral'] == '-1') {
                                jQuery('#referrals').css("border", "solid #ff0000 2px");
                                return false;
                            }
                            else {
                                jQuery('#referrals').css("border", "")
                            }

                            if (val['phone_request'] == 'on') {
                                state += but;
                            }
                            else {
                                if (but == 1) {
                                    state += 2;
                                }
                                else {
                                    state += but;
                                }
                            }
                            if (state == 5 && just_logging_in) {
                                jQuery.each(val, function (i, obj) {
                                    str += '&' + i + '=' + obj;
                                });

                                request = jQuery.ajax(
                                                        {
                                                            type: 'POST',
                                                            url: 'http://' + abundacalc.server + '/trade/process/user/create/',
                                                            data: '?action=create_user' + str,
                                                            dataType: 'jsonp'
                                                        });
                                request.done(function(data) {
                                        get_login_status();
                                        just_logging_in = false;
                                        jQuery.prompt.close();
                                        
                                });

                            }
                            else {
                                jQuery.prompt.goToState('state' + state);
                            }
                            return false;
                        }
                        else {
                            jQuery.prompt.close();
                        }
                    },
                    html: display_promo()
                },
                state4: {
                    html: '<label for="phone_type">What kind of phone do you have?</label><input type="text" name="phone_type" id="phone_type" value=""/>',
                    buttons: { Back: -1, Cancel: 0, Next: 1 },
                    focus: 2,
                    submit: function (ev, but, message, val) {
                        if (but != 0) {
                            lname = message.children('#phone_type');

                            if (val['phone_type'] == '') {
                                lname.css("border", "solid #ff0000 2px");
                                return false;
                            }
                            else {
                                lname.css("border", "");
                            }

                            state += but;
                            if (state == 5 && just_logging_in) {
                                jQuery.each(val, function (i, obj) {
                                    str += '&' + i + '=' + obj;
                                });

                                request = jQuery.ajax(
                                                        {
                                                            type: 'POST',
                                                            url: 'http://' + abundacalc.server + '/trade/process/user/create/',
                                                            data: '?action=create_user' + str,
                                                            dataType: 'jsonp'
                                                        });
                                request.done(function(data) {
                                        get_login_status();
                                        just_logging_in = false;
                                        jQuery.prompt.close();
                                        
                                });

                            }
                            else {
                                jQuery.prompt.goToState('state' + state);
                            }
                            
                            return false;
                        }
                        else {
                            jQuery.prompt.close();
                        }
                    }
                },
                state5: {
                    html: '<h2>Please Note</h2><p>The values shown on the calculator are a pre-valuation.</p><p>Item quality needs to be verified for final valuation.</p><p>This valuation is not a commitment.</p><p>All data is kept private.</p><label for="promo_code">Promo Code</label><input type="text" name="promo_code" value=""/>',
                    buttons: [{ title: 'Back', value: -1 }, { title: 'Cancel', value: 0 }, { title: 'Agree and Submit', value: 'submit'}],
                    focus: 2,
                    submit: function (ev, but, message, val) {
                        if (but == "submit") {
                            jQuery.prompt.goToState('finish');
                            callback_to_submit(val);
                            return false;
                        }

                        if (but != 0) {
                            if (val['scanner'] == 'on') {
                                state += but;
                            }
                            else if (but == -1) {
                                state -= 2;
                            }
                            else {
                                state += but;
                            }
                            jQuery.prompt.goToState('state' + state);
                            return false;
                        }
                        else {
                            jQuery.prompt.close();
                        }
                        
                        isguest = false;
                    }
                },
                invalid: {
                    html: '<h2>Email address invalid</h2><br/><p>Please enter a valid email address.</p>',
                    buttons: { OK: true },
                    focus: 0,
                    submit: function (v, m, f) {
                        jQuery.prompt.goToState('state1');
                        return false;
                    }
                },
                nomatch: {
                    html: '<h2>Email Addresses don\'t match!</h2><br/><p>Please check your email address to make sure it is correct.</p>',
                    buttons: { OK: true },
                    focus: 0,
                    submit: function (v, m, f) {
                        jQuery.prompt.goToState('state1');
                        return false;
                    }
                },
                finish: {
                    html: final_display,
                    buttons: {}
                }
            };
    var str = '';

    jQuery.prompt(states, {
        callback: function (ev, v, m, f) {

            if (v) {

            } else {
                please_wait(false);
            }
        }
    });
}

/*
* function: submit_the_list()
*
* Submit The List via AJAX request.
*
*/
function submit_the_list(obj) {
    if ((jQuery('#total_item_count').text() > 0)) {

        submit_modal(submit_my_list, regular_display);

    }
}

/** Submission of a list done the old fashioned way via jsonp */
function submit_my_list(f) {
    str = "";

    jQuery.each(f, function (i, obj) {
        str += '&' + i + '=' + obj;
    });
    
    if (isguest) {
        str += '&guest=true';
    }

    var request = jQuery.ajax(
                            {
                                type: 'GET',
                                url: 'http://' + abundacalc.server + '/trade/process/submit.php',
                                data: 'action=submit_list' + str,
                                dataType: 'jsonp'
                            });

    request.done(function (data) {
        // No errors
        //
        if (data.error == '') {
            jQuery('#abundaCalcTbl > tbody').children().remove();
            display_totals(data);
            //jQuery.prompt('Your list has been received.<br/>Thank you for submitting your list to Abundatrade.');
            window.location = abundacalc.thanks;
            new_session();
        } else {
            jQuery.prompt('Your list could not be sent.<br/>' + data.error);
            please_wait(false);
        }
    });

    request.fail(function (jqXHR, textStatus, errorThrown) {
        report_error('submit_my_list', jqXHR);
        please_wait(false);
    });
}

function submitGiftCard() {
    jQuery('input[name=Submit]').attr("disabled", "disabled");
    jQuery('input[name=Submit]').attr("value", "Creating your giftcard ... please wait")
    jQuery('input[name="specialid:9573"]').remove();
    jQuery('input[name=listid]').val('48277');
    jQuery('form[name=icpsignup] div div div').get(0).innerHTML += "<input type='hidden' name='specialid:48277' value ='IE9I'>"
    jQuery('input[name=formid]').val('3389');
    jQuery('input[name=reallistid]').val('1');
    jQuery('input[name=doubleopt]').val('0');
    var email = getParameterByName('email');
    var key = getParameterByName('key');
    if (jQuery(this).data('submit-me')) {
        return true;
    }
    var request = jQuery.ajax(
                            {
                                type: 'GET',
                                url: 'http://dev.' + abundacalc.server + '/trade/process/createGiftCard.php',
                                data: 'email=' + email + "&key=" + key,
                                dataType: 'jsonp',
                                context: this,
                                success: function(data) {
                                        jQuery(this).data('submit-me', true).submit();
                                }
                            });
    return false;
}

/* 
* When the document has been loaded...
*
*/
jQuery(document).ready(function () {
    if (getParameterByName('act') == 'gift') {
        jQuery('input[name=fields_email]').val(getParameterByName('email'));
        //jQuery('input[name=Submit]').attr('onclick','return submitGiftCard();');
        jQuery('form[name=icpsignup]').submit(submitGiftCard);
    }
    
    if (jQuery("#login_status_abundatrade").val() != null) {
        if (abundacalc.upload_id) {
            display_bulk_upload(true);
        }

        get_login_status();

        /*
        * Load previous session data from backend.
        *
        */
        load_previous_session(false);

        /* Form Submit
        *
        * Capture the form submit, and just use it to lookup items.
        *
        */
        jQuery('#abundaInput').submit(function () { lookup_item(jQuery('#lookupItem').text()); return false; });

        /* Lookup Item.click()
        * 
        * uses Ajax to talk to Abundatrade server.
        * must use JSONP to allow for cross-site calls and processing
        * of return data without error.
        */
        //jQuery('#lookupItem').on('click', function () { lookup_item(this); return false; });

        /* Submit List.click()
        * 
        * uses Ajax to talk to Abundatrade server.
        * must use JSONP to allow for cross-site calls and processing
        * of return data without error.
        */
        //jQuery('#submitList').on('click', function () { submit_the_list(this); });


        /* Delete All.click()
        * 
        * uses Ajax to talk to Abundatrade server.
        * and send the delete all action.
        */
        jQuery('#delete_all_top').on('click', function () { clear_session(this); });
        jQuery('#delete_all_bottom').on('click', function () { clear_session(this); });

        /*
        load gadgets
        */
        if (jQuery('#abundaGadgetInput').length > 0 && jQuery('#gadget_abundatrade').css('display') == 'block') {
            loadActiveGadgets();

            jQuery('#abundaGadgetInput').submit(function () { addGadget(jQuery('#gadget_code').val(), jQuery('#header_condition').val()); });
        }

        check_for_new();
    }
});

function transform_into_full_calc() {
    jQuery("#gadget_abundatrade").fadeOut();
    jQuery("#bulk").slideUp(500);
    jQuery("#top_input_section").fadeIn(500);
    jQuery("#second_content").slideDown(500);
    jQuery("#abundaCalcTbl").delay(100).fadeIn(400);
    jQuery("#bulk_button").slideDown(1000);
    jQuery("#very_bottom").slideDown(500);
    load_previous_session(false);
    return false;
}

function tour_func(e, v, m, f) {
    if (v == -1) {
        jQuery.prompt.prevState();
        return false;
    }
    else if (v == 1) {
        jQuery.prompt.nextState();
        return false;
    }
}

var tourstates = [
    {
        title: 'Welcome',
        html: 'Register and edit your past submissions, get paid, and mark them as heading our way',
        buttons: { Next: 1 },
        focus: 1,
        position: { container: '#login_status_abundatrade', x: 0, y: 0, width: 200, arrow: 'tl' },
        submit: tour_func
    },
    {
        title: 'Getting Started',
        html: 'Enter any barcode and just about any ISBN here. <br>You can also use a scanner to speed things along.',
        buttons: { Back: -1, Next: 1 },
        focus: 1,
        position: { container: '#product_code', x: 200, y: 0, width: 250, arrow: 'lt' },
        submit: tour_func
    },
    {
        title: 'How Many',
        html: 'Enter how many you\'d like to trade in for cash',
        buttons: { Back: -1, Next: 1 },
        focus: 1,
        position: { container: '#product_qty', x: 50, y: 0, width: 200, arrow: 'lt' },
        submit: tour_func
    },
    {
        title: 'Look it up',
        html: 'Press add item to add it on to your list',
        buttons: { Back: -1, Next: 1 },
        focus: 1,
        position: { container: '[value=\'+ Add Item\']', x: -50, y: -150, width: 200, arrow: 'bc' },
        submit: tour_func
    },
    {
        title: 'Look it up',
        html: 'Your item will appear here, along with how much cash we\'ll give you for it',
        buttons: { Back: -1, Next: 1 },
        focus: 1,
        position: { container: '#ready2go', x: 200, y: 25, width: 200, arrow: 'tc' },
        submit: tour_func
    },
    {
        title: 'Look it up',
        html: 'Our technology gets the realtime value of your item in the online marketplace, since we know most things depreciate we lock in this value for you for 2 weeks to get you the most cash.',
        buttons: { Back: -1, Next: 1 },
        focus: 1,
        position: { container: '#ready2go', x: 200, y: 25, width: 400, arrow: 'tc' },
        submit: tour_func
    },
    {
        title: 'Submit',
        html: 'Once you\'re done building your list how you want it; login, sign up, or submit the list as a guest; print out your shipping information, and send it in. We will keep you up to date while it goes through the receiving process and get you your cash.',
        buttons: { Back: -1, Next: 1 },
        focus: 1,
        position: { container: '#submitList', x: 200, y: 0, width: 400, arrow: 'lt tl' },
        submit: tour_func
    },
    {
        title: 'Bulk Upload',
        html: 'If you have items already in ISBN/UPC form, you can copy and paste your items with quantity directly into the bulk uploader and receieve a quote instantly.',
        buttons: { Back: -1, Done: 2 },
        focus: 1,
        position: { container: '#bulk_button', x: 200, y: 25, width: 300, arrow: 'tl' },
        submit: tour_func
    }
];

function addGadget(ean, condition) {

    if (condition == 'Other') {
        jQuery.prompt('It is recommended to submit a custom quote for Cracked Screens and Other Conditions, click <a href="http://abundatrade.com/recommerce/custom-quote-top-cash-gadgets">here</a> to do that now.', {
            'title': 'Submit a Custom Quote'
        });
        return;
    }

    if (condition == null) {
        condition = 'like_new';
    }

    var request = jQuery.ajax(
                            {
                                type: 'GET',
                                url: 'http://' + abundacalc.server + '/trade/process/request.php',
                                data: 'action=add_gadget&product_qty=1&product_code=' + ean + '&header_condition=' + condition,
                                dataType: 'jsonp'
                            });

    request.done(function (data) {
        // No errors
        //
        if (data != '') {
            display_totals(data);
            jQuery.prompt("would you like to add any books, cds, DVDs, or BluRays to your list?", {
                title: "Your submission is ready,",
                buttons: { "Yes!": true, "No thank you": false },
                submit: function (e, v, m, f) {
                    jQuery.prompt.close();
                    wait = setInterval(function () {
                        clearInterval(wait);
                        if (v) {
                            transform_into_full_calc();
                        }
                        else {
                            submit_the_list(null);
                        }
                    }, 1000);
                }
            });
        }
        else {
            data.responseText = data;
            report_error('addGadget', data);
        }
    });

    request.fail(function (jqXHR, textStatus, errorThrown) {
        report_error('addGadget', jqXHR);
        please_wait(false);
    });
}

function loadActiveGadgets() {

    var request = jQuery.ajax(
                            {
                                type: 'GET',
                                url: 'http://' + abundacalc.server + '/trade/process/request.php',
                                data: 'action=gadget_list&gadget_category=' + jQuery('#gadget_category').val() + '&gadget_manufacturer=' + jQuery('#gadget_manufacturer').val(),
                                dataType: 'jsonp'
                            });

    request.done(function (data) {
        // No errors
        //
        if (data != '') {
            str = "";

            for (i = 0; i < data.length; i++) {
                str += "<option value = '" + data[i].ean + "'>" + data[i].title + "</option>";
            }

            jQuery('#gadget_code').get(0).innerHTML = str;
        }
        else {
            data.responseText = data;
            report_error('loadActiveGadgets', data);
        }
    });

    request.fail(function (jqXHR, textStatus, errorThrown) {
        report_error('loadActiveGadgets', jqXHR);
        please_wait(false);
    });

}

function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

/** Builds an unknown row */
function build_unknown(code, quantity, id) {
    return "<tr class='new response'> <td class='upc'>" + code + "</td> <td class='details'> <div class='td_details'> <strong>Unknown Item</strong><br /><em>Item not found. You may send for valuation</em></div> <div class='td_image'> <img src='http://g-ecx.images-amazon.com/images/G/01/x-site/icons/no-img-sm._V192198896_.gif' alt='Unkown item' /> </div> </td> <td class='quantity'>" + quantity + "</td> <td class='item'><div class='item'>$0.00</td> <td class='values'>$0.00</td> <td class='delete'> <a href='#' alt='Delete' class='delete_this_row' id='del_" + id + "'>Delete</a></tr>";
}

/** Builds an item from a lookup from a json string */
function build_row(data) {
    data.row_html = "";

    if (jQuery("#ready2go").length > 0) {
        //jQuery("#ready2go").remove();
    }

    if (jQuery.isArray(data.row)) {
        for (var i = 0; i < data.row.length; i++) {
            row = data.row[i];
            if (row.title == "Unknown") {
                data.row_html = build_unknown(row.product_code, row.quantity, row.item_id);
            }
            else {
                row_price = new Number(row.price_per / 100).toFixed(2);
                row_total = new Number(row.total_price / 100).toFixed(2);
                data.row_html += write_html(data, row);
            }
            number_item++;
        }
    }
    else {
        row = data.row;
        if (row.title == "Unknown") {
            data.row_html = build_unknown(row.product_code, row.quantity, row.item_id);
        }
        else {
            row_price = new Number(row.price_per / 100).toFixed(2);
            row_total = new Number(row.total_price / 100).toFixed(2);
            data.row_html += write_html(data, row);

        }
        number_item++;
    }

    return data;
}

/** Write out the html for the row */
function write_html(data, row) {
    return "<tr class='new response'> <td class='upc'>" + row.product_code + "</td> <td class='details'> <div class='td_image'> <img src='" + row.images + "' alt='" + row.title + "' /> </div><div class='td_details'> <strong>" + row.title + "</strong><br /><em>" + (row.author == null ? '' : row.author) + "</em><br/>" + (row.category == null ? "" : row.category) + "</div>  </div></td> <td class='quantity'>" + row.quantity + "</td> <td class='item'>" + (row.worthless == true ? "<p class='blatent'>No Abunda Value</p>" : "") + (row.overstocked == true ? "<span class='blatent'>Over Stocked Item</span>" : "") + "<div class='item'>" + data.currency_for_total + row_price + "</div></td> <td class='values'>" + data.currency_for_total + row_total + "</td> <td class='delete'> <a href='#' alt='Delete' class='delete_this_row' id='del_" + row.item_id + "'>Delete</a></tr>";
}

/******************************
New Stuff
*******************************/
function queueForDisposal(productcode) {
    var selector = 'td:contains("' + productcode + '")';

    itemsToDispose.push(selector);
}

function disposeQueued() {
    for (var i = 0; i < itemsToDispose.length; i++) {
        jQuery(itemsToDispose[i]).parents('tr').remove();
    }

    itemsToDispose = [];
}
