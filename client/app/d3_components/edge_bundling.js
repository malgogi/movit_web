//{"name":"flare.movie.romio","size":3938,"imports":["flare.word.item"]}

window.drawEdgeBundling = function ( data, target ) {
  var flaredata = data;

  var diameter = 1000,
      radius = diameter / 2,
      innerRadius = radius - 120;

  var cluster = d3.layout.cluster()
      .size([360, innerRadius])
      .sort(null)
      .value(function(d) { return d.size; });

  var bundle = d3.layout.bundle();

  var line = d3.svg.line.radial()
      .interpolate("bundle")
      .tension(.3)
      .radius(function(d) { return d.y; })
      .angle(function(d) { return d.x / 180 * Math.PI; });

  var svg = d3.select( target ).append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
    .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  var link = svg.append("g").selectAll(".link"),
      node = svg.append("g").selectAll(".node");

  //d3.json(flaredata, function(error, classes) {
    var nodes = cluster.nodes(packageHierarchy(flaredata));
    var links = packageImports(nodes);

    link = link
        .data(bundle(links))
      .enter().append("path")
        .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
        .attr("class", "link")
        .attr("d", line);

    node = node
        .data(nodes.filter(function(n) { return !n.children; }))
      .enter().append("text")
        .attr("class", "node")
        .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
        .attr("dy", ".31em")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")" + (d.x < 180 ? "" : "rotate(180)"); })
        .style("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .text(function(d) { return d.key; })
        .on("mouseover", mouseovered)
        .on("mouseout", mouseouted);
  //});

  function mouseovered(d) {
    node
        .each(function(n) { n.target = n.source = false; });

    link
        .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
        .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
      .filter(function(l) { return l.target === d || l.source === d; })
        .each(function() { this.parentNode.appendChild(this); });

    node
        .classed("node--target", function(n) { return n.target; })
        .classed("node--source", function(n) { return n.source; });
  }

  function mouseouted(d) {
    link
        .classed("link--target", false)
        .classed("link--source", false);

    node
        .classed("node--target", false)
        .classed("node--source", false);
  }

  d3.select(self.frameElement).style("height", diameter + "px");

  // Lazily construct the package hierarchy from class names.
  function packageHierarchy(classes) {
    var map = {};

    function find(name, data) {
      var node = map[name], i;
      if (!node) {
        node = map[name] = data || {name: name, children: []};
        if (name.length) {
          node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
          node.parent.children.push(node);
          node.key = name.substring(i + 1);
        }
      }
      return node;
    }

    classes.forEach(function(d) {
      find(d.name, d);
    });

    return map[""];
  }

  // Return a list of imports for the given array of nodes.
  function packageImports(nodes) {
    var map = {},
        imports = [];

    // Compute a map from name to node.
    nodes.forEach(function(d) {
      map[d.name] = d;
    });

    // For each import, construct a link from the source to target node.
    nodes.forEach(function(d) {
      if (d.imports) d.imports.forEach(function(i) {
        imports.push({source: map[d.name], target: map[i]});
      });
    });

    return imports;
  }
};

//{"name":"flare.movie.romio","size":3938,"imports":["flare.word.item"], "orign" : 'romio' }
window.makeEdgeBundlingData = function ( list, targetArrayName, limit ) {
  var newList = [];
  var MOVIE_PREFIX = 'flare.movie.';
  var WORD_PREFIX = 'falare.word.';
  list.forEach( function ( elem, index, array ) {
    var newMovieItem = {
      name : MOVIE_PREFIX + elem.name,
      size : Math.random() * 10,
      imports : [],
      origin : elem.name
    };

    for( var key in elem[ targetArrayName ] ) {

      if ( elem[ targetArrayName ][ key ] >= limit ) {
        newMovieItem.imports.push( WORD_PREFIX + key );
      }
      
      var exist = false;
      newList.forEach( function ( newElem, newIndex, newArray ) {
        //if( key == newElem)
        if( newElem.origin == key ) {
          exist = true;
        }
      });

      if ( !exist && elem[ targetArrayName ][ key ] >= limit ) {
        newList.push({
          name : WORD_PREFIX + key,
          size : Math.random(),
          imports : [],
          origin : key
        });
      }
    }

    newList.push( newMovieItem );


  });

  return newList;
};

window.makeEdgeBundlingGenre = function ( list, targetArrayName ) {
  var newList = [];
  var MOVIE_PREFIX = 'flare.movie.name';
  var WORD_PREFIX = 'falare.word.';
  list.forEach( function ( elem, index, array ) {
    var newMovieItem = {
      name : MOVIE_PREFIX + elem.name,
      size : Math.random() * 1000,
      imports : [],
      origin : elem.name
    };

    for( var key in elem[ targetArrayName ] ) {
      newMovieItem.imports.push( WORD_PREFIX + elem[ targetArrayName ][ key ] );
      
      var exist = false;
      newList.forEach( function ( newElem, newIndex, newArray ) {
        //if( key == newElem)
        if( newElem.origin == elem[ targetArrayName ][ key ] ) {
          exist = true;
        }
      });

      if ( !exist ) {
        newList.push({
          name : WORD_PREFIX + elem[ targetArrayName ][ key ],
          size : Math.random() * 1000,
          imports : [],
          origin : elem[ targetArrayName ][ key ]
        });
      }
    }

    newList.push( newMovieItem );


  });

  return newList;
};
