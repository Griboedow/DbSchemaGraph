<?php

#Catch invalid access
if (!defined('MEDIAWIKI')) {
    echo <<<EOT
This file is no valid access point to MediaWiki. Install this Extension by placing
require_once( "\$IP/extensions/DbSchemaGraph/DbSchemaGraph.php" );
in LocalSettings.php
EOT;
    exit(1);
}

#Register extension
$wgExtensionCredits[defined( 'SEMANTIC_EXTENSION_TYPE' ) ? 'semantic' : 'specialpage'][] = array(
    'path' => __FILE__,
    'name' => 'DB schema graph',
    'author' => '[https://medium.com/@urlfberht Nikolai Kochkin]',
    'description' => 'DB schema graph browse tools. Based on the idea of Semantic MediaWiki Graph',
    'version'  => '0.5 beta',
    'url' => "https://medium.com/@urlfberht",
);

#Init special pages
$wgMessagesDirs['DbSchemaGraph'] = __DIR__ . '/i18n';

// Register hooks
// See also http://www.mediawiki.org/wiki/Manual:Hooks
$wgAutoloadClasses['DbSchemaGraphTag'] = __DIR__ . '/DbSchemaGraphTag.hooks.php';
$wgHooks['ParserFirstCallInit'][] = 'DbSchemaGraphTag::onParserSetup';


$wgResourceModules['ext.DbSchemaGraphTag.init'] = array(
  'scripts' => array(
    'includes/js/app.js',
    'includes/js/d3.v5.min.js',
    'includes/js/utility.js',
  ),
  'dependency' => array(
    'includes/js/select2.full.min.js',
    'mediawiki.util',
    'includes/js/jquery.ba-throttle-debounce.js',
  ),
  'styles' => array(
    'includes/css/select2.css',
    'includes/css/screen.css',
  ),
  'localBasePath' => dirname( __FILE__ ),
        'remoteExtPath' => 'DbSchemaGraph',
);

$wgResourceModules['ext.DbSchemaGraph.init'] = array(
  'scripts' => array(
    'includes/js/app.js',
    'includes/js/d3.v5.min.js',
    'includes/js/utility.js',
  ),
  'dependency' => array(
    'includes/js/select2.full.min.js',
    'mediawiki.util',
    'includes/js/jquery.ba-throttle-debounce.js',
  ),
  'styles' => array(
    'includes/css/select2.css',
    'includes/css/screen.css',
  ),
  'localBasePath' => dirname( __FILE__ ),
	'remoteExtPath' => 'DbSchemaGraph',
);

