// React imports
import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import {
    Container,
    Row,
    Col
} from 'react-bootstrap';
import logo from '../images/NACA.png';

const states = [
  "All States","Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", 
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", 
  "Federal Capital Territory", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", 
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", 
  "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const NationalMap = () => {
  const svgRef = useRef(null);
  const [currentHeading, setCurrentHeading] = useState("NIGERIA");

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const projection = d3.geoMercator()
      .scale(3500)
      .center([8.6753, 9.0820])
      .translate([800 / 2, 800 / 2]);
    const path = d3.geoPath().projection(projection);
    const colorScale = d3.scaleThreshold()
      .domain([0, 1, 2, 3]) 
      .range(["#76ff0d", "#B11B10","#FF7F00", "#ffc802", "#008000"]);
    
        Promise.all([
            d3.json("/nigeria_geojson.geojson"),
            d3.csv("/statusState.csv")
        ]).then(([geoData, serviceData]) => {
          geoData.features.forEach(geoFeature => {
            const serviceFeature = serviceData.find(s => s.state === geoFeature.properties.state);
            if (serviceFeature) {
                geoFeature.properties.currentValue = +serviceFeature.serviceProviders;
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
              if (typeof value === "undefined") return "#D3D3D3";  // Add this line
              return colorScale(value);
          })                
            .attr("stroke", "#FFFFFF")
            .on("mouseover", function(event, d) {
              d3.select(this).attr("stroke", "#000000");
                setCurrentHeading(d.properties.state);
            })
            .on("mouseout", function(event, d) {
                const value = d.properties.currentValue;
                d3.select(this).attr("stroke", "#ffffff");
                setCurrentHeading("NIGERIA");   
            });
            
        const legendWidth = 40;
        const legendHeight = 20;
        const translateX = 600;
        const translateY = 600;
        
        const legend = svg.append("g")
            .attr("transform", `translate(${translateX},${translateY})`);
        
        let legendData = colorScale.domain().map(lowerBound => {
            return [lowerBound, colorScale.invertExtent(colorScale(lowerBound))[1]];
        });
        
        legendData = legendData.filter((value, index, self) => 
            self.findIndex(v => v[0] === value[0]) === index
        );
        
        if (!legendData.some(arr => arr[0] === 0)) {
            legendData.unshift([0, 0]);
        }
        
        const legendGroups = legend.selectAll("g")
            .data(legendData)
            .enter().append("g")
            .attr("transform", (d, i) => `translate(0, ${i * legendHeight})`);
        
        legendGroups.append("rect")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .attr("fill", d => {
                if (d[0] === 0) return "#B11B10";  
                if (d[0] === 1) return "#FF7F00";
                if (d[0] === 2) return "#ffc802";
                if (d[0] === 3) return "#008000";
                return colorScale(d[0]);
            });    
        
        legendGroups.append("text")
            .attr("x", legendWidth + 5)
            .attr("y", legendHeight / 2)
            .attr("dy", "0.35em")
            .attr("font-size", "12px")
            .attr("font-family", "'Lato', sans-serif") 
            .text(d => {
                if (d[0] === 0) return `No submissions`; 
                if (d[0] === 1) return `No validations`; 
                if (d[0] === 2) return `Some validations`; 
                if (d[0] === 3) return `Completed validations`; 
                return `${d[0]} - ${d[1] - 1}`;
            });

          })
          .catch(error => {
              console.log("Error loading file:", error);
          });
      }, []);
        
  return (
    <div className="national-map">
        <div className="header-container">
        <img src={logo} alt="NACA Logo" className="logo"/>
        <span className="updateTitle">STATUS UPDATE: </span>
            <span className="welcome-text">Mapping HIV Prevention Services, 2023</span>
            <span className="separator"> - </span>
            <span className="current-heading"> {currentHeading}</span>
        </div>
        
        <div className="parent-container">
    <div className="map-component">
        <svg ref={svgRef} width={800} height={800}></svg>
    </div>
</div>

  </div>
  );
            }
export default NationalMap; 