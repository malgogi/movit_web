/*
  {
      word : '',
      size : 4
  }
*/
window.drawWordCloud = function ( data,target ) {
  var fill = d3.scale.category20();

  d3.layout.cloud().size([ 1000, 1000 ])
      .words( data.map(function(d) {
        return { text: d.word, size: d.size * 2 };
      }))
      .rotate(function() { return (Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();

  function draw(words) {
    d3.select( target ).append("svg")
        .attr("width", 1000 )
        .attr("height", 1000 )
      .append("g")
        .attr("transform", "translate( 500,500 )")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }
};

window.makeWordCloudData = function ( list, targetArrayName ) {
  var newList = [];
  list.forEach( function ( elem, index, array ) {
    for( var key in elem[ targetArrayName ] ) {
      
      var exist = false;

      newList.forEach( function ( newElem, newIndex, newArray ) {
          if( newElem.word === key ) {
            exist = true;
            newArray[ newIndex ].size += elem[ targetArrayName ][ key ];
          }
      });

      if ( !exist && key != '<s>' && key != '</s>' ) {
        newList.push( {
          word : key,
          size : elem[ targetArrayName ][ key ]
        });
      }
    }
  });

  return newList;
};