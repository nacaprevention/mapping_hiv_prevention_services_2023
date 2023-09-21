import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';


function getStateGeoJSONPath(stateName) {
    // Convert spaces to underscores
    return `/${stateName.replace(/\s+/g, '_').toLowerCase()}.geojson`;
}

const StateMap = ({ stateName }) => {
    const svgRef = useRef(null);
    const [currentHeading, setCurrentHeading] = React.useState("Select a LGA");

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const projection = d3.geoMercator()
            .scale(3500)
            .center([8.6753, 9.0820])
            .translate([800 / 2, 800 / 2]);

        const path = d3.geoPath().projection(projection);

        const colorScale = d3.scaleThreshold()
            .domain([1, 10, 20, 30])
            .range(["#878787", "#658565", "#4E844E", "#288228", "#008000"]);

        const stateGeoJSONPath = getStateGeoJSONPath(stateName);

        const fetchData = async () => {
            try {
                const geoData = await d3.json(stateGeoJSONPath);
                const serviceData = await d3.csv("/service_providers.csv");

                geoData.features.forEach(geoFeature => {
                    const serviceFeature = serviceData.find(s => s.lga_name === geoFeature.properties.lga_name);
                    if (serviceFeature) {
                        geoFeature.properties.currentValue = +serviceFeature.lga_name;  // I assume this should be lga_name, please adjust if needed.
                    }
                });

                svg.selectAll("path").remove();

                svg.append("g")
                    .selectAll("path")
                    .data(geoData.features)
                    .enter().append("path")
                    .attr("d", path)
                    .attr("fill", d => {
                        const value = d.properties.currentValue;
                        if (value === undefined) {
                            console.error(`Missing value for lga: ${d.properties.lga_name}`);
                            return "#878787";
                        }
                        return colorScale(value);
                    })
                    .attr("stroke", "#FFFFFF")
                    .on("mouseover", function (event, d) {
                        d3.select(this).attr("fill", "#B11B10");
                        setCurrentHeading(d.properties.lga_name);
                    })
                    .on("mouseout", function (event, d) {
                        d3.select(this).attr("fill", colorScale(d.properties.currentValue));
                        setCurrentHeading(stateName);
                    })
                    .on("click", function (event, d) {
                        console.log(`You clicked on ${d.properties.lga_name}`);
                        const lgaURL = `/state/${stateName.toLowerCase()}/${d.properties.lga_name.toLowerCase()}`;
                        window.location.href = lgaURL;
                    });
            } catch (error) {
                console.log(`Failed loading data for state ${stateName}.`, error);
            }
        };

        fetchData();
    }, [stateName]);

    return (
        <div className="state-map">
            <svg ref={svgRef} width={800} height={800}></svg>
            <h2 className="custom-underline">{currentHeading}</h2>
        </div>
    );
};

export default StateMap;
