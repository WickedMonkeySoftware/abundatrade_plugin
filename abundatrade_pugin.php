<?php
/**
 * @package abundatrade_plugin
 * @version 1.8.02
 * @author Robert Landers (landers.robert@gmail.com)
 */
/*
Plugin Name: Abundatrade Plugin
Plugin URI: http://wordpress.org/extend/plugins/abundatrade-plugin/
Description: Earn extra income for your site via the Abundatrade affiliate program!
Author: withinboredom
Version: 1.8.02
Author URI: http://withinboredom.info
 */

if (!defined("WP_CONTENT_DIR")) exit();

class abundatrade_withinboredom {
    
    /**
     *
     * @var array The active folders
     */
    private $folders;
    
    /**
     *
     * @var array The settings
     */
    public $settings;
    
    /**
     * Get all our folders and return them
     */
    public function getFolders($folders )
    {
        return array_merge_recursive($this->folders, $folders);
    }
    
    /**
     * Applies the configuration of the plugin
     * @var array $config The config that is to be edited
     * @return array The new config
     */
    public function applyConfig($config) {
        $config['tabs'] = array(
            0 => array( 'Settings', 'tabs__settings_withinboredom'),
            1 => array('About', 'tabs__about_withinboredom'),
            2 => array('Support', 'tabs__support_withinboredom'),
            );
        $config['help'] = array(
            // The tab to display on
            '0' => array(
                    // The     title       content       of the help menu
                    0 => array('Overview', "Basic settings for the Abundatrade Calculator."),
                    1 => array('Help', 'Enter your affiliate id and the location of your thank you page')
                )
            );
        $config['config'] = array(
                'settings' => true,
                'page_title' => 'Abundatrade',
                'button_title' => 'Abundatrade',
                'slug' => 'abundatrade',
                'shortcodes' => array(
                    'abundatrade'
                ),
            );
        return $config;
    }
    
    public function validate_required($name) {
        if(isset($_REQUEST[$name]) && $_REQUEST[$name] == "") {
            return false;
        }
        return true;
    }
    
    public function is_ssl() {
        if(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) {
            return 'https://';
        }
        
        return 'http://';
    }
    
    public function get_value($name) {
        if(isset($_REQUEST[$name])) {
            return $_REQUEST[$name];
        }
        return "";
    }
    
    public function isIE() {
        preg_match('/MSIE (.*?);/', $_SERVER['HTTP_USER_AGENT'], $matches);

        $use_labels = false;
        if (count($matches)>1){
            //Then we're using IE
            $version = $matches[1];

            $use_labels = true;
            switch(true){
                case ($version<=8):
                    //IE 8 or under!
                    $use_labels = true;
                    break;

                case ($version==9):
                    //IE9!
                    $use_labels = true;
                    break;
                case ($version == 10):
                    $use_labels = false;
                default:
                //You get the idea
            }
        }
        
        return $use_labels;
    }
    
