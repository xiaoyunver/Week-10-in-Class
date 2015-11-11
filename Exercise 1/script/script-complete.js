/**
 * Created by siqi on 11/10/15.
 */
var margin = {t:50,r:50,b:50,l:50},
    width = document.getElementById('map').clientWidth - margin.l - margin.r,
    height = document.getElementById('map').clientHeight - margin.t - margin.b;

var map = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g').attr('class','map')
    .attr('transform','translate('+margin.l+','+margin.t+')');

var lngLatBoston = [-71.0589,42.3601],
    lngLatSF = [-122.4167,37.7833];

var path;

//import GeoJSON data
queue()
    .defer(d3.json, "data/gz_2010_us_040_00_5m.json")
    .defer(d3.json, "data/gz_2010_us_050_00_5m.json")
    .await(function(err, states, counties){
        console.log(states);
        console.log(counties);


        //TODO: set up a projection
        var albersProjection = d3.geo.albersUsa()
            .translate([width/2,height/2])
            .scale(1200);

        var mercatorProjection = d3.geo.mercator()
            .translate([width/2,height/2])
            .center(lngLatBoston)
            .scale(1200);

        //TODO: create a geo path generator
        path = d3.geo.path()
            .projection(albersProjection);

        //TODO: draw
        //Draw states as separate <path> elements
        map.selectAll('.state')
            .data(states.features)
            .enter()
            .append('path')
            .attr('class','state')
            .attr('d',path);

        //Draw counties as a single <path> element
        map.append('path')
            .datum(counties)
            .attr('class','counties')
            .attr('d',path);


        function drawCircle(selection){
            selection
                .attr('cx',function(d){
                    return albersProjection(d)[0];
                })
                .attr('cy',function(d){
                    return albersProjection(d)[1];
                })
                .attr('r',5);
        }

        //Draw line connection Boston and SF
        map.append('path')
            .attr('class','line')
            .datum({
                type:'Feature',
                geometry:{
                    type:'LineString',
                    coordinates:[lngLatBoston,lngLatSF]
                }
            })
            .attr('d',path);

        //Draw Boston and SF
        map.append('circle')
            .attr('class','city Boston')
            .datum(lngLatBoston)
            .call(drawCircle);

        map.append('circle')
            .attr('class','city SF')
            .datum(lngLatSF)
            .call(drawCircle);

        d3.selectAll('.btn').on('click',function(){
            var projectionId = d3.select(this).attr('id');
            if(projectionId == "mercator"){
                path
                    .projection(mercatorProjection);
            }else{
                path
                    .projection(albersProjection);
            }

            redraw()
        })
    });

function redraw(){
    map.selectAll('.state')
        .transition()
        .attr('d',path);

    map.selectAll('.counties')
        .transition()
        .attr('d',path);

    map.select('.line')
        .transition()
        .attr('d',path);
}
