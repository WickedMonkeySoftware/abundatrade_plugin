<?php
/**
 * Displays an about page
 * @author Robert Landers (landers.robert@gmail.com)
 * @package abundatrade
 * @version 1.0
 */

//do not allow hijackers
if (!defined("WP_CONTENT_DIR")) exit();

/**
 * This class handles display of all options
 */
class tabs__about_withinboredom
{
	function __construct() {
        
    }
    
    // display admin stuff ...
    function settings() {
        $settings = skel__settings::Settings();
        
        ?>
        <h2>What is <font color="green"> Abundatrade.com?</font></h2>
        <p>AbundaTrade.com is a privately owned company based in Mount Pleasant, South Carolina,
			ten miles from historic downtown Charleston. Launched in September 2008, AbundaTrade evolved
			from the CD trade-in program of the independent music retailer, Millennium Music. We now
			accept a wide variety of new and used music, movies, video games, and books in exchange for
			cash, gift cards, or select consumer products. There is also the option to donate your
			trade-in value to a favorite charity.</p>

			<p>In 2010 we expanded AbundaTrade's facilities, nearly doubling the space available to
			handle the thousands of items we receive, process, and ship each day. This enables us to
			offer our customers an even greater selection of movies, music, video games, books, and
			specialty items.</p>

			<p>As we continue to grow, we have developed fundraising and business partnerships in our
			local community, and beyond, with the Charleston Symphony Orchestra, Friends of the
			Charleston County Public Library, the Piccolo Spoleto Festival, Tanger Outlets, as well as
			various school, churches, and community groups.</p>

			<p>We are proud that AbundaTrade is part of the emerging reCommerce industry. By focusing
			our efforts on trading and selling used items, we offer an alternative shopping experience
			that is less expensive for our customers and less harmful for our environment. As of the
			end of 2009, we have repaired and re-circulated over 100 tons of CDs and DVDs. Please read
			Our Vision for more information about our company philosophy and goals.</p>
            
        <h2>Where does <font color="green">Abundatrade.com</font> come from</h2>
        
        <p>AbundaTrade is the modernization and revitalization of Millennium Music, a once
			stubbornly successful independent music retailer. The AbundaTrade.com, FeedYourPlayer.com,
			and Millennium Music concepts are all based out of Charleston, South Carolina.</p>

			<p>Some 20 years ago, near the dawn of compact disc technology, a music retailer known
			as CD Superstore was sold to Borders Books. Millennium Music was spawned from the CD
			Superstore crew. Within a few years, Millennium Music became one of the premier
			names in the South for buying the hottest new music and enjoying in-store concerts and
			artist autograph sessions.</p>

			<p>While progressively upgrading to larger stores and multiple franchises, Millennium Music
			maintained its indie-minded commitment to musicians and their fans. For 11 consecutive
			years (1998-2008) Millennium Music was chosen as Charleston City Paper's "Best Place to
			Buy New CDs," based on their annual readers' poll. On several occasions during their
			reign, Millennium Music also received honors for "Best Place to Buy Used CDs" and "Best
			CD Store Staff." A staple of the local cultural scene, the Millennium Music flagship
			store was located within 14,000 square feet of prime retail space in the heart of
			historic downtown Charleston.</p>

			<p>Millennium Music successfully launched their initial CD trade-in program,
			FeedYourPlayer.com, in January 2006. As 21st Century music-buying trends continued to change
			the retail landscape, the company ultimately closed its brick-and-mortar retail stores to
			focus solely on the online venture. In September 2008, the name, AbundaTrade.com, was
			officially adopted, as a better reflection of the company's growing concept. To learn more
			about the trade-in process, please review our online tutorials or contact
			our <a href="mailto:trade@abundatrade.com">Trade Experience Manager</a>.</p>


        <?php
    }
}
