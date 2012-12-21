<?php
/**
 * @package abundatrade_plugin
 * @version 1.6
 * @author Robert Landers (landers.robert@gmail.com)
 */
/*
Plugin Name: Abundatrade Plugin
Plugin URI: http://wordpress.org/extend/plugins/abundatrade-plugin/
Description: Earn extra income for your site via the Abundatrade affiliate program!
Author: withinboredom
Version: 1.6
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
    
    public function shortcode($atts) {
                $display = '<div id="abundatrade">';
         $top = '<div id="top_input_section" class="calc_content_wrap calc_color1 calcbg1">

  <form id="abundaInput" class="abundaInput" style="margin-top: 6px;" onsubmit="return false;" method="post" >
    <input id="item_num" value="1" name="item_num" type="hidden"/>
    <input id="a" value="' . $this->settings->Affiliate_ID . '" type="hidden"/>
    <div class="input_container">
            </div>

    <div class="input_container">
      <div class="label">UPC or ISBN</div>
      <div class="product_holder">
        <input class="center validate[\'required\',\'length[3,25]\']" id="product_code" name="product_code" onblur="clean_product_code(this)" type="text"/>
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
        $bulk_button = '<div id="bulk_button" class="calcbg1"><p class="abunda_text calc_color1">Have a lot of items? <a href="#" onclick="return bulk_open();" class="calc_linkS1">Bulk Upload</a></p></div>';
        $bulk = "<div id=\"bulk\" class=\"calcbg1\"><div id=\"bulk_help\" class='abunda_text calc_color1'>You can cut and paste directly from popular office programs<br/> like Excel and Word.</div><textarea placeholder=\"02454352525998\" cols=20 rows=10 id=\"bulk_upload\" name=\"bulk_upload\"></textarea></p><p><a href='#' class=\"btn1 btnbg1 btn_link1 marleft\" onclick='return bulk_close_window();'>Go back</a><a href='#' class=\"btn1 btnbg1 btn_link1 marright\" onclick='bulk_submit_items();'>Submit List</a></p>
	<p class=\"calcbg1 bottomcurve\">&nbsp;</p>
    </div>";
	$second = '<div id="second_content" class="calc_content_wrap calcbg2 calc_color2">
                       <div class="second_content_sec1">
                      <label class="calc_color2">Total Items:</label><div id="total_item_count">0</div></div>
                      <div class="second_content_sec2"><label class="calc_color2">Pre-Valuation Total:</label><div id="total_prevaluation">$0.00</div>
                      </div>
                      <div class="second_content_sec3"><a id="submitList" class="btnbg2 btn_link2" onclick="submit_the_list(this);">Send list to Abunda</a></div>
                      </div>';
        $endform = "</form></div>";
        $endtop = "</div>";
        $table = '<table cellspacing="0" cellpadding="0" id="abundaCalcTbl">
                  <thead>
                    <tr>
                      <th class="calcbg3 calc_color3">UPC</th>
                      <th class="calcbg3 calc_color3">Product Details</th>
                      <th class="calcbg3 calc_color3">Qty</th>
                      <th class="calcbg3 calc_color3 txtright">Per Item</th>
                      <th class="calcbg3 calc_color3 txtright">Total</th>
                      <th class="calcbg3 calc_color3"><a class="calc_linkS3" onclick="clear_session(this);">Delete All</a></th>
                      <th style="display: none;">ID</th>
                    </tr>
                  </thead>
                  <tbody id="abundaCalcBody_request">
                    
                  </tbody>
                   <tfoot>
                     <tr>
                       <th class="calcbg2 calc_color2 thxpad">Total Items:</th>
                       <th class="calcbg2 calc_color2" id="item_count">0</th>
                       <th class="calcbg2 calc_color2 txtright" colspan="2">Pre-Valuation Total</th>
                       <th class="calcbg2 calc_color2 txtright" id="grand_total">$0.00</th>
                       <th colspan="2" class="calcbg2 center"><a class="calc_linkS4" onclick="clear_session(this);">Delete All</a></th>
                     </tr>
                  </tfoot>
                  <tbody id="abundaCalcBody_process">
		  <tr><td colspan="6" class="center" id="ready2go">Enter an item UPC, ISBN, or EAN to see its value here</td></tr>
		</tbody>
		<tbody >
			<tr class="response">
		</tbody>
		</table>

		<p class="calcbg2 bottomcurve">&nbsp;</p>';

        $status = "<div id=\"login_status_abundatrade\"></div>";

        $display .= $status;
        $display .= $bulk;
        $display .= $top;
        $display .= $endform;
        $display .= $bulk_button;
        $display .= $second;

        $display .= $table;
        $display .= $endtop;
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
        wp_register_script("abundatrade_md5", $this->folders['PluginUrl'] . '/js/MD5.js');
        wp_register_script("abundatrade_remote", $this->folders['PluginUrl'] . '/js/remote.js', array('jquery','abundatrade_md5'));
        wp_register_script("abundatrade_impromptu", $this->folders['PluginUrl'] . '/js/jquery-impromptu.4.0.min.js', array('jquery'));
        wp_register_script("abundatrade_register", $this->folders['PluginUrl'] . '/js/register.js', array('jquery', 'abundatrade_remote'));
        
        wp_enqueue_style("abundatrade_classic");
        wp_enqueue_script("abundatrade_md5");
        wp_enqueue_script("abundatrade_remote");
        wp_enqueue_script("abundatrade_impromptu");
        wp_enqueue_script("abundatrade_register");
        $abundacalc = array('server' => 'abundatrade.com', 
            'url' => $this->folders['PluginUrl'], 
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
        
        add_shortcode("abundatrade", array($this, "doshortcode"));
        
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
