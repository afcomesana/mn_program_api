<?php
/**
 * Plugin Name: MN Program Psicopraxis
 * Plugin URI: https://adverthia.com
 * Description: Send data from contact forms to MN Program API.
 * Author: Adverthia
 * Author URI: https://www.adverthia.com/
 * Version: 1.0
 * Text Domain: mn_program_api
 *
 * Copyright: (c) 2020 Adverthia S.L.U. (afcomesana@adverthia.com)
 *
 * License: GNU General Public License v3.0
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @author    Adverthia
 * @copyright Copyright (c) 2020, Adverthia S.L.U.
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 */

defined('ABSPATH') or die;
/** ACTIVATION & DEACTIVATION */
function activate_mn_program() {
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'activate_mn_program');

function deactivate_mn_program() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'deactivate_mn_program');

/** ENQUEUE FILES */
function enqueue() {
    wp_enqueue_script('mnprogram_main', plugins_url('/js/main.js', __FILE__), array('jquery'));
    wp_localize_script('mnprogram_main', 'ajax_object', array(
        "ajaxurl" => admin_url('admin-ajax.php')
    ));
}

function add_type_attribute($tag, $handle, $src) {
    // if not your script, do nothing and return original $tag
    if ( 'mnprogram_main' !== $handle ) {
        return $tag;
    }
    // change the script tag by adding type="module" and return it.
    $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
    return $tag;
}

add_action('wp_enqueue_scripts', 'enqueue');
do_action('wp_enqueue_scripts');
add_filter('script_loader_tag', 'add_type_attribute', 10, 3);