    public function gadget($atts) {
        $closediv = "</div>";
        
        $gad_cat = '';
        $red = "style='border: 1px solid red'";
        $all_valid = false;
        $show_all = "style='display:none'";
        
        $use_labels = $this->isIE();
        
        if (isset($atts['gad_cat'])) {
            $this->export = array('gad_cat' => $atts['gad_cat']);
        }
        
        if(isset($_REQUEST['gad_cat'])) {
            if ($_REQUEST['gad_cat'] == -1) {
                $gad_cat = $red;
            }
            $all_valid = true;
        }
        
        if(!$this->validate_required('my_name')) {
            $name = $red;
            $all_valid = false;
        }
        else {
        }
        
        if(!$this->validate_required('email')) {
            $email = $red;
            $all_valid = false;
        }
        else {
        }
                
        if(!$this->validate_required('address_street')) {
            $address_street = $red;
            $all_valid = false;
        }
        else {
        }
        
        if(!$this->validate_required('address_city')) {
            $address_city = $red;
            $all_valid = false;
        }
        else {
        }
        
        if(!$this->validate_required('address_state')) {
            $address_state = $red;
            $all_valid = false;
        }
        else {
        }
        
        if(!$this->validate_required('address_zip')) {
            $address_zip = $red;
            $all_valid = false;
        }
        else {
        }
        
        $dvd = array(
            '-1' => 'Select Your Free CD and DVD',
            '-2' => 'No Thank You',
            '-3' => '-- DVDs --',
            'Austin Powers in Goldmember' => 'Austin Powers in Goldmember',
            'Barbershop 2: Back in Business (Special Edition)' => 'Barbershop 2: Back in Business (Special Edition)',
            'Batman Begins (Single-Disc Widescreen Edition)' => 'Batman Begins (Single-Disc Widescreen Edition)',
            'Superman Returns (Widescreen Edition)' => 'Superman Returns (Widescreen Edition)',
            'King Kong (Widescreen Edition)' => 'King Kong (Widescreen Edition)',
            'The Clique' => 'The Clique',
            'Blade' => 'Blade',
            'The Lord of the Rings: The Fellowship of the Ring (Two-Disc Widescreen Theatrical Edition)' => 'The Lord of the Rings: The Fellowship of the Ring (Two-Disc Widescreen Theatrical Edition)',
            'The Matrix Reloaded (Full Screen Edition)' => 'The Matrix Reloaded (Full Screen Edition)',
            'Welcome to Nanalan - Favorites' => 'Welcome to Nanalan - Favorites',
            '-4' => '-- CDs --',
            'Christina Aguilera -- Christina Aguilera' => 'Christina Aguilera -- Christina Aguilera',
            'Our Time in Eden -- 10,000 Maniacs' => 'Our Time in Eden -- 10,000 Maniacs',
            'Backstreet Boys -- Backstreet Boys' => 'Backstreet Boys -- Backstreet Boys',
            'Rock Spectacle -- Barenaked Ladies' => 'Rock Spectacle -- Barenaked Ladies',
            'Four -- Blues Traveler' => 'Four -- Blues Traveler',
            'New Beginning -- Tracy Chapman' => 'New Beginning -- Tracy Chapman',
            'Voice of an Angel -- Charlotte Church' => 'Voice of an Angel -- Charlotte Church',
            'Recovering the Satellites -- Counting Crows' => 'Recovering the Satellites -- Counting Crows',
            'Falling Into You -- Celine Dion' => 'Falling Into You -- Celine Dion',
            'Yes I Am -- Melissa Etheridge' => 'Yes I Am -- Melissa Etheridge',
            'New Miserable Experience -- Gin Blossoms' => 'New Miserable Experience -- Gin Blossoms',
            'Cracked Rear View -- Hootie & The Blowfish' => 'Cracked Rear View -- Hootie & The Blowfish',
            'Pieces of You -- Jewel' => 'Pieces of You -- Jewel',
            'Ingenue -- KD Lang' => 'Ingenue -- KD Lang',
            'Why I Sing the Blues -- BB King' => 'Why I Sing the Blues -- BB King',
            'Throwing Copper -- Live.' => 'Throwing Copper -- Live.',
            'Ray of Light -- Madonna' => 'Ray of Light -- Madonna',
            'Jagged Little Pill -- Alanis Morissette' => 'Jagged Little Pill -- Alanis Morissette',
            'Monster -- R.E.M.' => 'Monster -- R.E.M.',
            'Mirrorball -- Sarah McLachlan' => 'Mirrorball -- Sarah McLachlan',
            'Seal -- Seal' => 'Seal -- Seal',
            'Titanic: Music from the Motion Picture Soundtrack' => 'Titanic: Music from the Motion Picture Soundtrack',
            'Baby One More Time -- Britney Spears' => 'Baby One More Time -- Britney Spears',
            'The Woman in Me -- Shania Twain' => 'The Woman in Me -- Shania Twain',
            'Motown Love Songs -- Various Artists' => 'Motown Love Songs -- Various Artists',
            'Reggae Hits, Vol. 36 -- Various Artists' => 'Reggae Hits, Vol. 36 -- Various Artists'
            );
        
        if ($all_valid) {
            $display = "<h1 id='finalize'><img src='" . $this->is_ssl() . "abundatrade.com/recommerce/wp-content/plugins/abundatrade_plugin/images/spinner.gif' />&nbsp;&nbsp;Please wait while we finalize your quote</h1>";
        }
        else {
            
            $display = "<form method='get' action='#'><input type='hidden' id='is_gadget' name='gadget' value='true'/><input type='hidden' name='unknown' value='false'><div id='abundatrade_gadget'>";
            $display .= "<h1 id='finalize' style='display:none'></h1>";
            $display .= "<div class='category_selector select_container'><div id='category_selection' $gad_cat class='selection sel_center'>This form requires javascript. Please use a javascript enabled browser";
            $display .= $closediv . $closediv;
            
            $display .= "<div class='large_container' style='display:none' id='large_container_div'><div id='manufacturer_selection' class='selection sel_left'>";
            $display .= $closediv;
            
            $display .= "<div id='carrier_selection' class='selection sel_left'>";
            $display .= $closediv;
            
            $display .= "<div id='device_selection' class='selection sel_left'>";
            $display .= $closediv;
            
            $display .= "<div id='condition_selection' class='selection sel_left'>";
            $display .= $closediv . $closediv;
            
            $display .= "<div class='quote_display select_container' id='quote_container_div' style='display:none'><div id='quote' class='quote_center'>";
            $display .= $closediv . $closediv;
            
            $display .= "<div class='description_container'><div id='description' class='box_center'>";
            $display .= "<p id='desc_desc'>Tell us more about your gadget including complete model #, make, etc...</p>";
            $display .= "<textarea name='description_entry' " . ($use_labels ? "rows='10'" : "") . "></textarea>";
            $display .= $closediv . $closediv;
            $display .= "<div id='master_container_contact' $show_all>";
            $display .= "<div class='contact_form_container'><div class='contact_form_thirds'>";
            if ($use_labels) {
                $display .= "<label for='my_name'>Your name*</label><br>";
            }
            $display .= "<input $name type='text' placeholder='Your name*' name='my_name' value='" . $this->get_value("my_name") . "' /><span class='required'>*</span>";
            $display .= $closediv;
            $display .= "<div class='contact_form_thirds'>";
            if ($use_labels) {
                $display .= "<label for='email'>Your Email*</label><br>";
            }
            $display .= "<input $email type='text' placeholder='Your email*' name='email' value='" . $this->get_value("email") . "'/><span class='required'>*</span>";
            $display .= $closediv;
            $display .= "<div class='contact_form_thirds'>";
            if ($use_labels) {
                $display .= "<label for='phone'>Your phone #</label><br>";
            }
            $display .= "<input $phone type='text' placeholder='Your phone #' name='phone' value = '" . $this->get_value("phone") . "'/>";
            $display .= $closediv . $closediv;
            $display .= "<div class='contact_form_container'><div class='contact_form_thirds' style='width:49%'>";
            if ($use_labels) {
                $display .= "<label for='address_street'>Address*</label><br>";
            }
            $display .= "<input $address_street type='text' placeholder='Address*' name='address_street' value='" . $this->get_value("address_street") . "'/><span class='required'>*</span>"; 
            $display .= $closediv;
            $display .= "<div class='contact_form_thirds' style='width:49%'>";
            if ($use_labels) {
                $display .= "<label for='address_street_two'>Address Line 2</label><br>";
            }
            $display .= "<input $address_street_two type='text' placeholder='Address Line 2' name='address_street_two' value='" . $this->get_value("address_street_two") . "'/>";
            $display .= $closediv . $closediv;
            $display .= "<div class='contact_form_container'><div class='contact_form_thirds'>";
            if ($use_labels) {
                $display .= "<label for='address_city'>City*</label><br>";
            }
            $display .= "<input $address_city type='text' placeholder='City*' name='address_city' value='" . $this->get_value("address_city") . "'/><span class='required'>*</span>";
            $display .= $closediv;
            $display .= "<div class='contact_form_thirds'>";
            if ($use_labels) {
                $display .= "<label for='address_state'>State*</label><br>";
            }
            $display .= "<input $address_state type='text' placeholder='State*' name='address_state' value='" . $this->get_value("address_state") . "'/><span class='required'>*</span>";
            $display .= $closediv;
            $display .= "<div class='contact_form_thirds'>";
            if ($use_labels) {
                $display .= "<label for='address_zip'>Zip Code*</label><br>";
            }
            $display .= "<input $address_zip type='text' placeholder='Zip Code*' name='address_zip' value='" . $this->get_value("address_zip") . "'/><span class='required'>*</span>";
            $display .= $closediv . $closediv;
            $display .= "<div style='height:auto;' class='contact_form_container'><div class='contact_form_thirds'></div><div class='contact_form_thirds'>";
            $display .= "<select name='dvd' id='choose_dvd' onChange='changeFree()' style='width:90%'>";
            foreach ($dvd as $value => $text) {
                $display .= "<option " . (isset($_REQUEST['dvd']) && $_REQUEST['dvd'] == htmlentities($value) ? "selected" : "") . " value='" . htmlentities($value) . "'>" . htmlentities($text) . "</option>";
            }
            $display .= "</select>";
            $display .= $closediv . $closediv;
            $display .= "<div class='contact_form_container'><div class='contact_form_thirds'></div><div class='contact_form_thirds'>";
            $display .= "<input disabled='disabled' type='submit' value='Submit to Make Your Cash'/>";
            $display .= $closediv . $closediv . $closediv;
            $display .= "</form>";
            
            $display .= $closediv;
        }
        
        if (!isset($this->export)) { 
            $this->export = array();
        }
        
        $display .= "<script type='text/javascript'> /* <![CDATA[ */ var abundacalc_gad = " . json_encode($this->export) . ";/* ]]> */</script>";
        
        if (true) {
            return $display;
        }
        else return "";
    }
    
