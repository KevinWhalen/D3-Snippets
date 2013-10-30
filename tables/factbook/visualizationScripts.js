
//var newFullCopyInsteadOfReference = OrignalArray.slice(0);

/*
data = [{"country": "", "attributes": [{"name": "", "value": #, "date": ""}, {...}]}, {...}]
country
	attributes
		name
		value
		date

Attribute names:
	gdp == 'GDP (purchasing power parity)'
	population == 'Population'
	electricCapacity == 'Generating capacity (KW)'
	electricProduction == 'Annual production (KWH)'
	fossil == 'Percent from fossil fuels'
	nuclear == 'Percent from nuclear fuels'
	hydroelectric == 'Percent from hydroelectric plants'
	otherRenewable == 'Percent from other renewable sources'
*/

// A comparison function for the array of country with attributes, data objects
function compareFactbookData(a, b){
    if (a['country'] > b['country']) return 1;
    if (a['country'] < b['country']) return -1;
    return 0;
}

$(document).ready(function(){
//================================================================================
// Fill the selection display
    // Base filepath, folders, filenames...
    var path = "statistics1";
    var filename_data = path + "/" + "data.json";

    // Data
    var data = [];
    
    // Asynchronous data load
    d3.json(filename_data, function(error, file){
        data = file.sort(compareFactbookData).slice(0);

        // Fill selection boxes
        var gdp = 0, population = 0, electricCapacity = 0, electricProduction = 0, 
            fossil = 0, nuclear = 0, hydroelectric = 0, otherRenewable = 0;
        var countryList = [], attributeList = [];
        $.each(file, function(i, d){
            $('#countries').append('<option value="' + d['country'] + '">' + d['country'] + '</option>');
            countryList.push(d['country']);
            $.each(d, function(idx, ele){
                if (ele['name'] = "GDP (purchasing power parity)") gdp++;
                if (ele['name'] = "Population") population++;
                if (ele['name'] = "Generating capacity (KW)") electricCapacity++;
                if (ele['name'] = "Annual production (KWH)") electricProduction++;
                if (ele['name'] = "Percent from fossil fuels") fossil++;
                if (ele['name'] = "Percent from nuclear fuels") nuclear++;
                if (ele['name'] = "Percent from hydroelectric plants") hydroelectric++;
                if (ele['name'] = "Percent from other renewable sources") otherRenewable++;
            });
        });
        console.log(countryList.length);

        // Only include an option if the attribute exists in the set
        if (gdp > 0){
            $('#statistics').append('<option value="GDP (purchasing power parity)">' + "GDP (purchasing power parity)" + '</option>');
            attributeList.push("GDP (purchasing power parity)");
        }
        if (population > 0){
            $('#statistics').append('<option value="Population">' + "Population" + '</option>');
            attributeList.push("Population");
        }
        if (electricCapacity > 0){
            $('#electricity').append('<option value="Generating capacity (KW)">' + "Generating capacity (KW)" + '</option>');
            attributeList.push("Generating capacity (KW)");
        }
        if (electricProduction > 0){
            $('#electricity').append('<option value="Annual production (KWH)">' + "Annual production (KWH)" + '</option>');
            attributeList.push("Annual production (KWH)");
        }
        if (fossil > 0){
            $('#percentsElectricity').append('<option value="Percent from fossil fuels">' + "Percent from fossil fuels" + '</option>');
            attributeList.push("Percent from fossil fuels");
        }
        if (nuclear > 0){
            $('#percentsElectricity').append('<option value="Percent from nuclear fuels">' + "Percent from nuclear fuels" + '</option>');
            attributeList.push("Percent from nuclear fuels");
        }
        if (hydroelectric > 0){
            $('#percentsElectricity').append('<option value="Percent from hydroelectric plants">' + "Percent from hydroelectric plants" + '</option>');
            attributeList.push("Percent from hydroelectric plants");
        }
        if (otherRenewable > 0){
            $('#percentsElectricity').append('<option value="Percent from other renewable sources">' + "Percent from other renewable sources" + '</option>');
            attributeList.push("Percent from other renewable sources");
        }

        // Apply chosen.js to the select lists
        $('#countries').chosen({
            placeholder_text_multiple: "Choose some countries..."
        });
        $('.listBox').chosen({
            placeholder_text_multiple: "Select some options..."
        });
        $('div[id$="_chosen"]').css({"margin-bottom": "10px", "width": "90%"});

        // Event whenever an option is selected or deselected
        var selectedCountries = [], selectedAttributes = [];
        $('select').on('change', function(evt, params) {
            //console.log(evt);
            if (params['selected']){
                if ($.inArray(params['selected'], attributeList) >= 0 && 
                    $.inArray(params['selected'], selectedAttributes) < 0){
                    selectedAttributes.push(params['selected']);
                } else if ($.inArray(params['selected'], selectedCountries) < 0){
                    selectedCountries.push(params['selected']);
                }
            } else if (params['deselected']){
                selectedAttributes.splice(selectedAttributes.indexOf(params['deselected']), 1);
            }
            
            // --- height is undefined ---
//            if ($('#leftColumn').css('height') < $('#rightColumn').css('height')){
//                $('#leftColumn').css('height', $('#rightColumn').css('height'));
//            } else if ($('#rightColumn').css('height') < $('#leftColumn').css('height')){
//                $('#rightColumn').css('height', $('#leftColumn').css('height'));
//            }
        });

        // Change from selection to graphic
        $('#exploreButton').click(function(){ // Tried with and without form tags
            //console.log($('div[id$="_chosen"] option :selected').serializeArray());
            //console.log($(':input')).serializeArray());
            //console.log($(':selected').serializeArray());
            
            //console.log(selectedAttributes + " " + selectedCountries);
            if (selectedCountries.length > 0){
                $('#selectionDisplay').fadeToggle();
                $('#factbookInfographic').fadeToggle();
                //selectedCountries.concat(selectedAttributes)
                drawGraphic(data, selectedCountries, selectedAttributes);//, graphType);
            } else {
                alert("Must select at least one country.");
            }
        });
    });


//================================================================================
// Display the factbook information visualization/graphic
// Made from referencing http://bl.ocks.org/mbostock/3884955
    //(data, selection/*, graphType*/)
    function drawGraphic(data, selectedCountries, selectedAttributes/*, graphType*/){
//        var visContainer = d3.select('#factbookInfographic');
//        var svg = visContainer.selectAll('svg');

        var margin = {top: 20, right: 80, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.ordinal.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var color = d3.scale.category20();

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return x(d['country']); })
            .y(function(d) { return y(d['value']); });

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var countries = color.domain().map(function(name){
            return {
                name: name,
                values: data.map(function(d) {
                    return {country: d.country, attribute: +d[name]};
                })
            };
        });
//        = $.each(data, function(i, d){
//            if (selectedCountries.indexOf(d) >= 0){
//            }
//        });

        x.domain(selectedCountries);

        y.domain([
            d3.min(countries, function(c) { return d3.min(c['value'], function(v) { return v['country']; }); }),
            d3.max(countries, function(c) { return d3.max(c['value'], function(v) { return v['country']; }); })
        ]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Temperature (ºF)");

        var statistic = svg.selectAll(".statistic")
            .data(countries)
            .enter().append("g")
                .attr("class", "statistic");

        statistic.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.name); });

        statistic.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });

//value = {temperature, date}

//        svg.append('svg')
//            .attr('id', "visSvg")
//            .attr('width', 500)
//            .attr('height', 500)
//            .append('rect')
//                .attr('x', 200)
//                .attr('y', 200)
//                .attr('width', 50)
//                .attr('height', 50)
//                .attr('fill', "blue");
////        svg.append('svg')
////            .attr('id', "visSvg")
////            .attr('width', "500px")
////            .attr('height', "500px")
////            .append('rect')
////                .attr('x', "200px")
////                .attr('y', "200px")
////                .attr('width', "50px")
////                .attr('height', "50px")
////                .attr('fill', "blue");
    }
});
