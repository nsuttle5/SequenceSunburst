// Reduce the sunburst svg width so legend + chart + icons fit comfortably
var width = 600;
var height = 600;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 75, h: 30, s: 3, t: 10
};

// Comprehensive color mapping for ALL categories
var colors = {
  // Locations
  "Student Center": "#C59353",
  "North Avenue": "#EEB211", 
  "CULC": "#00254c",
  "Tech Green": "#38393eff",
  };

// Function to generate shades for each location
function getColor(d) {
  // If this is a location node, use the base color
  if (locationColors[d.name]) {
    return locationColors[d.name];
  }
  
  // Find the location in the node's ancestry
  var node = d;
  var locationName = null;
  while (node.parent) {
    if (locationColors[node.name]) {
      locationName = node.name;
      break;
    }
    node = node.parent;
  }
  
  if (!locationName) {
    return "#cccccc"; // Fallback color
  }
  
  var baseColor = locationColors[locationName];
  
  // Generate different shades based on the category type and depth
  var shade = getShadeForCategory(d.name, d.depth);
  return adjustColorShade(baseColor, shade);
}

// Function to determine shade based on category type
function getShadeForCategory(categoryName, depth) {
  // Define shade multipliers for different category types
  var shades = {
    // Vehicle types - medium shades
    "Scooter": 0.7,
    "Bike": 0.5,
    
    // Helmet usage - lighter/darker shades
    "Helmet Yes": 1.3, // lighter
    "Helmet No": 0.3,  // darker
    
    // Speed levels - various shades
    "High Speed": 0.2,   // darkest
    "Normal Speed": 0.6, // medium
    "Med Speed": 0.8,    // lighter medium  
    "Low Speed": 1.1,    // light
    
    // Weather conditions - various shades (keeping for now)
    "Drizzle": 0.9,
    "Cloudy": 0.7,
    "Rainy": 0.4,
    "Overcast": 0.6,
    "Partly Cloudy": 1.2
  };
  
  return shades[categoryName] || 0.8; // Default medium shade
}

// Function to adjust color shade (lighten/darken)
function adjustColorShade(hex, shade) {
  // Convert hex to RGB
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  
  // Adjust each component by the shade multiplier
  r = Math.min(255, Math.max(0, Math.round(r * shade)));
  g = Math.min(255, Math.max(0, Math.round(g * shade)));
  b = Math.min(255, Math.max(0, Math.round(b * shade)));
  
  // Convert back to hex
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Total size of all segments; we set this later, after loading the data.
// Reduce the sunburst svg width so legend + chart + icons fit comfortably
var width = 800;
var height = 800;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 75, h: 30, s: 3, t: 10
};

// Location-based color mapping
var locationColors = {
  "Student Center": "#C59353",
  "North Avenue": "#EEB211", 
  "CULC": "#00254c",
  "Tech Green": "#38393eff"
};

function getColor(d) {
  // If this is a location node, use the base color
  if (locationColors[d.name]) {
    return locationColors[d.name];
  }
  
  // Find the location in the node's ancestry
  var node = d;
  var locationName = null;
  while (node.parent) {
    if (locationColors[node.name]) {
      locationName = node.name;
      break;
    }
    node = node.parent;
  }
  
  if (!locationName) {
    return "#cccccc"; // Fallback color
  }
  
  var baseColor = locationColors[locationName];
  
  // Generate lighter shades based on depth (farther from center = lighter)
  var shade = getShadeForCategory(d.name, d.depth);
  return adjustColorShade(baseColor, shade);
}