    public function shortcode($atts) {
        
        if (!isset($atts['gadget_only'])) $atts['gadget_only'] = false;
        
        if (!isset($atts['a'])) {
            $affid = $this->settings->Affiliate_ID;
        }
        else {
            $affid = $atts['a'];
        }
        
        if ($atts['gadget_only']) {
            $hide = ' display: none;';
            $gadget_state = ' ';
        }
        else {
            $hide = ' ';
            $gadget_state = ' display: none;';
        }
        
        $display = '<div id="abundatrade">';
        $top = '<noscript><h1>Javascript is required for the calculator to work -- please enable it before continuing!</h1></noscript>
         <div id="top_input_section" class="calc_content_wrap calc_color1 calcbg1" style="'.$hide.'">
<div id="search_results_list"></div>
            <form id="abundaInput" class="abundaInput" style="margin-top: 6px;" onsubmit="return false;" method="post" >
                <input id="item_num" value="1" name="item_num" type="hidden"/>
                <input id="a" value="' . $affid . '" type="hidden"/>
                <div class="input_container">
                </div>

                <div class="input_container">'
                .($this->isIE() ? 
                    '<div class="label">Barcode, Title or Artist</div>'
                    : '').
                    '<div'.($this->isIE() ? '' : ' style="min-width:150px; width:100%;"').' class="product_holder">
                        <input'.($this->isIE() ? '' : ' style="min-width:150px; width:100%;"').' placeholder="UPC, ISBN, EAN, ASIN, Title or Artist" class="center validate[\'required\',\'length[3,25]\']" id="product_code" name="product_code" onkeyup="return; doSearch();" onblur="clean_product_code(this)" type="text"/>
                    </div>
                </div>

                <div class="input_container" style="width:200px;">
                    <div class="label"> Quantity </div>
                    <div class="qty_holder">
                        <input class="center validate[\'required\',\'digit[1,20]\']" id="product_qty" name="product_qty" value="1" type="text"/>
                    </div>
                </div>

                <div class="submit_holder">
                    <input class="btn1 right btn_link1 btnbg1" value="+ Add Item" type="submit"/>
                </div>';
        
        $bulk_button = '
            <div id="bulk_button" class="calcbg1" style="'.$hide.'">
                <p class="abunda_text2 calc_color1"><a href="#" onclick="transform_into_full_calc(\'gadget\');" class="calc_linkS1" >Add a gadget</a><a href="#" onclick="return bulk_open();" style="float:right; margin-right:20px;" class="calc_linkS1">Bulk Upload</a>
                </p>
            </div>';
        
        $switch_back = '
            <div id="switch_back_button" class="calcbg1" style="'.$gadget_state.'">
                <p class="abunda_text2 calc_color1">Can\'t find your gadget? <a href="' . $this->is_ssl() . 'abundatrade.com/recommerce/custom-quote-top-cash-gadgets" class="calc_linkS1">Get a custom quote</a>
                <a href="#" class="calc_linkS1" style="float:right; margin-right:20px;" onclick="transform_into_full_calc(\'main\');">Switch back to regular items</a></p>
            </div>';
        
        $bulk = '
            <div id="bulk" class="calcbg1">
                <div id="bulk_help" class="abunda_text calc_color1">You can cut and paste directly from popular office programs<br/> like Excel and Word.</div>
                <div id="bulk_text_holder"><textarea placeholder="02454352525998" cols=20 rows=10 id="bulk_upload" name="bulk_upload"></textarea></div>
                <div id="bulk_button_holder"><a href="#" class="likebutton" onclick="return bulk_close_window();">Go back</a>
                <a href="#" class="likebutton" onclick="bulk_submit_items();">Submit List</a></div>
	            <p class="calcbg1 bottomcurve">&nbsp;</p>
            </div>';
	    $second = '
            <div id="second_content" class="calc_content_wrap calcbg2 calc_color2" style="'.$hide.'">
                <div class="second_content_sec1">
                    <label class="calc_color2">Total Items:</label>
                    <div id="total_item_count">0</div>
                </div>
                <div class="second_content_sec2">
                <label class="calc_color2">Pre-Valuation Total:</label>
                <div id="total_prevaluation">$0.00</div>
            </div>
            
            <!--<div class="second_content_sec4">
                <a id="submitList" class="btnbg2 btn_link2" onclick="submit_the_list(this);">Get a quote</a>
            </div>-->
            <!--<div class="second_content_sec4">
                <a id="BeatAll" class="btnbg3 btn_link3" onClick="BeatAll()">Beat All</a>
            </div>-->
        </div>';
        $endform = "</form></div>";
        $endtop = "</div>";
        $supershow = "<a id='super_show' href='#' onclick='toggle_show(); return false;'>Show all zero value items</a>";
        $endAll = "</div>";
        $table_head = '<table cellspacing="0" bgcolor="#fff" cellpadding="0" id="abundaCalcTblTop" class="abundaCalcTbl" style="'.$hide.'">
                  <thead>
                    <tr>
                      <th style="display:none;" class="calcbg3 calc_color3">UPC</th>
                      <th colspan="2" class="calcbg3 calc_color3" width="638px" style="text-align:left;">Product Details</th>
                      <th class="calcbg3 calc_color3" style="padding-right:40px">Qty</th>
                      <!--<th class="calcbg3 calc_color3">Offers</th>-->
                      <th id="TheBestOffer" class="calcbg3 calc_color3 txtright" style="padding-right:44px">Offer</th>
                      <th class="calcbg3 calc_color3"><a class="calc_linkS3" onclick="clear_session()">Start Over</a></th>
                      <th style="display: none;">ID</th>
                    </tr>
                  </thead>
                  ';
        $table_body = '
                  <tbody id="abundaCalcBody_request">
                    
                  </tbody>
                   <!--<tfoot>
                     <tr>
                       <th class="calcbg2 calc_color2 thxpad">&nbsp;</th>
                       <th class="calcbg2 calc_color2">&nbsp;</th>
                       <th class="calcbg2 calc_color2 txtright" colspan="2">&nbsp;</th>
                       <th class="calcbg2 calc_color2 txtright">&nbsp;</th>
                       <th colspan="2" class="calcbg2 center">&nbsp;</th>
                     </tr>
                  </tfoot>-->
                  <tbody id="abundaCalcBody_process">
		  <tr><td colspan="6" id="ready2go" class="center">Did you know, you can use your smart phone, tablet or Kindle Fire as a scanner? <a href="http://abundatrade.com/abundascan-mobile-app.php" title="Click here to download the app">Click here to download the app</a></td></tr>
		</tbody>
		<tbody >
			<tr class="response">
		</tbody>
		</table>';

        $very_bottom = '
        
		<div id="very_bottom" style="'.$hide.'" class="calcbg2 bottomcurve"><div style="" class="second_content_sec4">
                <a id="submitList" class="likebutton" onclick="submit_the_list(this);">Continue</a>
            </div></div>'
            
            
            ;
        
        $gadget_begin = '<div id="gadget_abundatrade" style="'.$gadget_state.'" class="calc_content_wrap calc_color1 calcbg1 bottomcurve">';

        $gadget_manufacturer = '<input type="hidden" value="'. (isset($atts["manufacturer"]) ? $atts["manufacturer"] : '') . '" id="gadget_manufacturer"/>';
        $gadget_category = '<input type="hidden" value="' . (isset($atts["category"]) ? $atts["category"] : '') . '" id="gadget_category"/>';
        
        $gadget_selector = 
            '<form id="abundaGadgetInput" class="abundaInput" style="margin-top: 6px;" onsubmit="return false;" method="post" >
            
            <div id="new_gad_cat">
                <div class="abundaGadget_cat" onclick="setNewCat(1);">
                    <img src="' . $this->folders['PluginUrl'] . '/images/icons/cats/gadgets_icon01.jpg" />
                    <p>iPhone</p>
                </div>
                <div class="abundaGadget_cat" onclick="setNewCat(2);">
                    <img src="' . $this->folders['PluginUrl'] . '/images/icons/cats/gadgets_icon02.jpg" />
                    <p>Tablet</p>
                </div>
                <div class="abundaGadget_cat" onclick="setNewCat(3);">
                    <img src="' . $this->folders['PluginUrl'] . '/images/icons/cats/gadgets_icon03.jpg" />
                    <p>iPod Classic</p>
                </div>
                <div class="abundaGadget_cat" onclick="setNewCat(4);">
                    <img src="' . $this->folders['PluginUrl'] . '/images/icons/cats/gadgets_icon04.jpg" />
                    <p>iPod Touch</p>
                </div>
                <div class="abundaGadget_cat" onclick="setNewCat(5);">
                    <img src="' . $this->folders['PluginUrl'] . '/images/icons/cats/gadgets_icon05.jpg" />
                    <p>iPod Nano</p>
                </div>
                <div class="abundaGadget_cat" onclick="setNewCat(6);">
                    <img src="' . $this->folders['PluginUrl'] . '/images/icons/cats/gadgets_icon06.jpg" />
                    <p>Blackberry</p>
                </div>
                <div class="abundaGadget_cat" onclick="setNewCat(7);">
                    <img src="' . $this->folders['PluginUrl'] . '/images/icons/cats/gadgets_icon07.jpg" />
                    <p>Android</p>
                </div>
                <div class="abundaGadget_cat" onclick="setNewCat(8);">
                    <img src="' . $this->folders['PluginUrl'] . '/images/icons/cats/gadgets_icon08.jpg" />
                    <p>eReader</p>
                </div>
                <div class="abundaGadget_cat" onclick="setNewCat(9);">
                    <img src="' . $this->folders['PluginUrl'] . '/images/icons/cats/gadgets_icon09.png" />
                    <p>Mac Book</p>
                </div>
                <!-- <div class="abundaGadget_cat" onclick="setNewCat(10);">
                    <img src="' . $this->folders['PluginUrl'] . '/images/icons/cats/gadgets_icon10.jpg" />
                    <p>Game Consoles</p>
                </div> -->
            </div>';
        
        
            
            $gadget_selector .= '<div id="new_gad_man" style="display:none;">
                <div id="man_content" style="display:none;"></div>
                <div id="man_loader" style="width:30%; margin:auto; background-color:white; transition:background-color 1s ease 0;">
                    <div style="width:16px; margin:auto;">
                        <img src="' . $this->folders['PluginUrl'] . '/images/spinner.gif" />
                    </div>
                    <p style="text-align:center;">Loading Manufacturers</p>
                </div>
            </div>
            
            <div id="new_gad_dev" style="display:none;">
                <div id="dev_content" style="display:none;"></div>
                <div id="dev_loader" style="width:30%; margin:auto; background-color:white; transition:background-color 1s ease 0;">
                    <div style="width:16px; margin:auto;">
                        <img src="' . $this->folders['PluginUrl'] . '/images/spinner.gif" />
                    </div>
                    <p style="text-align:center;">Loading Devices</p>
                </div>
            </div>
            
            <div id="new_gad_car" style="display:none;">
                <div id="car_content" style="display:none;"></div>
                <div id="car_loader" style="width:30%; margin:auto; background-color:white; transition:background-color 1s ease 0;">
                    <div style="width:16px; margin:auto;">
                        <img src="' . $this->folders['PluginUrl'] . '/images/spinner.gif" />
                    </div>
                    <p style="text-align:center;">Loading Carriers</p>
                </div>
            </div>
            
            <div id="new_gad" style="display:none;">
                <div class="gad_big_pict">
                    <img src="" />
                </div>
                <div class="gad_details">
                    <p>Details go here</p>
                    <select>
                    <option>Select your condition</option>
                    </select>
                </div>
                <div id="gad_adder" style="display:inline-block" class="submit_holder">
                    <input class="btn1 right btn_link1 btnbg1" value="+ Add" type="submit"/>
                </div>
            </div>
            
            </form>';

        $status = "<div id=\"login_status_abundatrade\"></div>";

        $newtop = "<div id='top_input_section' class='calchead'><form id='abundaInput' onsubmit='return false;' method='post'>
<div class='searchby'><img src='" . $this->folders['PluginUrl'] . "/css/images/searchby.png'></div>
<div class='upcetc'>
<input id='product_code' name='product_code' onkeyup='return; doSearch();' onblur='clean_product_code(this);' autocomplete='off' placeholder='UPC,ASIN,ISBN,Title, or Artist' type='text' class='upcinputbox'></div>
<div class='quantitybox'>
<div class='quantitylabel'>
<span style='margin-right:10px;'>QTY.</span>
<input id='product_qty' name='product_qty' value='1' type='text' class='quantityinputbox'>
</div></div>
<div class='addbuttonbox'>
<input type='submit' class='likebutton' value='+ Add'>
</div>
<div class='bulkuploadbox'>
<a href='#' onclick='return bulk_open()'>Bulk Upload</a>
<br>
<a href='#' onclick='transform_into_full_calc('gadget');'>Add a Gadget</a>
</div>
<div class='prevaluationbox'>
Pre-valuation total: <span id='total_prevaluation' class='valuationtotal'>$0.00</span>
<br>
Item Total: <span id='total_item_count' class='itemtotal'>0</span>
</div>
<div class='clear'></div> 
</form>
</div>";
        
        $display .= $status;
        $display .= $bulk;
        $display .= "<div id='calc_follow' style='position:relative'>";
        $display .= $gadget_begin;
        $display .= $gadget_selector;
        $display .= $endtop;
        $display .= $newtop;
        //$display .= $top;
        //$display .= $endform;
        //$display .= $bulk_button;
        //$display .= $switch_back;
        //$display .= $second;
        $display .= $table_head;
        $display .= "</table></div><table id='abundaCalcTbl' class='abundaCalcTbl'>";
        $display .= $table_body;
        $display .= $very_bottom;
        $display .= $endAll;
        
        return $display;
    }
    
