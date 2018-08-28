<?php

class DbSchemaGraphTag {
	public static function onParserSetup( Parser $parser ) {
		global $wgOut;
		$wgOut->addModules( 'ext.DbSchemaGraphTag.init' );
		$parser->setHook( 'DbSchemaFull', 'DbSchemaGraphTag::renderFullSchema' );
		return true;
	}

	// Render <sample>
	public static function renderFullSchema( $input, array $args, Parser $parser, PPFrame $frame ) {
		if(isset($args['rootpage'])){
			$rootPage = $args['rootpage'];
		}
		else{
			$rootPage = $input;
		}

		if(isset($args['rootcategory'])){
			$rootCategory = $args['rootcategory'];
		}

		if(isset($args['height'])){
			$height = $args['height'];
		}else{
			$height = '700px';
		}

		if ( isset($rootPage) ){
			$html = "
<div class='wrapper-db' id='cluster_chart'>
<div class='chart-db' id='chart_inner' style='height:$height' rootPage='$rootPage'></div>
</div>";
		}
		else{
			$html = "
<div class='wrapper-db' style='dispay:none'>
<section>
<article>
<form id='example1' action='javascript:alert('Validation Successful')'>
<div>
<label>DB category<span class='red-db'>*</span></label>
<select id='tableCategorySelector' class='select2-input' disabled placeholder='Loading categories...'><option value=''></option></select>
</div>
<div>
<input type='submit' id='visualiseSite' name='submit' value='Submit'/><span id='error_msg' style='display:none' class='red-db'>\tDB Category is missing</span>
</div>
</form>
</article>
</section>
</div>
<div class='wrapper-db' id='cluster_chart'>
<div class='chart-db' id='chart_inner' style='height:$height' rootCategory='$rootCategory'></div>
</div>";
		}
		return $html;
	}
}
