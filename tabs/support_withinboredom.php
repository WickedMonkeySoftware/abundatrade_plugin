<?php
/**
 * Displays a support information page
 * @author Robert Landers (landers.robert@gmail.com)
 * @package abundatrade
 * @version 1.0
 */

//do not allow hijackers
if (!defined("WP_CONTENT_DIR")) exit();

/**
 * This class handles display of all options
 */
class tabs__support_withinboredom
{
	function __construct() {
        
    }
    
    // display admin stuff ...
    function settings() {
        $settings = skel__settings::Settings();
        
        ?>
        <h2>Who Supports this plugin?</h2>
        <p>This plugin is supported by this guy who goes by <font color="green"> Withinboredom </font> on the web, and Robert Landers in real life. You are free to email him directly at landers.robert@gmail.com with urgent issues (or commission him to build a plugin of your own). Not all support can be given for free, and cost is at his discretion. So be nice!</p>
        <p>Feel free to check out his blog @ <a href="http://withinboredom.info">http://withinboredom.info</a>, and don't forget to <strong><em><a href="http://withinboredom.info/?product=donate" >Buy him a beer!</a></em></strong></p>
        <br/>
        <h2>Frequently asked Questions</h2>
        <h3>How do I use this thing?</h3>
        <p>Put anywhere you'd like to see the calculator this simple text: <pre>[abundatrade]</pre> and viola, you have a calculator ... but keep reading to see what else you need to do</p>
        <h3>How do I become an affiliate?</h3>
        <p> Please contact us @ <a href="mailto:trade@abundatrade.com">trade@abundatrade.com</a> asking for an affiliate ID and that'll get the conversation started.<p>
        <h3>What do I get for being an affiliate?</h3>
        <p>Well, you get a cut of whatever the user gets. So, say someone comes to your site and sells Abundatrade $100 bucks worth of cds and dvds, you get at the most, 25% of that, so 25 bucks for free ... not bad.</p>
        <h3>What are some reasons to be an affiliate?</h3>
        <p>Fundraisers, getting your own trade site up off the ground, some easy cash ... the reasons are endless, and hey, it just works.</p>
        <?php
    }
}