    /**
     * Retuns a pointer to the settings object
     */
    public function getSettings() {
        return array(&$this->settings);
    }
    
    public function doshortcode($atts) {
        $display = apply_filters("abundatrade(shortcode(abundatrade))", $atts);
        return $display;
    }
    
    public function dogadgets($atts) {
        $display = apply_filters("abundatrade(shortcode(gadgets))", $atts);
        return $display;
    }
    
    public function addScripts() {
        if (file_exists($this->folders['UploadsDir']['basedir'] . '/abundatrade/themes/' . $this->settings->Theme . '.css')) {
            wp_register_style("abundatrade_classic", $this->folders['UploadsDir']['baseurl'] . '/abundatrade/themes/' . $this->settings->Theme . '.css');
        }
        else if (file_exists($this->folders['PluginDir'] . '/themes/' . $this->settings->Theme . '.css')) {
            wp_register_style("abundatrade_classic", $this->folders['PluginUrl'] . '/themes/' . $this->settings->Theme . '.css');
        }
        else {
            wp_register_style("abundatrade_classic", $this->folders['PluginUrl'] . '/themes/classic.css');
        }
        
        if (file_exists($this->folders['UploadsDir']['basedir'] . '/abundatrade/themes/' . $this->settings->Theme . '-prompt.css')) {
            wp_register_style("abundatrade_prompt_classic", $this->folders['UploadsDir']['baseurl'] . '/abundatrade/themes/' . $this->settings->Theme . '-prompt.css');
        }
        else if (file_exists($this->folders['PluginDir'] . '/themes/' . $this->settings->Theme . '-prompt.css')) {
            wp_register_style("abundatrade_prompt_classic", $this->folders['PluginUrl'] . '/themes/' . $this->settings->Theme . '-prompt.css');
        }
        else {
            wp_register_style("abundatrade_prompt_classic", $this->folders['PluginUrl'] . '/themes/classic-prompt.css');
        }
        
        wp_register_style("abundatrade_jsui", $this->folders['PluginUrl'] . '/css/jquery-ui-1.10.3.custom.css');
        wp_register_style("abundatrade_qtip", $this->folders['PluginUrl'] . '/css/jquery.qtip.css');
        
        wp_register_style("abunda_gadgets", $this->folders['PluginUrl'] . '/themes/gadget.css');
        
        wp_register_script("abundatrade_md5", $this->folders['PluginUrl'] . '/js/MD5.js');
        wp_register_script("abundatrade_remote", $this->folders['PluginUrl'] . '/js/remote.js', array('jquery','abundatrade_md5', 'jquery-ui-autocomplete'));
        wp_register_script("abundatrade_impromptu", $this->folders['PluginUrl'] . '/js/jquery-impromptu.4.0.min.js', array('jquery'));
        wp_register_script("abundatrade_register", $this->folders['PluginUrl'] . '/js/register.js', array('jquery', 'abundatrade_remote'));
        wp_register_script("abundatrade_gadgets", $this->folders['PluginUrl'] . '/js/abunda_gadgets_short.js', array('jquery'));
        wp_register_script("abundatrade_qtip_js", $this->folders['PluginUrl'] . '/js/jquery.qtip.js', array('jquery'));
        
        wp_enqueue_style("abundatrade_jsui");
        wp_enqueue_style("abundatrade_qtip");
        wp_enqueue_style("abundatrade_classic");
        wp_enqueue_style("abundatrade_prompt_classic");
        wp_enqueue_style("abunda_gadgets");
        wp_enqueue_script("abundatrade_qtip_js");
        wp_enqueue_script("abundatrade_md5");
        wp_enqueue_script("abundatrade_remote");
        wp_enqueue_script("abundatrade_impromptu");
        wp_enqueue_script("abundatrade_register");
        wp_enqueue_script("abundatrade_gadgets");
        if (!isset($this->export)) {
            $this->export = array();
        }
        
        $abundacalc = array('server' => 'abundatrade.com', 
            'bulk' => 'stable.abundatrade.com',
            'url' => $this->folders['PluginUrl'],
            'export' => $this->export,
            'thanks' => $this->settings->Thank_you_page);
        if (isset($_REQUEST['upload_id']) && $_REQUEST['upload_id'] != '') {
            $abundacalc['upload_id'] = $_REQUEST['upload_id'];
        }
        wp_localize_script('abundatrade_remote','abundacalc',$abundacalc);
    }
    
