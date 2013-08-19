// Timing globals
var timer = 3000;
var slideTimer = 1000;
var time = (new Date).getTime();

// --- total of the height parts from here and set in the stylesheet ---
// Table scale
var rowHeight = 28;

// Control slide speed
var timerOffset = 20;

// Data...
// http://upload.wikimedia.org/wikipedia/commons/2/2f/Comparison_of_highest_mountains.svg
var mountains = [{"name": "Everest", "height": 8848},
            {"name": "K2", "height": 8611},
            {"name": "Kangchenjunga", "height": 8586},
            {"name": "Lhotse", "height": 8516},
            {"name": "Makalu", "height": 8485},
            {"name": "Cho Oyu", "height": 8201},
            {"name": "Dhaulagiri I", "height": 8167},
            {"name": "Manaslu", "height": 8163},
            {"name": "Nanga Parbat", "height": 8126},
            {"name": "Annapurna I", "height": 8091},
            {"name": "Gasherbrum I", "height": 8080},
            {"name": "Broad Peak", "height": 8051},
            {"name": "Gasherbrum II", "height": 8034},
            {"name": "Shishapangma", "height": 8027}
            ];
var resetMountains = mountains.slice(0);

// List to be.  i.e. a buffer
var extraMountains = [{"name": "Aconcagua", "height": 6962},
            {"name": "Ojos del Salado", "height": 6893},
            {"name": "McKinley", "height": 6194},
            {"name": "Logan", "height": 5959},
            {"name": "Kilimanjaro", "height": 5895},
            {"name": "Kenya", "height": 5199},
            {"name": "Elbrus", "height": 5642},
            {"name": "Dykh-Tau", "height": 5205},
            {"name": "Vinson", "height": 4892},
            {"name": "Tyree", "height": 4852},
            {"name": "Puncak Jaya", "height": 4884},
            {"name": "Blanc", "height": 4810},
            {"name": "Puncak Mandala", "height": 4760},
            {"name": "Kosciuszko", "height": 2228},
            {"name": "Townsend", "height": 2209}
            ];
var resetExtraMountains = extraMountains.slice(0);


$(document).ready(function(){
    // Stop animation on hover
    var pause = false;
    $('#peaksTable').hover(
        function(){
            pause = true;
        }, function(){
            pause = false;
        });

    // Initialize some timestamps
    $(mountains).each(function(i, d){
            d['id'] = ++time;
        });

    // Is bound at insertion
    var highlight = true;

    // Draws rows and columns in the peakTable body.
    // Merged from an init() and redraw() into a single draw()
    function draw(){
        // Dynamically set stiff table height
        $('#peaksTable').css('height', (mountains.length * rowHeight) + "px");

        var peaksTable = d3.select('#peaksTable');
        var rows = peaksTable.selectAll('.row').data(mountains, function(d){ return d['id']; });

        // Enter rows and columns into the table
        rows.enter()
            .append('div')
            .attr('class', "row")
            .on('mouseover', function(){
                $(this).children().toggleClass('hover');
            })
            .on('mouseout', function(){
                $(this).children().toggleClass('hover');
            })
            .attr('height', "10px")
            .each(function(){
                d3.select(this)
                    .append('div')
                    .attr('class', "mountain")
                    .text(function(d){
                        return d['name'];
                    })
                d3.select(this)
                    .append('div')
                    .attr('class', "height")
                    .text(function(d){
                        return d['height'];
                    })
                if (highlight){
                    $(this).children().addClass('highlight');
                    highlight = false;
                } else {
                    highlight = true;
                }
            });
        
        // Slide animation upon exit
        rows.exit()
            .each(function(){ //'end', 
                // Slide rows up
                rows.transition()
                    .duration(timer - timerOffset)
                    .style('top', "-" + rowHeight + "px");
            })
            // Remove row
            .transition()
            .duration(timer - timerOffset)
            .style('top', "-" + rowHeight + "px")
            .remove()
            // Adjust back for next slide transition
            .each('end', function(){
                rows.style('top', "0px");
            });
    }

    // Update
    function update(){
        if (!pause){
            // Cycle through data.
            var front = mountains.shift();
            var next = extraMountains.shift()
            next['id'] = ++time;
            mountains.push(next);
            extraMountains.push(front);
            draw();
        }
    }

    // Initialize
    draw();
    // Update loop
    setInterval(update, timer);
});