// Function to determine shade based on category type and depth
function getShadeForCategory(categoryName, depth) {
  // Base shade multipliers for different category types
  var baseShades = {
    // Vehicle types - start with medium-light shades
    "Scooter": 1.2,
    "Bike": 1.4,
    
    // Helmet usage - lighter shades
    "Helmet Yes": 1.6,
    "Helmet No": 1.8,
    
    // Speed levels - various light shades
    "High Speed": 2.0,   // lightest
    "Normal Speed": 1.8, // light
    "Med Speed": 1.6,    // medium-light  
    "Low Speed": 1.4,    // slightly light
    
    // Weather conditions - light shades
    "Drizzle": 1.5,
    "Cloudy": 1.3,
    "Rainy": 1.7,
    "Overcast": 1.4,
    "Partly Cloudy": 1.9
  };
  
  var baseShade = baseShades[categoryName] || 1.5; // Default medium-light shade
  
  // Make shades progressively lighter with depth
  // Each level out from center gets 10% lighter
  var depthMultiplier = 1 + (depth * 0.1);
  
  return baseShade * depthMultiplier;
}

// Function to adjust color shade (lighten/darken)
function adjustColorShade(hex, shade) {
  // Convert hex to RGB
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  
  // Adjust each component by the shade multiplier
  // For lightening, we need to move toward white (255)
  r = Math.min(255, Math.max(0, Math.round(255 - (255 - r) / shade)));
  g = Math.min(255, Math.max(0, Math.round(255 - (255 - g) / shade)));
  b = Math.min(255, Math.max(0, Math.round(255 - (255 - b) / shade)));
  
  // Convert back to hex
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0; 

var vis = d3.select("#chart").append("svg:svg")
  .attr("width", width)
  .attr("height", height)
  // make responsive: set viewBox so SVG scales down on smaller screens
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("svg:g")
  .attr("id", "container")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.layout.partition()
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

// Use d3.text and d3.csv.parseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
d3.text("visit-sequences.csv", function(text) {
  var csv = d3.csv.parseRows(text);
  var json = buildHierarchy(csv);
  createVisualization(json);
});

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

  // Basic setup of page elements.
  initializeBreadcrumbTrail();
  // create the icon panel that will react to hover events
  createIconPanel();
  drawLegend();
  d3.select("#togglelegend").on("click", toggleLegend);

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append("svg:circle")
      .attr("r", radius)
      .style("opacity", 0);

  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition.nodes(json)
      .filter(function(d) {
      return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
      });

  var path = vis.data([json]).selectAll("path")
      .data(nodes)
      .enter().append("svg:path")
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) { 
        return getColor(d); // Use the getColor function instead of colors[d.name]
      })
      .style("opacity", 1)
      .on("mouseover", mouseover);

  // Add the mouseleave handler to the bounding circle.
  d3.select("#container").on("mouseleave", mouseleave);

  // Get total size of the tree = value of root node from partition.
  totalSize = path.node().__data__.value;
 };

// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {

  var percentage = (100 * d.value / totalSize).toPrecision(3);
  var percentageString = percentage + "%";
  if (percentage < 0.1) {
    percentageString = "< 0.1%";
  }

  d3.select("#percentage")
      .text(percentageString);

  d3.select("#explanation")
      .style("visibility", "");

  var sequenceArray = getAncestors(d);
  updateBreadcrumbs(sequenceArray, percentageString);
  // update the icon panel based on the hovered sequence
  updateIconPanel(sequenceArray);

  // Fade all the segments.
  d3.selectAll("path")
      .style("opacity", 0.3);

  // Then highlight only those that are an ancestor of the current segment.
  vis.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

  // Hide the breadcrumb trail
  d3.select("#trail")
      .style("visibility", "hidden");

  // Deactivate all segments during transition.
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .each("end", function() {
              d3.select(this).on("mouseover", mouseover);
            });

  d3.select("#explanation")
      .transition()
      .duration(1000)
      .style("visibility", "hidden");

  // reset icon panel to default state
  resetIconPanel();
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  var g = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.name + d.depth; });

  // Add breadcrumb and label for entering nodes.
  var entering = g.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return getColor(d); }); // Use getColor here

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("fill", function(d) {
        // Use white text for dark backgrounds, black for light backgrounds
        var color = getColor(d);
        var r = parseInt(color.slice(1, 3), 16);
        var g = parseInt(color.slice(3, 5), 16);
        var b = parseInt(color.slice(5, 7), 16);
        var brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? "#000000" : "#ffffff";
      })
      .text(function(d) { return d.name; });

  // Set position for entering and updating nodes.
  g.attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Remove exiting nodes.
  g.exit().remove();

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(percentageString);

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}

