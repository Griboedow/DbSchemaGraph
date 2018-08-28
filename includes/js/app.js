function drawCluster(drawingName, focalNode, nodeSetApp, linkSetApp, selectString) {

    var i;
    for (i = 0; i < nodeSetApp.length; i++) {
        nodeSetApp[i].id = i;
    }

    for (i = 0; i < linkSetApp.length; i++) {
        linkSetApp[i]["index"] = i;
        linkSetApp[i]["source"] = nodeSetApp.find(obj => { return obj.idt === linkSetApp[i]["sourceIdt"] }).id;
        linkSetApp[i]["target"] = nodeSetApp.find(obj => { return obj.idt === linkSetApp[i]["targetIdt"] }).id;
    }

    //For multiple links between same nodes
    var linkIndex = [];

    //Draw link to the same table with such params
    var sameTablePathStep = { 'x': 50, 'y': 20 };

    var width = $(".chart-db")[0].clientWidth;
    var height = $(".chart-db")[0].clientHeight;
    var colorHash = [];

    var scale = 1;
    var movedPos = { 'x': 0, 'y': 0 };

    var clickLegend = function () {
        /*We can do somthing here*/
    };

    var typeMouseOver = function () {

        var thisObject = d3.select(this);
        var typeValue = thisObject.attr("type_value");
        var strippedTypeValue = typeValue.replace(/ /g, "_");
        strippedTypeValue = strippedTypeValue.replace(/[\(\)]/g, "_");

        var legendBulletSelector = "." + "legendBullet-" + strippedTypeValue;
        var selectedBullet = d3.selectAll(legendBulletSelector);

        //document.writeln(legendBulletSelector);
        selectedBullet.style("fill", "Maroon");
        selectedBullet.attr("r", 1.2 * 6);

        var legendTextSelector = "." + "legendText-" + strippedTypeValue;
        var selectedLegendText = d3.selectAll(legendTextSelector);
        //document.writeln(legendBulletSelector);
        selectedLegendText.style("font", "bold 14px Arial");
        selectedLegendText.style("fill", "Maroon");

        var nodeRectangleSelector = "." + "nodeRectangle-" + strippedTypeValue;
        var selectedRectangle = d3.selectAll(nodeRectangleSelector);
        //document.writeln(nodeRectangleSelector);
        selectedRectangle.style("fill", "Maroon");
        selectedRectangle.style("stroke", "Maroon");

        var nodeTextSelector = "." + "nodeText-" + strippedTypeValue;
        var selectedNodeText = d3.selectAll(nodeTextSelector);
        //document.writeln(pie3SliceSelector);
        selectedNodeText.style("font", "bold 14px Arial");
        selectedNodeText.style("fill", "White");
    };

    var typeMouseOut = function () {

        var thisObject = d3.select(this);
        var typeValue = thisObject.attr("type_value");
        var colorValue = thisObject.attr("color_value");
        var strippedTypeValue = typeValue.replace(/ /g, "_");
        strippedTypeValue = strippedTypeValue.replace(/[\(\)]/g, "_");

        var legendBulletSelector = "." + "legendBullet-" + strippedTypeValue;
        var selectedBullet = d3.selectAll(legendBulletSelector);
        selectedBullet.style("fill", colorValue);


        var legendTextSelector = "." + "legendText-" + strippedTypeValue;
        var selectedLegendText = d3.selectAll(legendTextSelector);
        selectedLegendText.style("font", "normal 14px Arial");
        selectedLegendText.style("fill", "Black");

        var nodeTextSelector = "." + "nodeText-" + strippedTypeValue;
        var selectedNodeText = d3.selectAll(nodeTextSelector);
        selectedNodeText.style("font", "normal 14px Arial");
        selectedNodeText.style("fill", "Blue");

        var nodeRectangleSelector = "." + "nodeRectangle-" + strippedTypeValue;
        var selectedRectangle = d3.selectAll(nodeRectangleSelector);
        selectedRectangle.style("fill", "White");
        selectedRectangle.style("stroke", colorValue);
    };


    var mouseClickNode = function () {

    }

    var mouseClickNodeText = function () {
        var thisObject = d3.select(this);
        var win = window.open(thisObject.node().__data__.hlink);
    }


    var nodeMouseOver = function () {

        var thisObject = d3.select(this);
        var typeValue = thisObject.attr("type_value");
        var strippedTypeValue = typeValue.replace(/ /g, "_");
        strippedTypeValue = strippedTypeValue.replace(/[\(\)]/g, "_");

        d3.select(this).select("text").transition()
            .duration(250)
            .style("font", "bold Arial")
            .attr("fill", "Blue");

        var legendBulletSelector = "." + "legendBullet-" + strippedTypeValue;
        var selectedBullet = d3.selectAll(legendBulletSelector);
        selectedBullet.style("fill", "Maroon");

        var legendTextSelector = "." + "legendText-" + strippedTypeValue;
        var selectedLegendText = d3.selectAll(legendTextSelector);
        selectedLegendText.style("font", "bold 16px Arial");
        selectedLegendText.style("fill", "Maroon");


        var selectedRectangle = d3.select("rect[id='rect" + d3.select(this).text() + "']");
        selectedRectangle.style("fill", "Maroon");
        selectedRectangle.style("stroke", "Maroon");

        var selectedNodeText = d3.select("text[id='text" + d3.select(this).text() + "']");
        selectedNodeText.style("font", "bold 14px Arial");
        selectedNodeText.style("fill", "White");

        var links = d3.selectAll("g[startNode='" + d3.select(this).text() + "']");
        links.selectAll("g > path")
            .style("stroke", "rgb(0, 0, 0)")
            .style("stroke-width", "3.5px");

        links.selectAll("text")
            .attr("fill", "Red")
            .style("font", "16px Arial Black");
    }

    var nodeMouseOut = function () {

        var thisObject = d3.select(this);
        var typeValue = thisObject.attr("type_value");
        var colorValue = thisObject.attr("color_value");
        var strippedTypeValue = typeValue.replace(/ /g, "_");
        strippedTypeValue = strippedTypeValue.replace(/[\(\)]/g, "_");


        d3.select(this).select("rect").transition()
            .duration(250);

        d3.select(this).select("text").transition()
            .duration(250)
            .style("font", "normal Arial")
            .attr("fill", "Blue");

        var legendBulletSelector = "." + "legendBullet-" + strippedTypeValue;
        var selectedBullet = d3.selectAll(legendBulletSelector);
        selectedBullet.style("fill", colorValue);

        var legendTextSelector = "." + "legendText-" + strippedTypeValue;
        var selectedLegendText = d3.selectAll(legendTextSelector);
        selectedLegendText.style("font", "normal 14px Arial");
        selectedLegendText.style("fill", "Black");

        var selectedRectangle = d3.select("rect[id='rect" + d3.select(this).text() + "']");
        selectedRectangle.style("fill", "White");
        selectedRectangle.style("stroke", colorValue);

        var selectedNodeText = d3.select("text[id='text" + d3.select(this).text() + "']");
        selectedNodeText.style("font", "normal 14px Arial")
        selectedNodeText.style("fill", "Blue");

        var links = d3.selectAll("g[startNode='" + d3.select(this).text() + "']");
        links.selectAll("g > path")
            .style("stroke", "rgb(204, 204, 204)")
            .style("stroke-width", "1.5px");

        links.selectAll("text")
            .attr("fill", "Black")
            .style("font", "12px Arial");
    }

    // Create a hash that maps colors to types...
    nodeSetApp.forEach(function (d, i) {
        colorHash[d.type] = d.type;
        //document.writeln(color_hash[d.type]);
    });

    function keys(obj) {
        var keys = [];

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    }

    var sortedKeys = keys(colorHash).sort();

    sortedKeys.forEach(function (d, i) {
        colorHash[d] = colorScaleMW(d);
        //document.writeln(color_hash[d]);
    });

    // Add colors to original node records...
    nodeSetApp.forEach(function (d, i) {
        d.color = colorHash[d.type];
        //document.writeln(d.type);
    });


    function zoomed() {
        svgCanvas.attr("transform", d3.event.transform);
        scale = d3.zoomTransform(this).k;
        movedPos = { 'x': d3.zoomTransform(this).x, 'y': d3.zoomTransform(this).y };
        render();
    }

    // Create a canvas...
    var svgCanvas = d3.select(selectString)
        .append("svg:svg")
        .call(d3.zoom()
            .scaleExtent([1 / 2, 8])
            .on("zoom", zoomed)
        )
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svgCanvas")
        .append("svg:g")
        .attr("class", "focalNodeCanvas");

    var nodeHash = [];
    var typeHash = [];

    // Create a hash that allows access to each node by its id
    nodeSetApp.forEach(function (d, i) {
        nodeHash[d.idt] = d;
        typeHash[d.type] = d.type;
    });

    // Append the source object node and the target object node to each link records...
    linkSetApp.forEach(function (d, i) {
        d.source_t = nodeHash[d.sourceIdt];
        d.target_t = nodeHash[d.targetIdt];
        d.direction = "OUT"; //always out
    });

    var lineFunction = d3.line()
        .x(function (d) { return d.x; })
        .y(function (d) { return d.y; });
    //	  .interpolate(pathApproxType);


    function getRectSize(rectId) {
        var rect = document.getElementById('rect' + rectId);
        var hh = rect ? rect.getAttribute("height") / 2 : 0;
        var wh = rect ? rect.getAttribute("width") / 2 : 0;
        hh = isNaN(hh) ? 0 : hh;
        wh = isNaN(wh) ? 0 : wh;

        return { 'wh': wh, 'hh': hh }
    }


    function getLinkIndex(sourceId, targetId, linkName) {
        //Forward
        if (!linkIndex[sourceId]) {
            linkIndex[sourceId] = [];
        }
        if (!linkIndex[sourceId][targetId]) {
            linkIndex[sourceId][targetId] = [];
        }
        if (linkIndex[sourceId][targetId].indexOf(linkName) === -1) {
            linkIndex[sourceId][targetId].push(linkName);
        }
        //reverse
        if (!linkIndex[targetId]) {
            linkIndex[targetId] = [];
        }
        if (!linkIndex[targetId][sourceId]) {
            linkIndex[targetId][sourceId] = [];
        }
        if (linkIndex[targetId][sourceId].indexOf(linkName) === -1) {
            linkIndex[targetId][sourceId].push(linkName);
        }

        return linkIndex[sourceId][targetId].indexOf(linkName);
    }

    // Print Legend 
    var legendBlock = d3.select(selectString).select("svg").append("g").attr("class", "LegendBlock");

    //Legend title
    legendBlock
        .append("text").attr("class", "region")
        .text("Legend")
        .attr("x", 15)
        .attr("y", 25)
        .style("fill", "Black")
        .style("font", "bold 16px Arial")
        .attr("text-anchor", "start");

    // Plot the bullet circles...
    legendBlock.selectAll("g")
        .data(sortedKeys)
        .enter().append("svg:circle") // Append circle elements
        .attr("cx", 20)
        .attr("cy", function (d, i) {
            return (45 + (i * 20));
        })
        .attr("stroke-width", ".5")
        .style("fill", function (d, i) {
            return colorHash[d];
        })
        .attr("r", 6)
        .attr("color_value", function (d, i) {
            return colorHash[d];
        })
        .attr("type_value", function (d, i) {
            return d;
        })
        .attr("index_value", function (d, i) {
            return "index-" + i;
        })
        .attr("class", function (d) {
            var str = d;
            var strippedString = str.replace(/ /g, "_");
            strippedString = strippedString.replace(/[\(\)]/g, "_");
            return "legendBullet legendBullet" + "-" + strippedString;
        })
        .on('mouseover', typeMouseOver)
        .on('mouseout', typeMouseOut)
        .on('click', clickLegend);

    // Create legend text that acts as label keys...
    legendBlock.selectAll("a.legend_link")
        .data(sortedKeys) // Instruct to bind dataSet to text elements
        .enter().append("svg:a") // Append legend elements
        .append("text")
        .attr("text-anchor", "center")
        .attr("x", 40)
        .attr("y", function (d, i) {
            return (45 + (i * 20));
        })
        .attr("dx", 0)
        .attr("dy", "4px") // Controls padding to place text in alignment with bullets
        .text(function (d) {
            return d;
        })
        .attr("color_value", function (d) {
            return colorHash[d];
        })
        .attr("type_value", function (d) {
            return d;
        })
        .attr("index_value", function (d, i) {
            return "index-" + i;
        })
        .attr("class", function (d) {
            var str = d;
            var strippedString = str.replace(/ /g, "_")
            strippedString = strippedString.replace(/[\(\)]/g, "_");

            return "legendText-" + strippedString;
        })
        .style("fill", "Black")
        .style("font", "normal 14px Arial")
        .on('mouseover', typeMouseOver)
        .on("mouseout", typeMouseOut);

    // Draw lines for Links between Nodes
    var link = svgCanvas.selectAll(".gLink")
        .data(linkSetApp)
        .enter().append("g")
        //.attr("class", "gLink")
        .attr("class", "gLink")
        .attr("endNode", function (d) {
            return d.targetIdt;
        })
        .attr("startNode", function (d) {
            return d.sourceIdt;
        })
        .attr("linkIndex", function (d) {
            return getLinkIndex(d.sourceIdt, d.targetIdt, d.linkName);
        })
        .append("path")
        .style("stroke", "#ccc")
        .style("fill", "none")
        .style("stroke-width", "1.5px")
        .attr("marker-end", function (d, i) {
            return "url(#arrow_" + i + ")";
        });

    //drag finctions
    function dragstarted(d) {
        d3.select(this).raise().classed("active", true);
    }

    function dragged(d) {
        d.x = d3.event.x;
        d.y = d3.event.y;
        simulation.restart();
    }

    function dragended(d) {
        d3.select(this).classed("active", false);
    }

    // Create Nodes
    var node = svgCanvas.selectAll(".node")
        .data(nodeSetApp)
        .enter().append("g")
        .attr("class", "node")
        .attr("id", function (d) {
            return d.idt;
        })
        .attr("type_value", function (d, i) {
            if (d.type.constructor === Array) {
                return d.type.join(';');
            }
            else {
                return d.type;
            }
        })
        .attr("color_value", function (d, i) {
            return colorHash[d.type];
        })
        .attr("xlink:href", function (d) {
            return d.hlink;
        })
        .on("mouseover", nodeMouseOver)
        .on("click", mouseClickNode)
        .on("mouseout", nodeMouseOut)
        .append("a");

    node
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

    // Append Rectangles to Nodes
    //Rectangle to rect replaced
    node.append("rect")
        .attr("width", 100)
        .attr("height", 40)
        .style("fill", "White") // Make the nodes hollow looking
        //.style("fill", "transparent")
        .attr("type_value", function (d, i) {
            if (d.type.constructor === Array) {
                return d.type[0];
            }
            else {
                return d.type;
            }
        })
        .attr("color_value", function (d, i) {
            return colorHash[d.type];
        })
        .attr("id", function (d) {
            return "rect" + d.idt;
        })
        .attr("class", function (d, i) {
            var str = '';
            if (d.type.constructor === Array) {
                str = d.type[0];
            }
            else {
                str = d.type;
            }
            var strippedString = str.replace(/ /g, "_")
            strippedString = strippedString.replace(/[\(\)]/g, "_");
            return "nodeRectangle-" + strippedString;
        })
        .style("stroke-width", 5) // Give the node strokes some thickness
        .style("stroke", function (d, i) {
            return colorHash[d.type];
        });
    /*
     // Node stroke colors
*/
    // Append text to Nodes
    node.append("text")
        .attr("x", function (d) {
            return 0;
        })
        .attr("y", function (d) {
            return 0;
        })
        .attr("text-anchor", function (d) {
            return "middle";
        })
        .on("click", mouseClickNodeText)
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .style("font", "normal 14px Arial")
        .attr("fill", "Blue")
        .style("fill", function (d, i) {
            return colorHash[d];
        })
        .attr("type_value", function (d, i) {
            if (d.type.constructor === Array) {
                return d.type[0];
            }
            else {
                return d.type;
            }
        })
        .attr("color_value", function (d, i) {
            return colorHash[d.type];
        })
        .attr("class", function (d, i) {
            var str;
            if (d.type.constructor === Array) {
                str = d.type[0];
            }
            else {
                str = d.type;
            }
            var strippedString = str.replace(/ /g, "_");
            strippedString = strippedString.replace(/[\(\)]/g, "_");

            return "nodeText-" + strippedString;

        })
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name;
        })
        .attr("id", function (d) {
            return 'text' + d.idt;
        });

    //Fix rectangle size after text added
    svgCanvas.selectAll('rect')
        .attr('width', function (d) {
            d.width = document.getElementById('text' + d.idt).getBBox().width + 30;
            return d.width;
        })
        .attr('height', function (d) {
            d.height = 40;
            return d.height;
        })
        .attr("x", function (d) {
            return - (document.getElementById('text' + d.idt).getBBox().width + 30) / 2;
        })
        .attr("y", function (d) {
            return - 20;
        });


    var simulation = d3.forceSimulation()
        .nodes(nodeSetApp);

    simulation
        .force("charge", d3.forceManyBody().strength(-600))
        .force("linkForce", d3.forceLink(linkSetApp).distance(400).strength(0.5))
        .force("collide", d3.forceCollide().radius(function (d) {
            return d.width / 2;
        }).iterations(2))
        //.force("center", d3.forceCenter([width/2, height/2]))
        .on('tick', tick);

    // Append text to Link edges
    //TODO: fix positions
    var linkText = svgCanvas.selectAll(".gLink")
        .data(linkSetApp)
        .append("text")
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "Black")
        .style("font", "normal 12px Arial")
        .attr("dy", ".35em")
        .text(function (d) {
            return d.linkName;
        });


    //Build the Arrows
    svgCanvas.selectAll(".gLink").append("marker")
        .attr("id", function (d, i) {
            //  debugger;
            return "arrow_" + i;
        })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", function (d, i) {
            return 10;
        })
        .attr("refY", 0)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    function tick() {
        render();
    }

    function render() {

        //TODO: Add rect Collide
        link
            .attr("x1", function (d) {
                return d.source_t.x;
            })
            .attr("y1", function (d) {
                return d.source_t.y;
            })
            .attr("x2", function (d) {
                return d.target_t.x;
            })
            .attr("y2", function (d) {
                return d.target_t.y;
            })
            .attr("d", function (d) {

                var pathPoints = [
                    { "x": parseInt(d.source_t.x), "y": parseInt(d.source_t.y) },
                    { "x": parseInt(d.target_t.x), "y": parseInt(d.target_t.y) }
                ];
                var rectParams = getRectSize(d.sourceIdt);
                var wh = rectParams.wh;
                var hh = rectParams.hh;

                var i = linkIndex[d.sourceIdt][d.targetIdt].indexOf(d.linkName) + 1;

                if (d.sourceIdt === d.targetIdt) {
                    var startX = pathPoints[0].x + wh / (i + 0.1);
                    var endY = pathPoints[0].y + hh / (i + 0.1);
                    pathPoints = [
                        { 'x': startX, 'y': pathPoints[0].y + hh },
                        { 'x': startX, 'y': pathPoints[0].y + hh + i * sameTablePathStep.y },
                        { 'x': pathPoints[0].x + wh + i * sameTablePathStep.x, 'y': pathPoints[0].y + hh + i * sameTablePathStep.y },
                        { 'x': pathPoints[0].x + wh + i * sameTablePathStep.x, 'y': endY },
                        { 'x': pathPoints[0].x + wh, 'y': endY }
                    ];
                    //to replace to always linear
                    return lineFunction(pathPoints);
                }
                else {
                    var rectParamsTarget = getRectSize(d.targetIdt);
                    var wht = rectParamsTarget.wh;
                    var hht = rectParamsTarget.hh;

                    var dxR = ((pathPoints[0].x - wh) - (pathPoints[1].x + wht));
                    var dxL = ((pathPoints[1].x - wht) - (pathPoints[0].x + wh));

                    var dyT = ((pathPoints[1].y - hht) - (pathPoints[0].y + hh));
                    var dyB = ((pathPoints[0].y - hh) - (pathPoints[1].y + hht));

                    if ((dxR > 0) && (dxR > dxL)) {
                        if ((dxR > dyB) && (dxR > dyT)) {
                            //link move from center to border
                            pathPoints[0].x = pathPoints[0].x - wh;
                            pathPoints[1].x = pathPoints[1].x + wht;

                            //Adjust link position for multiple links
                            pathPoints[0].y = pathPoints[0].y + (i - 1.5) * hh / i;
                            pathPoints[1].y = pathPoints[1].y + (i - 1.5) * hht / i;
                        }
                        else {
                            if (dyB > dyT) {
                                //link move from center to border
                                pathPoints[0].y = pathPoints[0].y - hh;
                                pathPoints[1].y = pathPoints[1].y + hht;

                                //Adjust link position for multiple links
                                pathPoints[0].x = pathPoints[0].x + (i - 1.5) * wh / i;
                                pathPoints[1].x = pathPoints[1].x + (i - 1.5) * wht / i;
                            }
                            else {
                                //link move from center to border
                                pathPoints[0].y = pathPoints[0].y + hh;
                                pathPoints[1].y = pathPoints[1].y - hht;

                                //Adjust link position for multiple links
                                pathPoints[0].x = pathPoints[0].x + (i - 1.5) * wh / i;
                                pathPoints[1].x = pathPoints[1].x + (i - 1.5) * wht / i;
                            }
                        }
                    }
                    else {
                        if ((dxL > dyB) && (dxL > dyT)) {
                            //link move from center to border
                            pathPoints[0].x = pathPoints[0].x + wh;
                            pathPoints[1].x = pathPoints[1].x - wht;

                            //Adjust link position for multiple links
                            pathPoints[0].y = pathPoints[0].y + (i - 1.5) * hh / i;
                            pathPoints[1].y = pathPoints[1].y + (i - 1.5) * hht / i;
                        }
                        else {
                            if (dyB > dyT) {
                                //link move from center to border
                                pathPoints[0].y = pathPoints[0].y - hh;
                                pathPoints[1].y = pathPoints[1].y + hht;

                                //Adjust link position for multiple links
                                pathPoints[0].x = pathPoints[0].x + (i - 1.5) * wh / i;
                                pathPoints[1].x = pathPoints[1].x + (i - 1.5) * wht / i;
                            }
                            else {
                                //link move from center to border
                                pathPoints[0].y = pathPoints[0].y + hh;
                                pathPoints[1].y = pathPoints[1].y - hht;

                                //Adjust link position for multiple links
                                pathPoints[0].x = pathPoints[0].x + (i - 1.5) * wh / i;
                                pathPoints[1].x = pathPoints[1].x + (i - 1.5) * wht / i;
                            }
                        }
                    }

                    return lineFunction(pathPoints);
                }
            });

        function getTextWidth(text, fontSize, fontFace) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            context.font = fontSize + 'px ' + fontFace;
            return context.measureText(text).width;
        }

        node
            //add avoid overlapping
            //add legend collision
            .attr("x", function (d) {
                var s = 1 / scale;

                var legendBullets = d3.select(selectString).selectAll(".legendBullet");
                var numOfStrings = legendBullets.nodes().length;
                var biggestString = legendBullets.sort(function (a, b) {
                    return b.length - a.length;
                }).nodes()[0].getAttribute("type_value");

                var minStartX = s * (getTextWidth(biggestString, "16px", "Arial") + 80 - movedPos.x);
                var minStartY = s * (40 + 20 * numOfStrings - movedPos.y);

                var rectParams = getRectSize(d.idt);
                var wh = rectParams.wh;
                var hh = rectParams.hh;

                if ((d.y - hh) < minStartY && (d.x - wh) < minStartX) {
                    d.x = minStartX + wh;
                }

                return d.x = Math.max(0 + wh - s * movedPos.x, Math.min(s * ($(".chart-db")[0].clientWidth - movedPos.x) - wh, d.x));
            })
            .attr("y", function (d) {
                var s = 1 / scale;

                var legendBullets = d3.select(selectString).selectAll(".legendBullet");
                var numOfStrings = legendBullets.nodes().length;
                var biggestString = legendBullets.sort(function (a, b) {
                    return b.length - a.length;
                }).nodes()[0].getAttribute("type_value");

                var minStartX = s * (getTextWidth(biggestString, "16px", "Arial") - movedPos.x);
                var minStartY = s * (40 + 20 * numOfStrings - movedPos.y);

                var rectParams = getRectSize(d.idt);
                var wh = rectParams.wh;
                var hh = rectParams.hh;

                if ((d.y - hh) < minStartY && (d.x - wh) < minStartX) {
                    d.y = minStartY + hh;
                }

                return d.y = Math.max(0 + hh - s * movedPos.y, Math.min(s * ($(".chart-db")[0].clientHeight - movedPos.y) - hh, d.y));
            });

        link
            .attr("x1", function (d) {
                return d.source_t.x;
            })
            .attr("y1", function (d) {
                return d.source_t.y;
            })
            .attr("x2", function (d) {
                return d.target_t.x;
            })
            .attr("y2", function (d) {
                return d.target_t.y;
            })
            .attr("d", function (d) {
                var pathPoints = [
                    { "x": parseInt(d.source_t.x), "y": parseInt(d.source_t.y) },
                    { "x": parseInt(d.target_t.x), "y": parseInt(d.target_t.y) }
                ];

                var rectParams = getRectSize(d.sourceIdt);
                var wh = rectParams.wh;
                var hh = rectParams.hh;

                var i = linkIndex[d.sourceIdt][d.targetIdt].indexOf(d.linkName) + 1;

                if (d.sourceIdt === d.targetIdt) {
                    var startX = pathPoints[0].x + wh / (i + 0.1);
                    var endY = pathPoints[0].y + hh / (i + 0.1);
                    pathPoints = [
                        { 'x': startX, 'y': pathPoints[0].y + hh },
                        { 'x': startX, 'y': pathPoints[0].y + hh + i * sameTablePathStep.y },
                        { 'x': pathPoints[0].x + wh + i * sameTablePathStep.x, 'y': pathPoints[0].y + hh + i * sameTablePathStep.y },
                        { 'x': pathPoints[0].x + wh + i * sameTablePathStep.x, 'y': endY },
                        { 'x': pathPoints[0].x + wh, 'y': endY }
                    ];
                    //to replace to always linear
                    return lineFunction(pathPoints);
                }
                else {
                    //Modify start and stop points to the border of rect
                    var rectParamsTarget = getRectSize(d.targetIdt);
                    var wht = rectParamsTarget.wh;
                    var hht = rectParamsTarget.hh;

                    var dxR = ((pathPoints[0].x - wh) - (pathPoints[1].x + wht));
                    var dxL = ((pathPoints[1].x - wht) - (pathPoints[0].x + wh));

                    var dyT = ((pathPoints[1].y - hht) - (pathPoints[0].y + hh));
                    var dyB = ((pathPoints[0].y - hh) - (pathPoints[1].y + hht));


                    if ((dxR > 0) && (dxR > dxL)) {
                        if ((dxR > dyB) && (dxR > dyT)) {
                            //link move from center to border
                            pathPoints[0].x = pathPoints[0].x - wh;
                            pathPoints[1].x = pathPoints[1].x + wht;

                            //Adjust link position for multiple links
                            pathPoints[0].y = pathPoints[0].y + (i - 1.5) * hh / i;
                            pathPoints[1].y = pathPoints[1].y + (i - 1.5) * hht / i;
                        }
                        else {
                            if (dyB > dyT) {
                                //link move from center to border
                                pathPoints[0].y = pathPoints[0].y - hh;
                                pathPoints[1].y = pathPoints[1].y + hht;

                                //Adjust link position for multiple links
                                pathPoints[0].x = pathPoints[0].x + (i - 1.5) * wh / i;
                                pathPoints[1].x = pathPoints[1].x + (i - 1.5) * wht / i;
                            }
                            else {
                                //link move from center to border
                                pathPoints[0].y = pathPoints[0].y + hh;
                                pathPoints[1].y = pathPoints[1].y - hht;

                                //Adjust link position for multiple links
                                pathPoints[0].x = pathPoints[0].x + (i - 1.5) * wh / i;
                                pathPoints[1].x = pathPoints[1].x + (i - 1.5) * wht / i;
                            }
                        }
                    }
                    else {
                        if ((dxL > dyB) && (dxL > dyT)) {
                            //link move from center to border
                            pathPoints[0].x = pathPoints[0].x + wh;
                            pathPoints[1].x = pathPoints[1].x - wht;

                            //Adjust link position for multiple links
                            pathPoints[0].y = pathPoints[0].y + (i - 1.5) * hh / i;
                            pathPoints[1].y = pathPoints[1].y + (i - 1.5) * hht / i;
                        }
                        else {
                            if (dyB > dyT) {
                                //link move from center to border
                                pathPoints[0].y = pathPoints[0].y - hh;
                                pathPoints[1].y = pathPoints[1].y + hht;

                                //Adjust link position for multiple links
                                pathPoints[0].x = pathPoints[0].x + (i - 1.5) * wh / i;
                                pathPoints[1].x = pathPoints[1].x + (i - 1.5) * wht / i;
                            }
                            else {
                                //link move from center to border
                                pathPoints[0].y = pathPoints[0].y + hh;
                                pathPoints[1].y = pathPoints[1].y - hht;

                                //Adjust link position for multiple links
                                pathPoints[0].x = pathPoints[0].x + (i - 1.5) * wh / i;
                                pathPoints[1].x = pathPoints[1].x + (i - 1.5) * wht / i;
                            }
                        }
                    }

                    return lineFunction(pathPoints);
                }
            });

        node
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        linkText
            .attr("x", function (d) {

                var rectParams = getRectSize(d.sourceIdt);
                var wh = rectParams.wh;
                var hh = rectParams.hh;

                var i = linkIndex[d.sourceIdt][d.targetIdt].indexOf(d.linkName) + 1;

                if (d.sourceIdt === d.targetIdt) {
                    return d.source_t.x + wh / (i + 0.1);
                }
                else {
                    var rectParamsTarget = getRectSize(d.targetIdt);
                    var wht = rectParamsTarget.wh;
                    var hht = rectParamsTarget.hh;

                    var dxR = ((d.source_t.x - wh) - (d.target_t.x + wht));
                    var dxL = ((d.target_t.x - wht) - (d.source_t.x + wh));

                    var dyT = ((d.target_t.y - hht) - (d.source_t.y + hh));
                    var dyB = ((d.source_t.y - hh) - (d.target_t.y + hht));

                    var x1;
                    var x2;

                    if ((dxR > 0) && (dxR > dxL)) {
                        if ((dxR > dyB) && (dxR > dyT)) {
                            x1 = d.source_t.x - wh;
                            x2 = d.target_t.x + wht;
                        }
                        else {
                            if (dyB > dyT) {
                                x1 = d.source_t.x + (i - 1.5) * wh / i;
                                x2 = d.target_t.x + (i - 1.5) * wht / i;
                            }
                            else {
                                x1 = d.source_t.x + (i - 1.5) * wh / i;
                                x2 = d.target_t.x + (i - 1.5) * wht / i;
                            }
                        }
                    } else {
                        if ((dxL > dyB) && (dxL > dyT)) {

                            x1 = d.source_t.x + wh;
                            x2 = d.target_t.x - wht;
                        }
                        else {
                            if (dyB > dyT) {
                                x1 = d.source_t.x + (i - 1.5) * wh / i;
                                x2 = d.target_t.x + (i - 1.5) * wht / i;
                            }
                            else {
                                x1 = d.source_t.x + (i - 1.5) * wh / i;
                                x2 = d.target_t.x + (i - 1.5) * wht / i;
                            }
                        }
                    }
                    return (x2 + x1) / 2;
                }
            })
            .attr("y", function (d) {
                var rectParams = getRectSize(d.sourceIdt);
                var wh = rectParams.wh;
                var hh = rectParams.hh;

                var i = linkIndex[d.sourceIdt][d.targetIdt].indexOf(d.linkName) + 1;

                if (d.sourceIdt === d.targetIdt) {
                    return d.source_t.y + hh + i * sameTablePathStep.y;
                }
                else {
                    var rectParamsTarget = getRectSize(d.targetIdt);
                    var wht = rectParamsTarget.wh;
                    var hht = rectParamsTarget.hh;

                    var dxR = ((d.source_t.x - wh) - (d.target_t.x + wht));
                    var dxL = ((d.target_t.x - wht) - (d.source_t.x + wh));

                    var dyT = ((d.target_t.y - hht) - (d.source_t.y + hh));
                    var dyB = ((d.source_t.y - hh) - (d.target_t.y + hht));

                    var y1;
                    var y2;

                    //add dx_r dy_t logic
                    if ((dxR > 0) && (dxR > dxL)) {
                        if ((dxR > dyB) && (dxR > dyT)) {
                            y1 = d.source_t.y + (i - 1.5) * hh / i;
                            y2 = d.target_t.y + (i - 1.5) * hht / i;
                        }
                        else {
                            if (dyB > dyT) {
                                y1 = d.source_t.y - hh;
                                y2 = d.target_t.y + hht;
                            }
                            else {
                                y1 = d.source_t.y + hh;
                                y2 = d.target_t.y - hht;
                            }
                            //fix case top bottom
                            y2 = y2 + 40 * (i - 1);
                        }
                    } else {
                        if ((dxL > dyB) && (dxL > dyT)) {
                            y1 = d.source_t.y + (i - 1.5) * hh / i;
                            y2 = d.target_t.y + (i - 1.5) * hht / i;
                        }
                        else {
                            if (dyB > dyT) {
                                y1 = d.source_t.y - hh;
                                y2 = d.target_t.y + hht;
                            }
                            else {
                                y1 = d.source_t.y + hh;
                                y2 = d.target_t.y - hht;
                            }
                            //fix case top bottom
                            y2 = y2 + 40 * (i - 1);
                        }
                    }
                    return (y2 + y1) / 2;
                }
            });
    }

    function updateWindow() {
        width = $(".chart-db")[0].clientWidth - 60;
        height = $(".chart-db")[0].clientHeight - 60;

        svgCanvas.attr("width", width).attr("height", height);
        $('#svgCanvas').width(width + 90);
        $('#svgCanvas').height(height + 60);
    }

    d3.select(window).on('resize.updatesvg', updateWindow);

};