    /**
     * Creates a map structure
     */
    function __construct() {
        $this->BuildFolderList();
        
        add_filter("abundatrade(getFolders)", array(&$this, "getFolders"), 1);
        add_filter("abundatrade(applyConfig)", array(&$this, "applyConfig"), 1);
        add_filter("abundatrade(shortcode(abundatrade))", array(&$this, "shortcode"), 1);
        add_filter("abundatrade(shortcode(gadgets))", array(&$this, "gadget"), 1);
        //////////////////// shortcode defs
        add_shortcode("abundatrade", array($this, "doshortcode"));
        add_shortcode("abundagadgets", array($this, "dogadgets"));
        
        add_filter("abundatrade(settings)", array($this, "getSettings"), 200, 0);
        
        add_action("wp_enqueue_scripts", array($this, "addScripts"));
        
        spl_autoload_register(array($this, "autoload"));
        
        $skel = new skel__skel();
        
        //load settings last for updates
        $this->settings = new skel__settings();
    }
    
    /**
     * Autoloads all classes as required to only load in what we need
     * @var string $classname The name of the class to load
     */
    static public function autoload($classname) {
        $file = str_replace("__", "/", $classname);
        $folders = apply_filters("abundatrade(getFolders)", array());
        if (file_exists($folders['PluginDir'] . $file . ".php"))
            include_once($folders['PluginDir'] . $file . ".php");
        //else
        //echo "<pre>file no exists: " . $folders['PluginDir'] . $file . ".php\n</pre>";
    }
    
    /**
     * Builds a list of folders for later distribution so we can find ourselves
     * call with apply_filters("abundatrade(getFolders", array());
     */
    private function BuildFolderList() {
        $config = $this->applyConfig(array());
        $this->folders = array();
        $this->folders['UploadsDir'] = wp_upload_dir();
        $this->folders['PluginDir'] = plugin_dir_path(__FILE__);
        $this->folders['PluginUrl'] = plugins_url('', __FILE__);
        $this->folders['PluginAdmin'] = admin_url() . 'options-general.php?page=' . $config['config']['slug'];
        $this->folders['Basename'] = plugin_basename(__FILE__);
    }
}

$GLOBALS['abundatrade_withinboredom'] = new abundatrade_withinboredom();

//we don't want to autoload later on
//spl_autoload_unregister(array($GLOBALS['TheMap_withinboredom'], 'autoload'));