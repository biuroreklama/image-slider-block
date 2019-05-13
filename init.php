<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function enqueue_block_fe() { // phpcs:ignore
	// Styles.
	wp_enqueue_style(
		'fe-block-style', // Handle.
		plugins_url( '/image-slider-block/dist/block.style.build.css', dirname( __FILE__ ) ),
		array( 'wp-editor' )
	);
}

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'enqueue_block_fe' );

function block_editor_assets() { // phpcs:ignore
	// Scripts.
	wp_enqueue_script(
		'editor-block-js', // Handle.
		plugins_url( '/image-slider-block/dist/block.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-api' ), // Dependencies, defined above.
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'block-editor-style', // Handle.
		plugins_url( '/image-slider-block/dist/block.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
	);
}

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'block_editor_assets' );
