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
    
    private function shortcode($atts) {
    }
    
    /**
     * Creates a map structure
     */
    function __construct() {
        $this->BuildFolderList();
        
        add_filter("abundatrade(getFolders)", array(&$this, "getFolders"), 1);
        add_filter("abundatrade(applyConfig)", array(&$this, "applyConfig"), 1);
        add_filter("abundatrade(shortcode(abundatrade))", array(&$this, "shortcode"), 1);
        
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
        $this->folders = array();
        $this->folders['PluginDir'] = plugin_dir_path(__FILE__);
        $this->folders['PluginUrl'] = plugins_url('', __FILE__);
        $this->folders['PluginAdmin'] = admin_url() . 'admin.php?page=';
        $this->folders['Basename'] = plugin_basename(__FILE__);
    }
}

$GLOBALS['abundatrade_withinboredom'] = new abundatrade_withinboredom();

//we don't want to autoload later on
//spl_autoload_unregister(array($GLOBALS['TheMap_withinboredom'], 'autoload'));