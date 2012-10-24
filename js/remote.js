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

var number_item = 1;
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
* Validates an email address
*
*/
function validateEmail(email, confirm) {
    if (email.toLowerCase() == confirm.toLowerCase()) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    else return 'nomatch';
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
                callback: function (v, m, f) {
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
                            console.log(data);
                        });

                        request.fail(function (jqXHR, textStatus, errorThrown) {
                            alert("Request failed: " + textStatus + " - " + errorThrown);
                        });
                    }
                }
            }
            );
    }
}

/*
* function: new_session()
*
* Give user a new session id.  This detaches any prior connection to the backend data.
*
*/
function new_session(this_link) {
    number_item = 0;
    var request = jQuery.ajax(
        {
            type: 'GET',
            url: 'http://' + abundacalc.server + '/trade/process/request.php',
            data: 'action=new_session',
            dataType: 'jsonp'
        });
    request.done(function (data) { });
    request.fail(function (jqXHR, textStatus, errorThrown) {
        alert("Request failed: " + textStatus + " - " + errorThrown);
        please_wait(false);
    });
}

/*
* function: display_totals()
*
* Render the header/footer totals from JSONP data.
*
*/
function display_totals(data) {
    jQuery('#product_code').val('');
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

    jQuery('#product_code').focus();
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
function load_previous_session() {
    var request = jQuery.ajax(
        {
            type: 'GET',
            url: 'http://' + abundacalc.server + '/trade/process/request.php',
            data: 'action=load_previous_session',
            dataType: 'jsonp'
        });

    request.success(function (data) {
        for (i = 0; i < data.length; i++) {
            part = data[i];
            part.row = jQuery.parseJSON(part.row);
            part = build_row(part);
            console.log(part);
            jQuery('#abundaCalcTbl').prepend(part.row_html);
            jQuery('td:contains("' + part.product_code + '")').parent()
                .find('td')
                .wrapInner('<div style="display: none;" />')
                .parent()
                .find('td > div')
                .slideDown("slow", function () { var $set = jQuery(this); $set.replaceWith($set.contents()); })

            display_totals(part);
        }
        //build_row(data);
        //jQuery('#abundaCalcTbl > tbody').prepend(data.row_html);
        //jQuery('#abundaCalcTbl').prepend(data.row_html);
        //display_totals(data);
    });

    request.fail(function (jqXHR, textStatus, errorThrown) {
        alert("Request failed: " + textStatus + " - " + errorThrown);
    });
}

function addDuplicatesToQuantity(inputUPC) {
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

var lastItem;

function Remove_Item(product_code) {
    var selector = 'td:contains("' + product_code + '")';
    jQuery(selector).parents('tr').remove();
}

function waitFor(product_code) {
    jQuery('#product_code').val('');
    row_html = "<tr class='new response'> <td class='line_number'></td> <td class='upc'>" + product_code + "</td> <td class='details'> <div class='td_details'> <strong>Getting the Abunda Value for your item</strong><br /><em></em></div> <div class='td_image'> <img src='" + abundacalc.url + "/images/spinner.gif" + "' alt='waiting' /> </div> </td> <td class='quantity'></td> <td class='item'><div class='item'></td> <td class='values'></td> <td class='delete'></tr>";
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
            please_wait(true);

            serial = jQuery("#abundaInput").serialize();

            item = jQuery('#product_code').val();
            //Remove_Item(item);

            waitFor(item);

            var request = jQuery.ajax(
                {
                    type: 'GET',
                    url: 'http://' + abundacalc.server + '/trade/process/request.php',
                    data: serial,
                    dataType: 'jsonp'
                });

            request.done(function (data) {
                Remove_Item(item);
                data.row = jQuery.parseJSON(data.row);
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
                alert("Request failed: " + textStatus + " - " + errorThrown);
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

    // Wait Mode
    //
    if (UILocked) {
        /*jQuery('#abunda_please_wait').show();
        jQuery('#lookupItem').addClass('disabled');
        jQuery('#submitList').addClass('disabled');
        jQuery('#delete_all_top').addClass('disabled');
        jQuery('#delete_all_bottom').addClass('disabled');
        jQuery('.delete_this_row').addClass('disabled');*/

        // Go,Go,Go...
        //
    } else {

    }
}

/*
* function: submit_the_list()
*
* Submit The List via AJAX request.
*
*/
function submit_the_list(obj) {
    if (!jQuery(obj).hasClass('disabled') && (jQuery('#total_item_count').text() > 0)) {

        please_wait(true);

        var state = 0;

        var states =
            {
                state0: {
                    html: '<label for="first_name">First Name:</label><br/><input type="text" id="name_first" name="first_name" value=""/><br/>' +
                    '<label for="last_name">Last Name:</label><br/><input type="text" id="name_last" name="last_name" value=""/><br/>' +
                    '<label for="email">Email:</label><br/><input name="email" value="" type="text" /><br/>' +
                    '<label for="confirm_email">Confirm Email:</label><br/><input name="confirm_email" type="text" value=""/>' +
                    '<input type="hidden" name="a" value="' + jQuery('#a').val() + '"/>',
                    buttons: { Cancel: 0, Next: 1 },
                    focus: 1,
                    submit: function (ev, but, message, val) {
                        fname = message.children('#name_first');
                        lname = message.children('#name_last');

                        if (but != 0) {
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
                state1: {
                    buttons: { Back: -1, Cancel: 0, Next: 1 },
                    focus: 2,
                    submit: function (ev, but, message, val) {
                        if (but != 0) {

                            lname = message.children('#referrals');

                            if (val['ddlReferrals'] == '-1') {
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
                            jQuery.prompt.goToState('state' + state);
                            return false;
                        }
                        else {
                            jQuery.prompt.close();
                        }
                    },
                    html: 'How did you hear about us?<div class="field">' +
                    '<select id="referrals" name="ddlReferrals">' +
                    '<option value="-1" selected>Please select one.</option>' +
                    '<option value="0">Abundatrade Email</option>' +
                    '<option value="1">Amazon or other marketplace</option>' +
                    '<option value="2">I previously did a trade</option>' +
                    '<option value="3">Referred by a friend</option>' +
                    '<option value="4">First Magazine</option>' +
                    '<option value="5">Inc. Magazine</option>' +
                    '<option value="6">Radio Interview</option>' +
                    '<option value="7">Fox News</option>' +
                    '<option value="8">Google Search/Ad</option>' +
                    '<option value="9">Yahoo Search/Ad</option>' +
                    '<option value="10">Facebook</option>' +
                    '<option value="11">Twitter</option>' +
                    '<option value="12">Blog</option>' +
                    '<option value="13">Youtube Video</option>' +
                    '<option value="14">Other</option></select></div>' +
                    '<div id="other" style="display: none"><label for="Other">Please tell us where you heard about us:</label><br/><div class="field"><input type="text" name="Other" value="" placeholder="How you found out about us"/></div></div>' +
                    '<script type="text/javascript">jQuery("#referrals").change(function() { if(jQuery("#referrals").val() == 14) { jQuery("#other").slideDown("slow"); } else { jQuery("#other").slideUp("slow"); } } );</script>' +
                    '<label for="promo_code">Promo Code</label><input type="text" name="promo_code" value=""/><br/><br/>' +
                    '<label for="phone_request">Would you like a scanning app for your smart phone?</label><br/>' +
                    '<label for="scanner_yes">Yes Please: </label> <input checked="true" type="checkbox" name="phone_request"/><br/><br/>' +
                    '<label for="newsletter">Would you like to get the newsletter?</label><br/>' +
                    '<label for="newsletter_yes">Yes Please: </label><input checked="true" type="checkbox" name="newsletter"/><br/>'
                },
                state2: {
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
                            jQuery.prompt.goToState('state' + state);
                            return false;
                        }
                        else {
                            jQuery.prompt.close();
                        }
                    }
                },
                state3: {
                    html: '<h2>Please Note</h2><p>The values shown on the calculator are a pre-valuation.</p><p>Item quality needs to be verified for final valuation.</p><p>This valuation is not a commitment.</p><p>All data is kept private.</p>',
                    buttons: [{ title: 'Back', value: -1 }, { title: 'Cancel', value: 0 }, { title: 'Agree and Submit', value: 'submit'}],
                    focus: 2,
                    submit: function (ev, but, message, val) {
                        if (but == "submit") {
                            return true;
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
                    }
                },
                invalid: {
                    html: '<h2>Email address invalid</h2><br/><p>Please enter a valid email address.</p>',
                    buttons: { OK: true },
                    focus: 0,
                    submit: function (v, m, f) {
                        jQuery.prompt.goToState('state0');
                        return false;
                    }
                },
                nomatch: {
                    html: '<h2>Email Addresses don\'t match!</h2><br/><p>Please check your email address to make sure it is correct.</p>',
                    buttons: { OK: true },
                    focus: 0,
                    submit: function (v, m, f) {
                        jQuery.prompt.goToState('state0');
                        return false;
                    }
                }
            };
        var str = '';
        jQuery.prompt(states, {
            callback: function (ev, v, m, f) {
                if (v) {
                    jQuery.each(f, function (i, obj) {
                        str += '&' + i + '=' + obj;
                    });
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
                            jQuery.prompt('Your list has been received.<br/>Thank you for submitting your list to Abundatrade.');
                            new_session();
                        } else {
                            jQuery.prompt('Your list could not be sent.<br/>' + data.error);
                            please_wait(false);
                        }
                    });

                    request.fail(function (jqXHR, textStatus, errorThrown) {
                        alert("Request failed: " + textStatus + " - " + errorThrown);
                        please_wait(false);
                    });
                } else {
                    please_wait(false);
                }
            }
        });
    }
}

/* 
* When the document has been loaded...
*
*/
jQuery(document).ready(function () {

    /*
    * Load previous session data from backend.
    *
    */
    load_previous_session();

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
});

function build_unknown(code, quantity, id) {
    return "<tr class='new response'> <td class='line_number'>" + (number_item) + "</td> <td class='upc'>" + code + "</td> <td class='details'> <div class='td_details'> <strong>Unknown Item</strong><br /><em>Item not found. You may send for valuation</em></div> <div class='td_image'> <img src='http://g-ecx.images-amazon.com/images/G/01/x-site/icons/no-img-sm._V192198896_.gif' alt='Unkown item' /> </div> </td> <td class='quantity'>" + quantity + "</td> <td class='item'><div class='item'>$0.00</td> <td class='values'>$0.00</td> <td class='delete'> <a href='#' alt='Delete' class='delete_this_row' id='del_" + id + "'>Delete</a></tr>";
}

function build_row(data) {
    data.row_html = "";
    console.log("Building row");
    console.log(data);

    if (jQuery.isArray(data.row)) {
        for (var i = 0; i < data.row.length; i++) {
            row = data.row[i];
            if (row.title == "Unknown") {
                data.row_html = build_unknown(row.product_code, row.quantity, row.item_id);
            }
            else {
                row_price = new Number(row.price_per / 100).toFixed(2);
                row_total = new Number(row.total_price / 100).toFixed(2);
                data.row_html += "<tr class='new response'> <td class='line_number'>" + (number_item) + "</td> <td class='upc'>" + row.product_code + "</td> <td class='details'> <div class='td_details'> <strong>" + row.title + "</strong><br /><em>" + (row.author == null ? '' : row.author) + "</em></div> <div class='td_image'> <img src='" + row.images + "' alt='" + row.title + "' /> </div> </td> <td class='quantity'>" + row.quantity + "</td> <td class='item'><div class='item'>" + data.currency_for_total + row_price + "</td> <td class='values'>" + data.currency_for_total + row_total + "</td> <td class='delete'> <a href='#' alt='Delete' class='delete_this_row' id='del_" + row.item_id + "'>Delete</a></tr>";
            }
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
            data.row_html += "<tr class='new response'> <td class='line_number'>" + (number_item) + "</td> <td class='upc'>" + row.product_code + "</td> <td class='details'> <div class='td_details'> <strong>" + row.title + "</strong><br /><em>" + (row.author == null ? '' : row.author) + "</em></div> <div class='td_image'> <img src='" + row.images + "' alt='" + row.title + "' /> </div> </td> <td class='quantity'>" + row.quantity + "</td> <td class='item'><div class='item'>" + data.currency_for_total + row_price + "</td> <td class='values'>" + data.currency_for_total + row_total + "</td> <td class='delete'> <a href='#' alt='Delete' class='delete_this_row' id='del_" + row.item_id + "'>Delete</a></tr>";
        }
    }

    return data;
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