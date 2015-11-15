var margin = {t:50,l:50,b:50,r:50},
    width = document.getElementById('map').clientWidth-margin.l-margin.r,
    height = document.getElementById('map').clientHeight-margin.t-margin.b;

var map = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g').attr('class','map')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

//Set up projection and geo path generator
var projection = d3.geo.albersUsa()
	.translate([width/2, height/2]);

var path = d3.geo.path()
	.projection(projection);

var popByState = d3.map();

//Scales
var scaleR = d3.scale.sqrt().domain([500000,50000000]).range([5,180]),
    scaleColor = d3.scale.linear().domain([70,90]).range(['white','red']);

//import data
queue()
	.defer(d3.json, "data/gz_2010_us_040_00_5m.json")
    .defer(d3.csv, "data/2014_state_pop.csv", parseData)
	.await(function(err, states, pop){
        console.log(popByState);

        map.append('path')
            .datum(states)
            .attr('d',path)
            .style('fill','rgb(127,0,72)')
            .style('stroke-width','1px')
            .style('stroke','white');


        map.selectAll('.state')
            .data(states.features)
            .enter()
            .append('circle').attr('class','state')
            .attr('r',function(d){
                //'r' needs to represent population
                var pop =( popByState.get(d.properties.STATE) ).pop;

                console.log(pop);
                return scaleR(pop);
            })

            .attr('cx',function(d){
                //path(d)  //give us outline
                //path.centroid(d)  //give us x,y of centroid
                return path.centroid(d)[0]
            })
            .attr('cy',function(d){
                return path.centroid(d)[1]
            })
            .style('fill-opacity',.2);

        //place these circles at the right place

	});

function parseData(d){
    //Use the parse function to populate the lookup table of states and their populations/% pop 18+
    popByState.set(d.STATE, {
            pop:+d.POPESTIMATE2014,
        pct18:+d.PCNT_POPEST18PLUS
        });
}

function onMouseEnter(d){
	//we need to show the tooltip
    customTooltip
        .style('visibility','visible');

    //find out where on the screen the tooltip needs to go
    var xy = d3.mouse(canvasDiv); //this returns mouse location in relation to .canvas
    customTooltip
        .style('left', (xy[0]+10)+'px')
        .style('top', (xy[1]+10)+'px');

    //inject data into the content of the tooltip

    var id = (+d.properties.STATE) + d.properties.COUNTY,
        rate = rateById.get(id);

    customTooltip
        .select('h2')
        .html(d.properties.NAME);
    customTooltip
        .select('span')
        .html(rate);
}

function onMouseLeave(d){
    //hide the tooltip
    customTooltip
        .style('visibility','hidden');

}