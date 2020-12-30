var vizColors = ["#F4382C","rgba(244, 56, 44,0.6)"]
window.onload = function(){
    drawDonut("bookType", {"fiction":4,"non-fiction":18});
    drawDonut("fromLibrary",{"borrowed":18, "bought":4});
    drawDonut("finished",{"completed":22, "zzzdidnotfinish":12});
    drawDateDistribution();
}
window.onresize = function(){
    // Really janky way to resize svg's
    for (var i=0; i<4;i++ ){
        d3.select("svg").remove();
    }

    drawDonut("bookType", {"fiction":4,"non-fiction":18});
    drawDonut("fromLibrary",{"borrowed":18, "bought":4});
    drawDonut("finished",{"finished":22, "zzzdidnotfinish":12});
    drawDateDistribution();
}




function drawDonut (id, data){
    // Dimensions of Pie Chart
    var width = getDivWidth(id);
    var height = width;
    var margin = 00;
    var radius = Math.min(width, height)/2 - margin;

    // Sets up SVG and Colors
    var svg = d3.select("#" + id)
        .append("svg").attr("width",width).attr("height",height)
        .append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(vizColors);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function(d) {return d.value; });
    var data_ready = pie(d3.entries(data));

    // The arc generator
    var arc = d3.arc()
        .innerRadius(radius * 0.8)         // This is the size of the donut hole
        .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg.selectAll('allSlices').data(data_ready).enter().append('path')
        .attr('d', arc)
        .attr('fill', function(d){ return(color(d.data.key)) })

    var sortedKeys = Object.keys(data).sort();
    console.log(data[sortedKeys[0]] + " : " + data[sortedKeys[1]])
    var percentage = Math.round(data[sortedKeys[0]] / (data[sortedKeys[0]] + data[sortedKeys[1]]) * 100);
    svg.append("text")
        .text(percentage+"%")
            .attr("text-anchor","middle")
            .attr("font-size","28px")
            .attr("font-weight","300")
            .attr("y",width/15);
}

// Function to compute density
function kernelDensityEstimator(kernel, X) {
    return function (V) {
      return X.map(function (x) {
        return [x, d3.mean(V, function (v) { return kernel(x - v); })];
      });
    };
  }
function kernelEpanechnikov(k) {
    return function (v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
  }

//function to get width of div
function getDivWidth(id){
    return document.getElementById(id).getBoundingClientRect().width;
}
//function to draw date distribution
function drawDateDistribution(){
    // set the dimensions and margins of the graph
    var margin = { top: 16, right: 16, bottom: 32, left: 16 },
        width = getDivWidth("publishdate") - margin.left - margin.right,
        height = width/3 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#publishdate")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    /* YOUR LIST */
    const list = [1965, 1986, 1990, 1994, 2004, 2008, 2008, 2013, 2013, 2017, 2018, 2018, 2018, 2019, 2019, 2019, 2019, 2020, 2020, 2020, 2020, 2020]

    // add the x Axis
    var x = d3.scaleLinear()
        .domain([1965, 2020])
        .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // add the y Axis
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 0.1]);

    // Compute kernel density estimation
    var kde = kernelDensityEstimator(kernelEpanechnikov(4), x.ticks(40))
    var density = kde(list)

    // Plot the area
    svg.append("path")
        .attr("class", "mypath")
        .datum(density)
        .attr("fill", vizColors[1])
        .attr("opacity", ".8")
        .attr("stroke", vizColors[0])
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d", d3.area()
            .curve(d3.curveBasis)
            .x(function (d) { return x(d[0]); })
            .y1(function (d) { return y(d[1]); })
            .y0(y(0))
        );
}