function drawLegend() {
  // Clear any existing legend
  d3.select("#legend").html("");

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 120, h: 25, s: 3, r: 3
  };

  // Create sample data for all categories that appear in the visualization
  var legendData = [
    // Locations
    { name: "Student Center", depth: 1 },
    { name: "North Avenue", depth: 1 },
    { name: "CULC", depth: 1 },
    { name: "Tech Green", depth: 1 },
    
    // Vehicle Types
    { name: "Scooter", depth: 2 },
    { name: "Bike", depth: 2 },
    
    // Helmet Usage
    { name: "Helmet Yes", depth: 3 },
    { name: "Helmet No", depth: 3 },
    
    // Speed Levels
    { name: "High Speed", depth: 4 },
    { name: "Normal Speed", depth: 4 },
    { name: "Med Speed", depth: 4 },
    { name: "Low Speed", depth: 4 },
    
    // Weather Conditions
    { name: "Drizzle", depth: 2 },
    { name: "Cloudy", depth: 2 },
    { name: "Rainy", depth: 2 },
    { name: "Overcast", depth: 2 },
    { name: "Partly Cloudy", depth: 2 }
  ];

  var legend = d3.select("#legend").append("svg:svg")
      .attr("width", li.w + 20)
      .attr("height", legendData.length * (li.h + li.s));

  var g = legend.selectAll("g")
      .data(legendData)
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
        return "translate(0," + i * (li.h + li.s) + ")";
      });

  g.append("svg:rect")
      .attr("rx", li.r)
      .attr("ry", li.r)
      .attr("width", li.w)
      .attr("height", li.h)
      .style("fill", function(d) { 
        // Create a mock node object to pass to getColor
        var mockNode = { name: d.name, depth: d.depth, parent: null };
        return getColor(mockNode);
      });

  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("fill", function(d) {
        // Use white text for dark backgrounds, black for light backgrounds
        var mockNode = { name: d.name, depth: d.depth, parent: null };
        var color = getColor(mockNode);
        // Simple brightness calculation
        var r = parseInt(color.slice(1, 3), 16);
        var g = parseInt(color.slice(3, 5), 16);
        var b = parseInt(color.slice(5, 7), 16);
        var brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 125 ? "#000000" : "#ffffff";
      })
      .text(function(d) { return d.name; });
}


