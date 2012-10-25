<?php
/**
 * @package abundatrade_plugin
 * @version 1.0
 * @author Robert Landers (landers.robert@gmail.com)
 */
/*
Plugin Name: Abundatrade Plugin
Plugin URI: http://wordpress.org/extend/plugins/abundatrade-plugin/
Description: Earn extra income for your site via the Abundatrade affiliate program!
Author: withinboredom
Version: 0.4
Author URI: http://withinboredom.info
 */

if (!defined("WP_CONTENT_DIR")) exit();

class abundatrade_withinboredom {
    
    private $folders;
    
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
            'settings' => array(
                    'Overview' => "Stuff here",
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
        $top = '<div id="top_input_section" class="calc_content_wrap orange_bg">

  <form id="abundaInput" class="abundaInput" onsubmit="return false;" method="post" >
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

    <div class="input_container">
      <div class="label"> Quantity </div>
      <div class="qty_holder">
        <input class="center validate[\'required\',\'digit[1,20]\']" id="product_qty" name="product_qty" value="1" type="text"/>
      </div>
    </div>

    <div class="submit_holder">
      <input class="submit" value="" type="submit"/>
    </div>';
        $bulk_button = '<div id="bulk_button" class="green_bg"><span class="abunda_text">Have a lot of bulk items:<span><div onclick="bulk_open();" id="bulk_likea_button">Bulk Upload</div></div>';
        $bulk = "<div id=\"bulk\" class=\"orange_bg\"><div id=\"bulk_help\" class='abunda_text'>Enter items in the format UPC Quanity, one per line. Like <pre>804147123529 2\n024543525998 1</pre></div><textarea cols=20 rows=10 id=\"bulk_upload\" name=\"bulk_upload\"></textarea><br/><div id='bulk_close' onclick='bulk_close_window();'>Go back</div><div id='bulk_submit' onclick='bulk_submit_items();'>Submit List</div></div>";
        $second = '<div id="second_content" class="calc_content_wrap green_bg">
                      <div class="second_content_sec1">
                      <label>Total Items:</label><div id="total_item_count">0</div></div>
                      <div class="second_content_sec2">
                        <label>Pre-Valuation Total:</label>
                        <div id="total_prevaluation">
                          $0.00                        </div>
                      </div>
                      <div class="second_content_sec3"><a id="submitList" onclick="submit_the_list(this);"><img style="z-index:0;" src="'. $this->folders['PluginUrl'] .'/images/list-abunda.jpg" alt="" /></a></div>
                      </div>';
        $endform = "</form></div>";
        $endtop = "</div>";
        $table = '<table cellspacing="0" cellpadding="0" id="abundaCalcTbl">
                  <thead>
                    <tr>
                      <th>UPC</th>
                      <th>Product Details</th>
                      <th>Qty</th>
                      <th>Per Item</th>
                      <th>Total</th>
                      <th class="delete"><a onclick="clear_session(this);">Delete All</a></th>
                      <th style="display: none;">ID</th>
                    </tr>
                  </thead>
                  <tbody id="abundaCalcBody_request">
                  </tbody>
                  <tfoot>
                    <tr>
                      <th >Total Items:</th>
                      <th id="item_count">0</th>
                      <th colspan="2">Pre-Valuation Total</th>
                      <th id="grand_total">$0.00</th>
                      <th colspan="2"><a onclick="clear_session(this);">Delete All </a></th>
                    </tr>
                  </tfoot>
                  <tbody id="abundaCalcBody_process">
		            </tbody>
            <tbody >
                <tr class="response">
                </tr>
            </tbody>
        </table>';
        $display .= $bulk_button;
        $display .= $bulk;
        $display .= $top;
        $display .= $endform;
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
        wp_register_style("abundatrade_classic", $this->folders['PluginUrl'] . '/themes/classic.css');
        wp_register_script("abundatrade_remote", $this->folders['PluginUrl'] . '/js/remote.js', array('jquery'));
        wp_register_script("abundatrade_impromptu", $this->folders['PluginUrl'] . '/js/jquery-impromptu.4.0.min.js', array('jquery'));
        
        wp_enqueue_style("abundatrade_classic");
        wp_enqueue_script("abundatrade_remote");
        wp_enqueue_script("abundatrade_impromptu");
        wp_localize_script('abundatrade_remote','abundacalc',array('server' => 'dev.abundatrade.com', 'url' => $this->folders['PluginUrl'], 'thanks' => $this->settings->thankyou_page)); 
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
     */
    private function BuildFolderList() {
        $config = $this->applyConfig(array());
        $this->folders = array();
        $this->folders['PluginDir'] = plugin_dir_path(__FILE__);
        $this->folders['PluginUrl'] = plugins_url('', __FILE__);
        $this->folders['PluginAdmin'] = admin_url() . 'options-general.php?page=' . $config['config']['slug'];
        $this->folders['Basename'] = plugin_basename(__FILE__);
    }
}

$GLOBALS['abundatrade_withinboredom'] = new abundatrade_withinboredom();

//we don't want to autoload later on
//spl_autoload_unregister(array($GLOBALS['TheMap_withinboredom'], 'autoload'));