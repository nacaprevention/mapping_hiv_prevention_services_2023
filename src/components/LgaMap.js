import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LgaMap = ({ lgaName, stateName }) => {
    const svgRef = useRef(null);
    const [currentHeading, setCurrentHeading] = React.useState("Select a LGA");
    const [lgaData, setLgaData] = React.useState(null);

    const stateToCodeMapping = {
        "Abia": "AB",
        "Adamawa": "AD",
        "Akwa Ibom": "AK",
        "Anambra": "AN",
        "Bauchi": "BA",
        "Bayelsa": "BY",
        "Benue": "BE",
        "Borno": "BR",
        "Cross River": "CR",
        "Delta": "DE",
        "Ebonyi": "EB",
        "Edo": "ED",
        "Ekiti": "EK",
        "Enugu": "EN",
        "Federal Capital Territory": "FC",
        "Gombe": "GO",
        "Imo": "IM",
        "Jigawa": "JI",
        "Kaduna": "KD",
        "Kano": "KN",
        "Katsina": "KT",
        "Kebbi": "KB",
        "Kogi": "KO",
        "Kwara": "KW",
        "Lagos": "LA",
        "Nasarawa": "NA",
        "Niger": "NI",
        "Ogun": "OG",
        "Ondo": "ON",
        "Osun": "OS",
        "Oyo": "OY",
        "Plateau": "PL",
        "Rivers": "RI",
        "Sokoto": "SO",
        "Taraba": "TA",
        "Yobe": "YO",
        "Zamfara": "ZA",
    };

    const stateCode = stateToCodeMapping[stateName];
    console.log("lgaName:", lgaName);
console.log("stateName:", stateName);


    useEffect(() => {
        if (!stateCode) {
            console.error(`No state code found for state: ${stateName}`);
            return;
        }

        d3.json("/lgas.geojson").then(data => {
            console.log("Loaded GeoJSON data:", data);
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
    }, [lgaName, stateName, stateCode]);

    useEffect(() => {
        if (lgaData && stateCode) {
            const svg = d3.select(svgRef.current);
            const centroid = d3.geoCentroid(lgaData);
            const projection = d3.geoMercator().scale(18500).center(centroid).translate([800 / 2, 800 / 2]);
            const path = d3.geoPath().projection(projection);

            svg.selectAll("*").remove();
            svg.append("g").selectAll("path").data(lgaData.features).enter().append("path")
                .attr("d", path).attr("fill", "#4E844E")
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("fill", "#B11B10");
                    setCurrentHeading(d.properties.lga_name);
                })
                .on("mouseout", function(event, d) {
                    d3.select(this).attr("fill", "#4E844E");
                    setCurrentHeading("Select a LGA");
                });
        }
    }, [lgaData, stateCode]);

    return (
        <div className="lga-map">
            <svg ref={svgRef} width={800} height={800}></svg>
            <h2 className="custom-underline">{currentHeading}</h2>
        </div>
    );
};

export default LgaMap;