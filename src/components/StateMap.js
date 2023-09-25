import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function getStateGeoJSONPath(stateName) {
    if (!stateName) {
        console.warn("getStateGeoJSONPath was called with an undefined or null stateName.");
        return '';
    }
    return `/${stateName.replace(/\s+/g, '_').toLowerCase()}.geojson`;
}


const StateMap = ({ stateName }) => {
    const svgRef = useRef(null);
    const [currentHeading, setCurrentHeading] = React.useState("Select a LGA");
    const offsetY = 150; 

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const width = 800;
        const height = 800;
        const projection = d3.geoMercator()
        .translate([width / 2, (height / 2) - offsetY]);

        const path = d3.geoPath().projection(projection);
        const colorScale = d3.scaleThreshold()
            .domain([1, 10, 20, 30])
            .range(["#878787", "#658565", "#4E844E", "#288228", "#008000"]);

        const stateGeoJSONPath = getStateGeoJSONPath(stateName);

        const fetchData = async () => {
            try {
                const geoData = await d3.json(stateGeoJSONPath);
                const bounds = path.bounds(geoData);
                const centroid = d3.geoCentroid(geoData);
                const dx = bounds[1][0] - bounds[0][0];
                const dy = bounds[1][1] - bounds[0][1];
                const scale = 0.1 / Math.max(dx / width, dy / height) * width;
                projection.scale(scale).center(centroid);

                const serviceData = await d3.csv("/service_providers.csv");
                geoData.features.forEach(geoFeature => {
                    const serviceFeature = serviceData.find(s => s.lga_name === geoFeature.properties.lga_name);
                    if (serviceFeature) {
                        geoFeature.properties.currentValue = +serviceFeature.lga_name;
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
            <div className='map_position'>
            <svg ref={svgRef} width={800} height={800}></svg>
            </div>
            <h2 className="custom-underline">{currentHeading}</h2>
        </div>
    );
};

export default StateMap;