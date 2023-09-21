import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';


const NationalMap = () => {
  const svgRef = useRef(null);

  const [currentHeading, setCurrentHeading] = React.useState("NIGERIA");

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

      function updateVisualization(currentFilter) {
        Promise.all([
            d3.json("/nigeria_geojson.geojson"),
            d3.csv("/service_providers.csv")
        ]).then(([geoData, serviceData]) => {
          geoData.features.forEach(geoFeature => {
            const serviceFeature = serviceData.find(s => s.state === geoFeature.properties.state);
            if (serviceFeature) {
              geoFeature.properties.currentValue = +serviceFeature[currentFilter];
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
                console.error(`Missing value for state: ${d.properties.state} and filter: ${currentFilter}`);
                return "#878787";  
              }
              return colorScale(value);
            })
            .attr("stroke", "#FFFFFF")
            .on("mouseover", function(event, d) {
              d3.select(this).attr("fill", "#B11B10");
              setCurrentHeading(d.properties.state);
            })
            .on("mouseout", function(event, d) {
              d3.select(this).attr("fill", colorScale(d.properties.currentValue));
              setCurrentHeading("NIGERIA");


            })
            .on("click", function(event, d) {
                const stateURL = `/state/${d.properties.state.toLowerCase()}`;
                window.location.href = stateURL;
            });
            
          
        }).catch(error => {
          console.log("Error loading file:", error);
        });
    }

    
    updateVisualization("state");

  }, []);  

  return (
    <div className="national-map">
      <svg ref={svgRef} width={800} height={800}></svg>
      <h2 className="custom-underline">{currentHeading}</h2>
 {/* You'll replace this with dynamic text if you implement the state suggestion above */}
    </div>
  );
};

export default NationalMap;
