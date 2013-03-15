// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name register.min.js
// ==/ClosureCompiler==

/*****************************************************************
* file: register.js
*
* Displays the registration menu for guest and new users
*
*****************************************************************/

function demo() { return '<select id="sex" name="sex">' +
                        '<option value="-1" selected>Please select one.</option>' +
                        '<option value="Mr.">Mr.</option>'+
                        '<option value="Mrs.">Mrs.</option>'+
                        '<option value="Ms.">Ms.</option></select><br/>'+
                        '<label for="first_name">First Name:</label><br/><input type="text" id="name_first" name="first_name" value=""/><br/>' +
                        '<label for="last_name">Last Name:</label><br/><input type="text" id="name_last" name="last_name" value=""/><br/>' +
                        '<label for="email_abundatrade">Email:</label><br/><input id="email_abundatrade" name="email" value="" type="text" /><img id="researching" src="'+abundacalc.url+'/images/spinner.gif" style="display:none"><span style="display:none" id="bademail">This email is already registered ... <a href="http://abundatrade.com/trade/user/reset/">Forgot your password?</a></span><br/>' +
                        '<label for="confirm_email">Confirm Email:</label><br/><input name="confirm_email" type="text" value=""/>' +
                        '<input type="hidden" name="a" value="' + jQuery('#a').val() + '"/>';
}

function register_guest() {
                return '<label for="address_street">Street Address:</label><br/><input type="text" id="address_street" name="address_street" /><br/>'+
                        '<label for="address_city">City:</label><br/><input type="text" id="address_city" name="address_city"/><br/>'+
                        '<label for="address_state">State:</label><br/><input type="text" id="address_state" name="address_state"/><br/>'+
                        '<label for="address_zip">Zip:</label><br/><input type="text" id="address_zip" name="address_zip"/><br/>'+
                        '<input type="hidden" id="guest" name="guest" value="true"/>'+
                        '<script type="text/javascript">jQuery("#password").keyup(checkpass); jQuery("#confirmPass").keyup(checkpass);</script>';
}

function register_pass() { return '<label id="label_pass" for="password">Password:</label><br/><input type="password" id="password" name="password" /><span style="display:none" id="shortpass">Must be at least 8 characters</span><br/>'+
                        '<label id="label_confirm" for="confirmPass">Confirm Password:</label><br/><input type="password" id="confirmPass" name="confirmPass"/><span id="goodpass" style="display:none" >Matches!</span><span id="badpass" style="display:none" >Does not match!</span></br>' +
                        '<label for="address_street">Street Address:</label><br/><input type="text" id="address_street" name="address_street" /><br/>'+
                        '<label for="address_city">City:</label><br/><input type="text" id="address_city" name="address_city"/><br/>'+
                        '<label for="address_state">State:</label><br/><input type="text" id="address_state" name="address_state"/><br/>'+
                        '<label for="address_zip">Zip:</label><br/><input type="text" id="address_zip" name="address_zip"/><br/>'+
                        '<script type="text/javascript">jQuery("#password").keyup(checkpass); jQuery("#confirmPass").keyup(checkpass);</script>';
}
                    
var referral = 'How did you hear about us?<div class="field">' +
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
    
var phone = '<label for="phone_type">What kind of phone do you have?</label><input type="text" name="phone_type" id="phone_type" value=""/>';

var notice = '<h2>Please Note</h2><p>The values shown on the calculator are a pre-valuation.</p><p>Item quality needs to be verified for final valuation.</p><p>This valuation is not a commitment.</p><p>All data is kept private.</p><label for="promo_code">Promo Code</label><input type="text" name="promo_code" value=""/>';
var invalid_email = '<h2>Email address invalid</h2><br/><p>Please enter a valid email address.</p>';
var nomatch_email = '<h2>Email Addresses don\'t match!</h2><br/><p>Please check your email address to make sure it is correct.</p>';
var regular_finish = '<h2>Email Addresses don\'t match!</h2><br/><p>Please check your email address to make sure it is correct.</p>';

function state(passState, finish, callback_to_submit) {
    return {
                state1: {
                    html: demo(),
                    buttons: { Cancel: 0, Next: 1 },
                    focus: 1,
                    submit: function (ev, but, message, val) {
                        mystate=1;
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
                            
                            if (jQuery('#bademail').is(':visible')) {
                                return false;
                            }

                            if (validateEmail(val['email'], val['confirm_email']) == 'nomatch') {
                                jQuery.prompt.goToState('nomatch');
                            } else if (validateEmail(val['email'], val['confirm_email'])) {
                                mystate += 4
                                jQuery.prompt.goToState('state' + mystate);
                            }
                            else {
                                jQuery.prompt.goToState('invalid');
                            }
                            return false;
                        }
                        else {
                            just_logging_in = false;
                            jQuery.prompt.close();
                        }
                    }
                },
                state5: {
                    html: notice,
                    buttons: [{ title: 'Back', value: -1 }, { title: 'Cancel', value: 0 }, { title: 'Agree and Submit', value: 'submit'}],
                    focus: 2,
                    submit: function (ev, but, message, val) {
                        mystate = 5;
                        if (but == "submit") {
                            jQuery.prompt.goToState('finish');
                            callback_to_submit(val);
                            return false;
                        }

                        if (but != 0) {
                            if (val['scanner'] == 'on') {
                                mystate += but;
                            }
                            else if (but == -1) {
                                mystate -= 2;
                            }
                            else {
                                mystate += but;
                            }
                            jQuery.prompt.goToState('state' + mystate);
                            return false;
                        }
                        else {
                            just_logging_in = false;
                            jQuery.prompt.close();
                        }
                        
                        isguest = false;
                    }
                },
                invalid: {
                    html: invalid_email,
                    buttons: { OK: true },
                    focus: 0,
                    submit: function (v, m, f) {
                        jQuery.prompt.goToState('state1');
                        return false;
                    }
                },
                nomatch: {
                    html: nomatch_email,
                    buttons: { OK: true },
                    focus: 0,
                    submit: function (v, m, f) {
                        jQuery.prompt.goToState('state1');
                        return false;
                    }
                },
                finish: {
                    html: finish,
                    buttons: {}
                }
            };
}

function Register(pass, finish, call) {
    jQuery.prompt.close();
    var stop = setInterval(function() {
        clearInterval(stop);
        jQuery.prompt(state(pass,finish, call));
    }, 600);
}