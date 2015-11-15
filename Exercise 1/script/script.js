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

var albersUsaProjection = d3.geo.albersUsa()
    //.center()//smae kind of longitude latitude
    .translate([width/2,height/2]);//x,y

var path1 = d3.geo.path() //this is a generator
    .projection(albersUsaProjection);

//import GeoJSON data
queue()
    .defer(d3.json, "data/gz_2010_us_040_00_5m.json")//counties
    .defer(d3.json, "data/gz_2010_us_050_00_5m.json")//states
    .await(function(err, states, counties){
        console.log(states);
        //console.log(counties);


        //draw boston as a point

       /* map.selectAll('.state')
            .data(states.features)
            .enter()
            .append('path').attr('class','state')
            .attr('d', path);*/  //each states as a path

        map.append('path')
            .datum(counties)
            .attr('class','counties')
            .attr('d',path1);//one country as a path

        map.append('circle').attr('class','city')
            .attr('cx',albersUsaProjection(lngLatBoston)[0])
            .attr('cy',albersUsaProjection(lngLatBoston)[1])
            .attr('r',5);

        map.append('line').attr('class','line')
            .attr('x1',albersUsaProjection(lngLatBoston)[0])
            .attr('x2',albersUsaProjection(lngLatSF)[0])
            .attr('y1',albersUsaProjection(lngLatBoston)[1])
            .attr('y2',albersUsaProjection(lngLatSF)[1]);

        var lineFeature = {
            type: 'Feature',
            geometry:{
                type:'LineString',
                coordinates:[lngLatBoston,lngLatSF]
            },
            properties:{}
        };

        map.append('path').attr('class','line')
            .attr('d',path1(lineFeature))
        //TODO: set up a projection

        //TODO: create a geo path generator

        //TODO: draw polygon, line, point
    });

function redraw(){
}
