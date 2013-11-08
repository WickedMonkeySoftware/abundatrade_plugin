function get_price(prices, condition) {
    var price = new Number(0);

    prices.each(function (index, item) {
        if (item.condition == condition) {
            price = parseFloat(item.price);
        }
    });

    return price.toFixed(2);
}

jQuery.fn.sort = function () {
    return this.pushStack([].sort.apply(this, arguments), []);
};

function sortByTitle(a, b) {
    if (a.title == b.title) {
        return 0;
    }
    return a.title > b.title ? 1 : -1;
};

function sortByTitleDesc(a, b) {
    return sortByTitleDesc(a, b) * -1;
};

jQuery(document).ready(function () {

    // reference to the table object used on the PHP pages
    // make sure to get a reference to the last row available
    var table = jQuery("#hor-zebra > tbody:last");

    // holds all of our datas
    var products;

    // figure out what page we are on -
    // this determines what category we
    // will need to pull.

    var current_page = document.location.href;

    // current category is determined by what page
    // you are on
    var current_category;

    if (current_page.indexOf("abundagadgets-blackberry") > 0) {
        current_category = 6;
    }

    if (current_page.indexOf("abundagadgets-ipad") > 0) {
        current_category = 2;
    }

    if (current_page.indexOf("abundagadgets-iphone") > 0) {
        current_category = 1;
    }

    if (current_page.indexOf("abundagadgets-ipod-classic") > 0) {
        current_category = 3;
    }

    if (current_page.indexOf("abundagadgets-ipod-nano") > 0) {
        current_category = 5;
    }

    if (current_page.indexOf("abundagadgets-ipod-touch") > 0) {
        current_category = 4;
    }

    if (current_page.indexOf("abundagadgets-ipodtouch") > 0) {
        current_category = 4;
    }

    if (current_page.indexOf("abundagadgets-samsung") > 0) {
        current_category = 7;
    }

    if (current_page.indexOf("abundagadgets-kindle") > 0) {
        current_category = 8;
    }

    if (current_page.indexOf("abundagadgets-macbook") > 0) {
        current_category = 9;
    }

    if (current_page.indexOf("abundagadgets-gameconsoles") > 0) {
        current_category = 10;
    }


    // fetch the data for this category
    jQuery.getJSON('http://abundatrade.com/trade/process/ajax-post-public.php', { 'action': 'get', 'object': 'TradePermProductData', 'category_id': current_category }, function (data) {
        if (data.valid) {
            if (data.output.success) {

                products = data.output.data;
                sortedProducts = jQuery(products).sort(sortByTitle);

                jQuery.each(sortedProducts, function () {
                    // add a row to the table
                    var good = new Number(this.good_price);
                    var like_new = new Number(this.like_new_price);

                    table.append('<tr><td><a href="' + jQuery('a.button').get(0).href + '?ean=' + this.ean + '">' + this.title + '</a></td><td><a href="' + jQuery('a.button').get(0).href + '?ean=' + this.ean + '&gad_cond=1">$' + get_price(jQuery(this.prices), 'Like New') + '</a></td><td><a href="' + jQuery('a.button').get(0).href + '?ean=' + this.ean + '&gad_cond=0">$' + get_price(jQuery(this.prices), 'Good') + '</a></td></tr>');
                });

            }
        }
    });



});