<?php
/**
 * Displays a settings page
 * @author Robert Landers (landers.robert@gmail.com)
 * @package abundatrade
 * @version 1.6.1
 */

//do not allow hijackers
if (!defined("WP_CONTENT_DIR")) exit();

/**
 * This class handles display of all options
 */
class tabs__settings_withinboredom
{
	function __construct() {
        
    }
    
    // display admin stuff ...
    function settings() {
        $settings = skel__settings::Settings();
        
        if (current_user_can('manage_options')) {
            $settings->applySettings($_POST);
        }
        
        ?>
        
        <form method="post" action="">
        <div id="poststuff" class="metabox-holder">
        <div class="meta-box-sortables">
        <script type="text/javascript">
        
         jQuery(document).ready(function($) {
             $('.postbox').children('h3, .handlediv').click(function(){
                 $(this).siblings('.inside').toggle();
             });
         });         
         jQuery(document).ready(function($) {
             $('.csl_themes-moreicon').click(function(){
                 $(this).siblings('.csl_themes-moretext').toggle();
             });
         });         
       </script>
       
        <?php
        skel__settings::RenderBox("Using", "Place the [abundatrade] shortcode on any page or post where you want the Abundatrade calculator to appear.");
        skel__settings::RenderBox("Affiliate Information", "Enter your affiliate Id", array(
            'Affiliate ID' => array(
                    'type'  => 'text',
                    'name'  => 'Affiliate ID',
                    'id'    => 'Affiliate_ID',
                    'value' => $settings->Affiliate_ID
                ),
            'Thank you Page' => array(
                    'type'  => 'text',
                    'name'  => 'Thank you page',
                    'id'    => 'Thank_you_page',
                    'value' => $settings->Thank_you_page
                ),
            'Theme' => array(
                    'type'  => 'select',
                    'name'  => 'Theme',
                    'id'    => 'Theme',
                    'value' => $settings->Theme,
                    'options' => $this->getFileList('themes', '.css', true)
                )
            ));
        ?>
        </div>
        </div>
        <input type="submit" class="button-primary" value="Save Changes" />
        </form>
        <?php
    }
    
    /**
     * Returns a list of files with a given extension
     * @param string $dir The subdirectory to search 
     * @param string $ext The extension to search for
     * @param boolean $remove_ext Whether to remove the extension
     */
    function getFileList($dir, $ext, $remove_ext) {
        $folders = apply_filters("abundatrade(getFolders)", array());
        $files = scandir($folders['PluginDir'] . '/' . $dir);
        $files = array_merge($files, scandir($folders['UploadsDir']['basedir'] . '/abundatrade/' . $dir));
        $ret = array();
        foreach ($files as $file) {
            $pos = strpos($file, $ext);
            if ($pos !== false) {
                if ($remove_ext) {
                    $ret[] = substr($file, $start, $pos);
                }
                else {
                    $ret[] = $file;
                }
            }
        }
        
        return $ret;
    }
}