// ---------------- Icon panel: create/update/reset -----------------
function createIconPanel() {
  // create an SVG inside the #iconPanel div
  var w = 140, h = 600;
  var svg = d3.select("#iconPanel").append("svg")
      .attr("width", w)
      .attr("height", h);

  // Person (always visible) - using image instead of vector art
  var person = svg.append("g").attr("id", "icon-person").attr("transform", "translate(20,80)");
  person.append("image")
    .attr("xlink:href", "images/person.png")  // Update path to your image
    .attr("x", 12)
    .attr("y", 8)
    .attr("width", 56)   // Same scale as original vector (combined width)
    .attr("height", 92); // Same scale as original vector (head + body height)
  person.append("text").attr("x", 70).attr("y", 54).attr("class","icon-label").text("Person");

  // Helmet (hidden unless Helmet Yes) - using image
  var helmet = svg.append("g").attr("id", "icon-helmet").attr("transform", "translate(20,40)");
  helmet.append("image")
    .attr("xlink:href", "images/helmet.png")  // Update path to your image
    .attr("x", 10)
    .attr("y", 30)
    .attr("width", 52)   // Same scale as original path width
    .attr("height", 24); // Same scale as original path height
  helmet.append("text").attr("x", 70).attr("y", 54).attr("class","icon-label").text("Helmet");
  helmet.style("display", "none");

  // Scooter - using image
  var scooter = svg.append("g").attr("id", "icon-scooter").attr("transform", "translate(0,160)");
  scooter.append("image")
    .attr("xlink:href", "images/scooter.png")  // Update path to your image
    .attr("x", 10)
    .attr("y", 28)
    .attr("width", 60)   // Same scale as original (body + wheels)
    .attr("height", 36); // Same scale as original
  scooter.append("text").attr("x", 70).attr("y", 54).attr("class","icon-label").text("Scooter");
  scooter.style("display", "none");

  // Bike - using image
  var bike = svg.append("g").attr("id", "icon-bike").attr("transform", "translate(0,220)");
  bike.append("image")
    .attr("xlink:href", "images/bike.png")  // Update path to your image
    .attr("x", 10)
    .attr("y", 32)
    .attr("width", 64)   // Same scale as original (two wheels + frame)
    .attr("height", 48); // Same scale as original
  bike.append("text").attr("x", 70).attr("y", 74).attr("class","icon-label").text("Bike");
  bike.style("display", "none");

  // Weather - using images for different weather conditions
  var weather = svg.append("g").attr("id", "icon-weather").attr("transform", "translate(0,8)");
  // Cloud image (base weather icon)
  weather.append("image")
    .attr("id", "weather-cloud")
    .attr("xlink:href", "images/cloud.png")  // Update path to your image
    .attr("x", 14)
    .attr("y", 8)
    .attr("width", 56)   // Same scale as original cloud ellipses
    .attr("height", 28);
  // Rain overlay (shown for rainy/drizzle)
  weather.append("image")
    .attr("id", "weather-rain")
    .attr("xlink:href", "images/rain.png")  // Update path to your image
    .attr("x", 28)
    .attr("y", 32)
    .attr("width", 36)   // Same scale as original raindrops
    .attr("height", 12)
    .style("display", "none");
  // Sun overlay (shown for partly cloudy)
  weather.append("image")
    .attr("id", "weather-sun")
    .attr("xlink:href", "images/sun.png")  // Update path to your image
    .attr("x", 12)
    .attr("y", 0)
    .attr("width", 16)   // Same scale as original sun circle
    .attr("height", 16)
    .style("display", "none");
  weather.append("text").attr("x", 70).attr("y", 34).attr("class","icon-label").text("Weather");
  weather.style("display", "none");

  // Speedometer - using image
  var speed = svg.append("g").attr("id", "icon-speed").attr("transform", "translate(0,320)");
  speed.append("image")
    .attr("xlink:href", "images/speedometer.png")  // Update path to your image
    .attr("x", 12)
    .attr("y", 12)
    .attr("width", 72)   // Same scale as original arc
    .attr("height", 60);
  // Optional: Keep needle as SVG for animation, or use rotated image
  speed.append("line")
    .attr("id","speed-needle")
    .attr("x1",48).attr("y1",60)
    .attr("x2",48).attr("y2",22)
    .style("stroke","#d62728")
    .style("stroke-width",3)
    .attr("transform","rotate(20,48,60)");
  speed.append("text").attr("x", 70).attr("y", 64).attr("class","icon-label").text("Speed");
  speed.style("display", "none");

  // Location pin - using image
  var location = svg.append("g").attr("id", "icon-location").attr("transform", "translate(0,400)");
  location.append("image")
    .attr("xlink:href", "images/location.png")  // Update path to your image
    .attr("x", 32)
    .attr("y", 14)
    .attr("width", 32)   // Same scale as original pin
    .attr("height", 32);
  location.append("text").attr("id","location-label").attr("x", 70).attr("y", 34).attr("class","icon-label").text("");
  location.style("display", "none");
}

