import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LgaMap = ({ lgaName }) => {
    const svgRef = useRef(null);
    const [currentHeading, setCurrentHeading] = React.useState("Select a LGA");
    const [lgaData, setLgaData] = React.useState(null);

    useEffect(() => {
        d3.json("/lgas.geojson").then(data => {
            const specificLGAData = data.features.filter(
                feature => feature.properties.lga_name === lgaName
            );

            if (specificLGAData.length > 0) {
                setLgaData({
                    type: "FeatureCollection",
                    features: specificLGAData
                });
            }
        }).catch(error => {
            console.error("Failed to load LGA GeoJSON data", error);
        });
    }, [lgaName]);

    useEffect(() => {
        if (lgaData) {
            const svg = d3.select(svgRef.current);

            // Calculate the centroid of the LGA
            const centroid = d3.geoCentroid(lgaData);

            const projection = d3.geoMercator()
                .scale(8000) 
                .center(centroid) 
                .translate([800 / 2, 800 / 2]);

            const path = d3.geoPath().projection(projection);

            const colorScale = d3.scaleThreshold()
                .domain([1, 10, 20, 30])
                .range(["#878787", "#658565", "#4E844E", "#288228", "#008000"]);

            // Clear previous drawings
            svg.selectAll("*").remove();

            // Draw the LGA
            svg.append("g")
                .selectAll("path")
                .data(lgaData.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", d => {
                    // Replace 'someProperty' with the actual property name from your data
                    const value = d.properties.serviceProvider; 
                    return colorScale(value);
                })
                .attr("stroke", "#FFFFFF")
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("fill", "#B11B10");
                    setCurrentHeading(d.properties.lga_name);
                })
                .on("mouseout", function(event, d) {
                    d3.select(this).attr("fill", colorScale(d.properties.serviceProvider));
                });
        }
    }, [lgaData]);

    return (
        <div className="lga-map">
            <svg ref={svgRef} width={800} height={800}></svg>
            <h2 className="custom-underline">{currentHeading}</h2>
        </div>
    );
};

export default LgaMap;
