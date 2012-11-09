<?php

//do not allow hijackers
if (!defined("WP_CONTENT_DIR")) exit();

class skel__settings
{
    /**
     * This is the settings array (do not modify directly)
     * @var mixed $settings_array
     */
    private $settings_array;
    
    /**
     * The Affiliate ID
     * @var string $Affiliate_ID
     */
    public $Affiliate_ID;
    
    /**
     * The saved version from the last time this plugin was loaded
     * @var string $version
     */
    public $version;
    
    /**
     * The url to send the user to for a thanks!
     * @var string $thankyou_page The url to send the user to on submit
     */
    public $Thank_you_page;
    
    /**
     * The Theme to load
     * @var string $Theme The theme to load for the calcualator
     */
    public $Theme;
    
    /**
     * The version of this code
     */
    private $coded_version = "1.1";
    
    /**
     * Loads default options or gets them from the db if they already exist
     * @var mixed $default The default options to load
     * @return mixed The options from the db or the defaults
     */
    function options($default) {
        $default = array_merge($default, array(
                    "version" => "0.0",
                    "Affiliate_ID" => "ABU-1338563844",
                    "Thank_you_page" => "http://abundatrade.com/trade/thank-you.php?a=abundatrade",
                    "Theme" => "classic"
                ));
        
        if (get_option("skel_abundatrade_options", false) === false) {
            $options = array();
        }
        else {
            $options = get_option("skel_abundatrade_options");
        }
        
        $options = array_merge($default, $options);
        
        return $options;
    }
    
    public function applySettings($var) {
        foreach($var as $setting => $value) {
            if (isset($this->$setting)) $this->$setting = $value;
        }
    }
    
    /**
     * Reduces the class's settings to an array and returns them
     * @var mixed $settings Other settings to merge these with (for addons)
     * @return mixed The settings array
     */
    function getSettings($settings) {
        $this->reduceSettings();
        return array_merge($settings, $this->settings_array);
    }
    
    /**
     * Run update code here
     * @var string $version The version that was installed previously
     * @var string $coded_version The version that is currently running (or to update to)
     */
    function update($version, $coded_version) {
        switch ($version)
        {
        	case "0.0":
                // a fresh install
                break;
            case "0.1":
                // from the very first version
                break;
            case "0.2":
                // from this version ... slightly confused
                break;
            case "0.6":
                // from before the theme
            default:
                // from an unknown version ... 
                break;
        }
        
    }
    
    /**
     * Gets the plugin settings
     * @return skel__settings This plugin's settings class
     */
    public static function Settings() {
        $settings = apply_filters("abundatrade(settings)", array());
        return $settings[0];
    }
    
    public static function RenderBox($title, $description = '', $inputs = null) {
        ?>
        <div class="postbox"><div class="handlediv" title="Click to open/close"><br /></div>
        <h3 class="hndle">
        
        <span><?php echo $title; ?></span>
        <a name="<?php echo str_replace(" ", "_", $title); ?>"></a>
        </h3>
        <div class="inside">
        <?php
        if ($description != '') {
        ?>
        
        <div class="section_description"><p><?php echo $description; ?></p></div>
        
        <?php
        }
        
        if (is_array($inputs)) {
            foreach($inputs as $input) {
                echo "<p>" . $input['name'] . ": ";
                $type = $input['type'];
                
                switch ($type) {
                    case 'select':
                        $options = $input['options'];
                        unset($input['options']);
                        
                        $selected = $input['value'];
                        unset($input['value']);
                        
                        echo "<select ";
                        foreach ($input as $part => $value) {
                            echo $part . "=\"" . $value . "\" ";
                        }
                        echo ">";
                        
                        foreach ($options as $option) {
                            echo "<option value=\"$option\" " . ($option == $selected ? "selected" : "") . ">$option</option>";
                        }
                        
                        echo "</select>";
                        
                        break;
                    default:
                        echo "<input ";
                        foreach ($input as $part => $value) {
                            echo $part . "=\"" . $value . "\"";
                        }
                        echo " /></p>";
                        break;
                }
            }
        }
        ?>
        </div></div>
        <?php
    }
    
    /**
     * Create a settings class
     */
	function __construct() {
        //load all settings
        add_filter("abundatrade(default_options)", array($this, "options"));
        add_action("abundatrade(update)", array($this, "update"), 1, 2);
        add_filter("abundatrade(getSettings)", array($this, "getSettings"));
        $this->settings_array = apply_filters("abundatrade(default_options)", array());
        
        foreach ($this->settings_array as $setting => $setto) {
            $this->$setting = $setto;
        }
        
        if ($this->version != $this->coded_version) {
            do_action("abundatrade(update)", $this->version, $this->coded_version);
            $this->version = $this->coded_version;
        }
        
        add_action("shutdown", array($this, "save"));
    }
    
    /**
     * Reduces all class vars into an array for saving or distribution
     */
    private function reduceSettings() {
        foreach ($this->settings_array as $setting => $setto) {
            $this->settings_array[$setting] = $this->$setting;
        }
    }
    
    /**
     * Reduces class vars and then saves them to the db
     */
    function save() {
        $this->reduceSettings();
        
        update_option("skel_abundatrade_options", $this->settings_array);
    }
}
