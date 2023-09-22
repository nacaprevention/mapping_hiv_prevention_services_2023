import React, { useEffect, useState, useRef} from 'react';
import * as d3 from 'd3';
import Select from 'react-select';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const states = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", 
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", 
  "Federal Capital Territory", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", 
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", 
  "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const NationalMap = () => {
    const svgRef = useRef(null);
    const [currentHeading, setCurrentHeading] = useState("NIGERIA");
    const [selectedService, setSelectedService] = useState("serviceProviders");
    const [selectedPopulation, setSelectedPopulation] = useState("allPopulations");
    const [selectedLocation, setSelectedLocation] = useState("AllLocations");

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

    
    updateVisualization(selectedService); // or use multiple parameters if needed

  }, [selectedService, selectedPopulation, selectedLocation]);

  return (
    <div className="national-map">
        <svg ref={svgRef} width={800} height={800}></svg>
        <h2 className="custom-underline">{currentHeading}</h2>

        {/* Bootstrap Dropdown Example */}
        <DropdownButton id="dropdown-basic-button" title="Select State">
   {states.map(state => (
       <Dropdown.Item key={state} href={`/state/${state.toLowerCase().replace(/\s+/g, '-')}`}>{state}</Dropdown.Item>
   ))}
</DropdownButton>

    </div>
);
}

export default NationalMap;