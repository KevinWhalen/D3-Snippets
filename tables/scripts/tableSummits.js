// Started off as a pratice page for better learning the different types of jQuery selects. 
// A lot of the D3 code below is rather yucky. Never used it with tables before. 

// I do like the transition smoothness that was reached, and the update logic. 

// Timing globals
var timer = 5000;
var fadeTimer = 1000;
var time = (new Date).getTime();

$(document).ready(function(){
    //$('th').addClass('highlight');
    //$('td + td').addClass('highlight');
    //$('[type][value="Delete"]').addClass('highlight');

    // Stop animation on hover
    var pause = false;
    $('#peaksTable').hover(
        function(){
            pause = true;
        }, function(){
            pause = false;
        });

    // data...
    // http://upload.wikimedia.org/wikipedia/commons/2/2f/Comparison_of_highest_mountains.svg
    var mountains = [{ "name": "Everest", "height": 8848 },
                { "name": "K2", "height": 8611 },
                { "name": "Kangchenjunga", "height": 8586},
                { "name": "Lhotse", "height": 8516 },
                { "name": "Makalu", "height": 8485 },
                { "name": "Cho Oyu", "height": 8201 },
                { "name": "Dhaulagiri I", "height": 8167 },
                { "name": "Manaslu", "height": 8163 },
                { "name": "Nanga Parbat", "height": 8126 },
                { "name": "Annapurna I", "height": 8091 },
                { "name": "Gasherbrum I", "height": 8080 },
                { "name": "Broad Peak", "height": 8051 },
                { "name": "Gasherbrum II", "height": 8034 },
                { "name": "Shishapangma", "height": 8027 }
                ];
    var resetMountains = mountains.slice(0);
    
    // Initialization creates rows and columns in the peakTable body.
    // Only called more than once when running with a full table reset after it empties.
    function init(){
        $(mountains).each(function(i, d){
            d['id'] = ++time;
        });

        // Initialize the table
        var peaksTable = d3.select('#peaksTable');
        var tableBody = peaksTable.select('tbody');
        var rows = tableBody.selectAll('tr').data(mountains, function(d){ return d['id']; });
        rows.enter()
            .append('tr')
            .attr('height', "10px");
        rows.append('td')
            .attr('class', "mountain")
            .text(function(d){
                return d['name'];
            });
        rows.append('td')
            .attr('class', "height")
            .text(function(d){
                return d['height'];
            });

        // Selection radio marks
        $('tr').prepend("<td></td>");
        $('<input name="delete" type="radio"/>')
            .prependTo('tbody td:first-child')
            .first()
            .attr("checked", true);

        hightlightTable();
    }

    // Highlighting
    function hightlightTable(){
        $('table').find('td[class]')
            .removeClass('highlight');
        $('table').find('td[class]').parent().filter(':even').children()
            .addClass('highlight');

        $('[type=radio]')
            .first()
            .attr("checked", true);
    }

    // Clean up ordering ----------------------------------
    init();

    // Hovering background color (Not functioning for incoming rows. Bugging during animations.)
    $('table').find('td[class*=mountain], td[class*=height]')
        .hover(function(){
            $(this).toggleClass('hover');
        }, function(){
            $(this).toggleClass('hover');
        });

    // Remove row click-event
    $('#removeRow').click(function(){
        var checked = $('[type=radio]:checked');
        var index = $('[type=radio]').index(checked);
        $('#peaksTable').find('tr').filter(function(i){
            if (i == (index + 1)) {
                //delete mountains[i]
                //console.log($(this).find('td[class*=mountain]').html());
                mountains.splice(index, 1);
                $(this).remove();
                hightlightTable();
            }
        });
        $('[type=radio]')
            .first()
            .attr("checked", true);
    });

    // Update the table
    function redraw(){
        var peaksTable = d3.select('#peaksTable');
        var tableBody = peaksTable.select('tbody');
        var rows = tableBody.selectAll('tr').data(mountains, function(d){ return d['id']; });

        /*
        rows.enter()
        .append('tr');
        */
        rows.enter()
            .insert('tr')
            .style('opacity', 0)
            .attr('height', "50px")
            .attr('class', "newTr");
        //rows.enter()
        d3.selectAll('.newTr')
            .insert('td')
            .insert('input')
            .attr('class', "newRadio");
        d3.selectAll('.newRadio')
            .attr('name', "delete")
            .attr('type', "radio");
        $('.newRadio').removeClass('newRadio');
        //rows.enter()
        d3.selectAll('.newTr')
            .insert('td')
            .attr('class', "mountain")
            .text(function(d){
                return d['name'];
            });
        //rows.enter()
        d3.selectAll('.newTr')
            .insert('td')
            .attr('class', "height")
            .text(function(d){
                return d['height'];
            });
        $('.newTr').removeClass('newTr');

        // Animate in new additions
        var timerOffset = 50;
        rows.transition()
            .duration(fadeTimer)
            .style('opacity', 1)
            .each('end', function(){
                d3.select(this).transition()
                    .duration(timer - (fadeTimer + timerOffset))
                    .attr('height', "10px");
            });

        // Deletion animation
        rows.exit()
            .transition()
            .duration(timer - (fadeTimer + timerOffset))
            .attr('height', "50px")
            .each('end', function(){
                d3.select(this).transition()
                    .duration(fadeTimer)
                    .style('opacity', 0)
                    .remove();
            });

        hightlightTable();
    }

    // List to be 
    var extraMountains = [{ "name": "Aconcagua", "height": 6962 },
                { "name": "Ojos del Salado", "height": 6893 },
                { "name": "McKinley", "height": 6194},
                { "name": "Logan", "height": 5959 },
                { "name": "Kilimanjaro", "height": 5895 },
                { "name": "Kenya", "height": 5199 },
                { "name": "Elbrus", "height": 5642 },
                { "name": "Dykh-Tau", "height": 5205 },
                { "name": "Vinson", "height": 4892 },
                { "name": "Tyree", "height": 4852 },
                { "name": "Puncak Jaya", "height": 4884 },
                { "name": "Blanc", "height": 4810 },
                { "name": "Puncak Mandala", "height": 4760 },
                { "name": "Kosciuszko", "height": 2228 },
                { "name": "Townsend", "height": 2209 }
                ];
    var resetExtraMountains = extraMountains.slice(0);

    // Update loop for testing
    var waitToClear = 3;
    var wait = waitToClear;
    function update(){
        if (!pause){
            var front = mountains.shift();
            if (extraMountains.length > 0){
                var next = extraMountains.shift()
                next['id'] = ++time;
                mountains.push(next);
                extraMountains.push(front); // This line for a circular animation.
                redraw();
            // Full clear out
            } /*else if (wait > 0) {
                --wait;
                redraw();
            // Complete reset
            } else if (mountains.length < 1){
                mountains = resetMountains.slice(0);
                extraMountains = resetExtraMountains.slice(0);
                $('thead').find('tr').children('td').first().remove();
                init();
                wait = waitToClear;
            }*/ else {
                redraw();
            }
        }

        //setTimeout(update, 5000);
    }
    setInterval(update, timer);
    //update();
});
