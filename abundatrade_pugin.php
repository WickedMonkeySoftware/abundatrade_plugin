<?php
/**
 * @package abundatrade
 * @version 1.0
 * @author Robert Landers (landers.robert@gmail.com)
 */
/*
Plugin Name: Abundatrade Plugin
Plugin URI: http://wordpress.org/extend/plugins/abundatrade/
Description: Undecided
Author: withinboredom
Version: 1.0
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
        $display = '<div id="top_content">';
        $top = '<div id="top_input_section" class="calc_content_wrap orange_bg">

  <form id="abundaInput" class="abundaInput" onsubmit="handleAddedItem(); return false;" submit="/trade/calculator.php" method="post" >
    <input id="item_num" value="1" name="item_num" type="hidden"/>

    <div class="input_container">
            </div>
    
    <div class="input_container">
      <div class="label">UPC or ISBN</div>
      <div class="product_holder">
        <input class="validate[\'required\',\'length[3,25]\']" id="product_code" name="product_code" onblur="clean_product_code(this)" type="text"/>
      </div>
    </div>

    <div class="input_container">
      <div class="label"> Quantity </div>
      <div class="qty_holder">
        <input class="validate[\'required\',\'digit[1,20]\']" id="product_qty" name="product_qty" value="1" type="text"/>
      </div>
    </div>

    <div class="submit_holder">
      <input class="submit" value="" type="submit"/>
    </div>';
        $second = '<div id="second_content" class="calc_content_wrap green_bg">
                      <div class="second_content_sec1">
                      <label>Total Items:</label><div id="total_item_count">0</div></div>
                      <div class="second_content_sec2">
                        <label>Pre-Valuation Total:</label>
                        <div id="total_prevaluation">
                          $0.00                        </div>
                      </div>
                      <div class="second_content_sec3"><a id="submitList" href="#"><img style="z-index:0;" src="../images/list-abunda.jpg" alt="" /></a></div>
                      </div>';
        $endform = "</form></div>";
        $endtop = "</div>";
        $display .= $top;
        $display .= $endform;
        $display .= $second;
        $display .= $endtop;        return $display;
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
        wp_enqueue_style("abundatrade_classic");
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