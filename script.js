// Define the dimensions and margins of the map
const width = 960;
const height = 600;

// Define the projection and path generator
const projection = d3.geoAlbersUsa().scale(1300).translate([width / 2, height / 2]);
const path = d3.geoPath().projection(projection);

// Create an SVG element to hold the map
const svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

// Define the color scale for the heatmap
const color = d3.scaleSequential(d3.interpolateReds)
    .domain([0, 100]); // Adjust domain based on your data

// Load and display the map
d3.json("https://d3js.org/us-10m.v1.json").then(us => {
    // Load the carbon emissions data
    d3.csv("carbon_emissions.csv").then(data => {
        // Create a dictionary of state emissions
        const emissions = {};
        data.forEach(d => {
            emissions[d.state] = +d.emissions;
        });

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", d => {
                const stateName = d.properties.name;
                const emission = emissions[stateName] || 0;
                return color(emission);
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5);
    });
});
