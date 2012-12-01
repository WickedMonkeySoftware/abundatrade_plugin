<?php
/**
 * SKEL is a ui managment library
 * @author Robert Landers (landers.robert@gmail.com)
 * @copyright 2012 GPLV2+
 * @package Abundatrade
 * @subpackage skel
 * @version 0.1
 */

if (!defined("WP_CONTENT_DIR")) exit();

class skel__skel
{
    /**
     * The configuration of skel stored
     */
    private $config;
    
    /**
     * The folder list
     */
    private $folders;
    
    /**
     * @var int Plugin settings page hook id
     */
    private $page_hook;
    
    /**
     * Lays out the skel framework
     */
	function __construct()
    {
    	$this->config = apply_filters("abundatrade(applyConfig)", array());
        $this->folders = apply_filters("abundatrade(getFolders)", array());
        
        if (isset($this->config['config'])) {
            if (isset($this->config['config']['settings']) && $this->config['config']['settings']) {
                if (is_admin()) {
                    
                    //now we add a settings menu item
                    add_action('admin_menu', array($this, 'buildSettings'));
                    add_action('admin_print_styles',array($this, 'loadcss'));
                }
            }
        }
    }
    
    /**
     * Loads tabified css
     */
    public function loadcss() {
        wp_register_style('abunda_admin_css', $this->folders['PluginUrl'] .'/css/admin.css'); 
        wp_enqueue_style ('abunda_admin_css');
    }
    
    /**
     * Displays the admin page for a given tab, and defaults to tab 0
     * Calls stuff
     */
    public function display() {
        if(!isset($_GET['tab']))
        {
            $_GET['tab'] = 0;
        }
        
        if (current_user_can('manage_options')) $this->render_tabs();
    }
    
    /**
     * Displays the tabs at the top of the settings page
     */
    private function render_tabs() {
        ?>
        <div id="icon-slp-widget" class="icon32"><br /></div><h2>Store Locator Plus: Widget Pack Settings</h2>
        <div id="navcontainer">
            <ul id="navlist">
                <?php
        $count = 0;
        foreach ($this->config['tabs'] as $tab) {
            echo "<li><a" . (($tab[0] === $this->config['tabs'][$_GET['tab']][0]) ? " id='current'": "") . " href='". $this->folders['PluginAdmin'] ."&tab=". $count++ ."'>" . $tab[0] . "</a></li>";
        }
                ?>
            </ul>
        </div>
        <div class="tool-box">
        <h3 class="title"><?php echo $this->config['tabs'][$_GET['tab']][0]; ?></h3>
        <?php
        $display = new $this->config['tabs'][$_GET['tab']][1];
        $display->settings();
        ?>
        </div>
        <?php
    }
    
    /**
     * Adds a help tab to a settings tab
     */
    public function add_help_tab() {
        
        if (!isset($_GET['tab'])) $_GET['tab'] = 0;
        
        $screen = get_current_screen();
        
        if ($screen->id != $this->page_hook) {
            return;
        }
        
        foreach ($this->config['help'] as $tab => $help) {
            if($tab == $_GET['tab']) {
                foreach ($help as $menu) {
                    $screen->add_help_tab(array(
                        'id' => $menu[0],
                        'title' => $menu[0],
                        'content' => $menu[1],
                        'callback' => array($this, 'show_content')
                        ));
                }
            }
        }
    }
    
    /**
     * Call back for custom scenarios on the help tab
     * @param WP_Screen $screen The screen object for the current page
     * @param array $tab An array containing the current help tab selected
     */
    function show_content($screen, $tab) {
    }
    
    /**
     * Builds the settings menu stuff
     */
    public function buildSettings() {
        $this->page_hook = add_options_page($this->config['config']['page_title'], $this->config['config']['button_title'], 'manage_options', $this->config['config']['slug'], array($this, "display"));
        add_action('load-'.$this->page_hook, array($this, 'add_help_tab'));
    }
}
