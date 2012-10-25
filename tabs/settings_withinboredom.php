<?php
/**
 * Displays a settings page
 * @author Robert Landers (landers.robert@gmail.com)
 * @package abundatrade
 * @version 1.0
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
        
        <H1> BETA -- Do not use on a production site </H1>
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
                    'id'    => 'thankyou_page',
                    'value' => $settings->thankyou_page
                )
            ));
        ?>
        </div>
        </div>
        <input type="submit" class="button-primary" value="Save Changes" />
        </form>
        <?php
    }
}
