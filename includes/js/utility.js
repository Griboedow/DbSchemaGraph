var nodeSet = [];
var linkSet = [];
var invisibleNode = [];
var invisibleEdge = [];
var invisibleType = [];
var done = [];
var doneCategories = [];
var force;

//Set your favourite colors
//Otherwise will use random colors
var color = [];
color['Other'] = '#13d1e3';

(function (mw, $) {
    loadUi();
}(mediaWiki, jQuery));

function loadUi() {
	mw.loader.using('mediawiki.util', function () {

		var rootCategoryForSelector = $("#chart_inner").attr('rootCategory');
		var pageToDisplay = $("#chart_inner").attr('rootPage');

		if (pageToDisplay) {
			//Page processing
			if (pageToDisplay) {
				drawAllPageRelatives(pageToDisplay);
				return;
			}
		}
		else {
			var promiseSelect2LibLoaded = new Promise((resolve, reject) => {
				loadScript('select2.full.min.js', resolve, reject);
			});

			promiseSelect2LibLoaded.then(() => {
				//Category processing
				if (rootCategoryForSelector) {
					loadAllWikiTableSubCategories(rootCategoryForSelector);
					//loadWikiArticles();
				} else {
					loadAllWikiTableSubCategories('Category:Categories(DB)');
				}

				$(function() {
					$('#visualiseSite').click(function() {
						if ($("#tableCategorySelector").val() === "") {
							//Error Message
							$('#error_msg').show();
						} else {
							$('#error_msg').hide();
							categoryName = $('#tableCategorySelector').val();
							drawAllSubCategoryArticles(categoryName);
						}
					});
				});
			});
		}

	});
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


function loadScript(name, resolve, reject) {
	$.when(
		$.getScript(wgScriptPath + '/extensions/DbSchemaGraph/includes/js/' + name)
	).done(() => {
		console.log(name + " loaded");
		resolve(true);
	});
}

function drawAllPageRelatives(pageName) {
	nodeSet = [];
	linkSet = [];
	done = [];
	doneCategories = [];
	var processingPromises = [];

	//forward processing
    var subPageName = pageName.substr(pageName.lastIndexOf('/') + 1);
	var forwardPageProcessedPromise = new Promise((resolveForward, rejectForward) => {
        processPage({ 'title': pageName }, 'Category:' + subPageName, resolveForward, rejectForward);
	});
	processingPromises.push(forwardPageProcessedPromise);

	//backward processing
	var backwardPageProcessedPromise = new Promise((resolveForward, rejectForward) => {
        processPageBackwards({ 'title': pageName }, resolveForward, rejectForward);
	});
	processingPromises.push(backwardPageProcessedPromise);
	//TODO

	//Draw all
	Promise.all(processingPromises).then(() => {
        $('#cluster_chart .chart-db').empty();
        console.log(nodeSet);
	    console.log(linkSet);
		drawCluster('Drawing1', '', nodeSet, linkSet, '#cluster_chart .chart-db');
	});
}

function drawAllSubCategoryArticles(categoryTitle){
	nodeSet = [];
	linkSet = [];
	done = [];
	doneCategories = [];

	var processingPromises = [];

	//Root category
	var rootCategoryProcessedPromise = new Promise((resolveRoot, rejectRoot) => {
		execDrawArticlesOfCategory(categoryTitle, resolveRoot, rejectRoot);
	});
	processingPromises.push(rootCategoryProcessedPromise);

	//SubCategories
	var categoriesLoadedPromise = new Promise((resolveSubCategories, rejectSubCategories) => {
		loadWikiTableSubCategories(categoryTitle, execDrawArticlesOfCategory, resolveSubCategories, rejectSubCategories);
	});
	processingPromises.push(categoriesLoadedPromise);

	Promise.all(processingPromises).then(() => {
		$('#cluster_chart .chart-db').empty();       
		drawCluster('Drawing1', '', nodeSet, linkSet, '#cluster_chart .chart-db'); 
	});

}

function execDrawArticlesOfCategory(categoryTitle, parentProcessingResolve, parentProcessingReject) {
	//to remove later
	if(doneCategories.includes(categoryTitle)){
		parentProcessingResolve(true);
	}

	doneCategories.push(categoryTitle);


	$.ajax({
		url: mw.util.wikiScript('api'),
		data: {
			action: 'query',
			list: 'categorymembers',
			cmnamespace: 3010,
			format: 'json',
			cmtitle: categoryTitle,
			cmlimit: 500,
		},
		type: 'GET',
		success: function (data) {
			//check valid response to api query
			if (data && data.edit && data.edit.result == 'Success') {
				debugger;
			} else {
				if (data && data.error) {
					alert(data);
					debugger;
				} else {
					var pagesProcessedPromises = [];

					data.query.categorymembers.forEach(function (wikiArticle, i, arr) {
						var aPromise = new Promise((resolveSub, rejectSub) => {
							processPage(wikiArticle, categoryTitle, resolveSub, rejectSub);
						});

						pagesProcessedPromises.push(aPromise);
					});

					Promise.all(pagesProcessedPromises).then(() => {
						parentProcessingResolve(true);
					});
				}
			}
		}
	});
}

function processPageBackwards(wikiArticle, resolve, reject) {
	//backward processing
    var subPageName = wikiArticle.title.split(':')[1];
    subPageName = subPageName.substr(subPageName.lastIndexOf('/') + 1);
	$.ajax({
		url: mw.util.wikiScript('api'),
		data: {
			action: 'query',
			list: 'backlinks',
			bltitle: wikiArticle.title,
			blnamespace: 3010,
			format: 'json'
		},
		type: 'GET',
		success: function (data) {
			//check valid response to api query
			if (data && data.edit && data.edit.result == 'Success') {
				debugger;
			} else {
				if (data && data.error) {
					alert(data);
					debugger;
				} else {
					//Add request to page itself to be able to get link name and other params
					var processingPromises = [];

					//Limited forward processing for our pages
					data.query.backlinks.forEach(function (backlink, i, arr) {
						var aPromise = new Promise((resolveSub, rejectSub) => {
                            processPage(backlink, 'Category:Links to the page', resolveSub, rejectSub, subPageName);
						});

						processingPromises.push(aPromise);
					});

					Promise.all(processingPromises).then(() => {
						resolve(true);
						return;
					});
				}
			}
		},
	});
}

function processPage(wikiArticle, categoryTitle, resolve, reject, processOnly = ''){
	// process node
	var nodeIfExists = nodeSet.find(obj => { return obj.idt === wikiArticle.title });
	
	if (!nodeIfExists) {
		// Pages with processOnly param will be added later. 
		// We need to check links exist before add them
        if (!processOnly) {
			drawArticleNode(wikiArticle, categoryTitle);
		}
	} else {
		//add new category if category exists
		var indexToWrite = nodeIfExists.type.indexOf('Other');
		if (indexToWrite !== -1) {
			nodeIfExists.type[indexToWrite] = categoryTitle;
		}
		else {
			nodeIfExists.type.push(categoryTitle);
		}
	}
	
	//process links (forward processing)
	$.ajax({
		url: mw.util.wikiScript('api'),
		data: {
			action: 'browsebysubject',
			subject: wikiArticle.title,
			ns: 3010,
			format: 'json'
		},
		type: 'GET',
		success: function (data) {
			//check valid response to api query
			if (data && data.edit && data.edit.result == 'Success') {
				debugger;
			} else {
				if (data && data.error) {
					alert(data);
					debugger;
				} else {
                    if (data.query.sobj) {

                        var backwardLinksWereAdded = false;

						for (var i = 0; i < data.query.sobj.length; i++) {

							var item = data.query.sobj[i];

							if (item.subject.split('#')[3] === 'link') {
								var targetPageName = item.data.find(obj => { return obj.property === 'LinkTarget' }).dataitem[0].item.split('#')[0];
                                targetPageName = targetPageName.substr(targetPageName.lastIndexOf('/') + 1);

								var newNode = {
									idt: targetPageName,
									name: targetPageName,
									type: ['Other'], // Will be replaced later if needed
									hlink: './Table:' + item.data.find(obj => { return obj.property === 'LinkTarget' }).dataitem[0].item.split('#')[0],
								};

                                var sourceIdt = data.query.subject.split("#")[0];
							    sourceIdt = sourceIdt.substr(sourceIdt.lastIndexOf('/') + 1);

								var newLink = {
                                    sourceIdt: sourceIdt,
									linkName: item.data.find(obj => { return obj.property === 'LinkSourceColumn' }).dataitem[0].item.split('#')[0],
									targetIdt: targetPageName,
								};

								//Some pages should add only links to one page
								if ( !processOnly ) {
									//Add node
									if (!nodeSet.find(obj => { return obj.idt === targetPageName })) {
										nodeSet.push(newNode);
									}
									//Add link
									linkSet.push(newLink);
								}

                                if (processOnly === targetPageName) {
                                    backwardLinksWereAdded = true;
									//Add link
									linkSet.push(newLink);
								}
							}
                        }

                        //Add page node
                        var nodeIfExists = nodeSet.find(obj => { return obj.idt === wikiArticle.title });
                        if (!nodeIfExists && backwardLinksWereAdded) {
                            drawArticleNode(wikiArticle, categoryTitle);
                        }
					}
				}
				resolve(true);
				return;
			}
		},
	});
}

function drawArticleNode(wikiArticle, category) {
    var pageId = wikiArticle.title;
    pageId = pageId.split(":")[1].replace(" ", "_");
    pageId = pageId.substr(pageId.lastIndexOf('/') + 1);
	done.push(pageId);
	nodeSet.push({
		idt: pageId.replace(' ', '_'),
		name: pageId.replace(' ', '_'),
		type: category.split(":")[1],
		hlink: "./" + wikiArticle.title.split("#")[0].replace(' ', '_'),
	});
}

function cloneEdge(array) {
	var newArr = [];
	array.forEach(function(item) {
		newArr.push({
			sourceId: item.sourceId,
			linkName: item.linkName,
			targetId: item.targetId
		});
	});

	return newArr;
}

function addCategoryToList(categoryName, resolve, reject){
	$('#tableCategorySelector').append('<option value="' + categoryName + '">' + categoryName.split(':')[1] + "</option>");
	resolve(true);
}

function loadAllWikiTableSubCategories(rootCategory){

	var categoriesLoadedPromise = new Promise((resolve, reject) => {
		loadWikiTableSubCategories(rootCategory, addCategoryToList, resolve, reject);
	});
								
	categoriesLoadedPromise.then(() =>{
		$("#tableCategorySelector").select2({
			placeholder: "Select a Database Category",
			allowClear: true,
		disabled: false,
		});
	})
}


function loadWikiTableSubCategories(categoryName, callbackFunction, parentResolve, parentReject) {
	$.ajax({
		url: mw.util.wikiScript('api'),
		data: {
			action: 'query',
			list: 'categorymembers',
			format: 'json',
			cmlimit: 500,
			cmtitle: categoryName,
			cmtype: 'subcat',
		},
		type: 'GET',
		success: function(data) {
			if (data && data.edit && data.edit.result == 'Success') {

			} else {
				if (data && data.error) {
				}
				else {
					var pagesProcessedPromises = [];

					var dataArray = data.query.categorymembers;

					for (var i = 0; i < dataArray.length; i++) {
						if (dataArray[i].title.indexOf("DB)") != -1) {
							var categoryProcessedPromise = new Promise((resolveProcessing, rejectProcessing) => {
								callbackFunction(dataArray[i].title, resolveProcessing, rejectProcessing);
							})
							pagesProcessedPromises.push(categoryProcessedPromise);

							var aPromise = new Promise((resolveSub, rejectSub) => {
								loadWikiTableSubCategories(dataArray[i].title, callbackFunction, resolveSub, rejectSub);
							});
							pagesProcessedPromises.push(aPromise);
						}
					}

					Promise.all(pagesProcessedPromises).then(() => {
						parentResolve(true);
					});
				}
			}
		}
	});
}

function hashCode(str) { // java String#hashCode
	var hash = 0;
	for (var i = 0; i < str.length; i++) {
	   hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return hash;
} 

function intToRGB(i){
	var c = (i & 0x00FFFFFF)
		.toString(16)
		.toUpperCase();

	return "00000".substring(0, 6 - c.length) + c;
}

function colorScaleMW(type) {
	if(color[type]){
		return color[type];
	}
	return intToRGB(hashCode(type));//'#1f77b4'; //return color[type];
}