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

        //TODO: create a geo path generator

        //TODO: draw polygon, line, point
    });

function redraw(){
}