function updateIconPanel(nodeArray) {
  // nodeArray is highest-first array of ancestor nodes (excludes root)
  if (!nodeArray) return;
  // show person always
  d3.select("#icon-person").style("display", null);

  // VEHICLE
  var hasScooter = nodeArray.some(function(n){ return n.name === "Scooter"; });
  var hasBike = nodeArray.some(function(n){ return n.name === "Bike"; });
  d3.select("#icon-scooter").style("display", hasScooter ? null : "none");
  d3.select("#icon-bike").style("display", hasBike ? null : "none");

  // HELMET
  var hasHelmetYes = nodeArray.some(function(n){ return n.name === "Helmet Yes"; });
  d3.select("#icon-helmet").style("display", hasHelmetYes ? null : "none");

  // SPEED
  var speedNames = ["Low Speed","Med Speed","Normal Speed","High Speed"];
  var foundSpeed = null;
  for (var i=0;i<speedNames.length;i++) {
    if (nodeArray.some(function(n){ return n.name === speedNames[i]; })) { foundSpeed = speedNames[i]; break; }
  }
  if (foundSpeed) {
    d3.select("#icon-speed").style("display", null);
    var angle = 20; // default Normal
    if (foundSpeed === "Low Speed") angle = -60;
    else if (foundSpeed === "Med Speed") angle = -20;
    else if (foundSpeed === "Normal Speed") angle = 20;
    else if (foundSpeed === "High Speed") angle = 60;
    d3.select("#speed-needle").attr("transform", "rotate("+angle+",48,60)");
  } else {
    d3.select("#icon-speed").style("display", "none");
  }

  // WEATHER
  var weatherTypes = ["Drizzle","Cloudy","Rainy","Overcast","Partly Cloudy"];
  var foundWeather = null;
  for (var j=0;j<weatherTypes.length;j++) {
    if (nodeArray.some(function(n){ return n.name === weatherTypes[j]; })) { foundWeather = weatherTypes[j]; break; }
  }
  if (foundWeather) {
    d3.select("#icon-weather").style("display", null);
    // show/hide rain or sun
    if (foundWeather === "Rainy" || foundWeather === "Drizzle") {
      d3.select("#weather-rain").style("display", null);
      d3.select("#weather-sun").style("display", "none");
    } else if (foundWeather === "Partly Cloudy") {
      d3.select("#weather-rain").style("display", "none");
      d3.select("#weather-sun").style("display", null);
    } else {
      d3.select("#weather-rain").style("display", "none");
      d3.select("#weather-sun").style("display", "none");
    }
  } else {
    d3.select("#icon-weather").style("display", "none");
  }

  // LOCATION
  var locationNames = ["Student Center","North Avenue","CULC","Tech Green"];
  var foundLocation = null;
  for (var k=0;k<locationNames.length;k++) {
    if (nodeArray.some(function(n){ return n.name === locationNames[k]; })) { foundLocation = locationNames[k]; break; }
  }
  if (foundLocation) {
    d3.select("#icon-location").style("display", null);
    d3.select("#location-label").text(foundLocation);
  } else {
    d3.select("#icon-location").style("display", "none");
  }
}

function resetIconPanel() {
  // person stays visible; hide everything else
  d3.select("#icon-person").style("display", null);
  d3.select("#icon-helmet").style("display", "none");
  d3.select("#icon-scooter").style("display", "none");
  d3.select("#icon-bike").style("display", "none");
  d3.select("#icon-weather").style("display", "none");
  d3.select("#weather-rain").style("display", "none");
  d3.select("#weather-sun").style("display", "none");
  d3.select("#icon-speed").style("display", "none");
  d3.select("#speed-needle").attr("transform", "rotate(20,48,60)");
  d3.select("#icon-location").style("display", "none");
}

function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    // Use pipe | as separator instead of dash -
    var parts = sequence.split("|");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
 	var foundChild = false;
 	for (var k = 0; k < children.length; k++) {
 	  if (children[k]["name"] == nodeName) {
 	    childNode = children[k];
 	    foundChild = true;
 	    break;
 	  }
 	}
  // If we don't already have a child node for this branch, create it.
 	if (!foundChild) {
 	  childNode = {"name": nodeName, "children": []};
 	  children.push(childNode);
 	}
 	currentNode = childNode;
      } else {
 	// Reached the end of the sequence; create a leaf node.
 	childNode = {"name": nodeName, "size": size};
 	children.push(childNode);
      }
    }
  }
  return root;
};