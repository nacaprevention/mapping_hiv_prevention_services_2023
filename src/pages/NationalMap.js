import React, { useEffect, useState, useRef} from 'react';
import * as d3 from 'd3';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import logo from '../images/NACA.png';  
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const states = [
  "NATIONAL","Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", 
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", 
  "Federal Capital Territory", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", 
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", 
  "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const services = [
  "All Services",
  "Condom Distribtion",
  "Family Life and HIV/AIDS Education (FLHE)/Sexuality Education",
  "Gender and Human Rights (GHR)",
  "Harm Reduction: Medication-Assisted Treatment (MAT)",
  "Harm Reduction: Needle and Syringe Exchange",
  "HIV Self-Testing (HIVST)",
  "HIV Testing Services (HTS)",
  "Mental Health Services",
  "Pre-Exposure Prophylaxis (PrEP)",
  "Social and Behaviour Change Communication (SBCC)",
  "STI Screening and Treatment",
  "Technical Assistance (TA)"
];

const populations = [
  "All Populations",
  "AGYW in school",
  "AGYW out of school",
  "ABYM in school",
  "ABYM out of school",
  "Children living with HIV",
  "General population",
  "HIV-exposed infants",
  "IDP",
  "KP_FSW",
  "KP_MSM",
  "KP_people in enclosed settings",
  "KP_PWID",
  "KP_transgender",
  "OVC",
  "Parents",
  "People living with disabilities",
  "PLHIV",
  "Serodiscordant couples",
  "Teachers",
  "Faith Leaders",
  "Fishermen",
  "Pastoralists",
  "Transport Workers"
];

const locations = [
  "All Locations",
  "Community",
  "Facility"
];



const NationalMap = () => {
    const svgRef = useRef(null);
    const [currentHeading, setCurrentHeading] = useState("NIGERIA");
    const [selectedService, setSelectedService] = useState(services[0]);
    const [selectedPopulation, setSelectedPopulation] = useState(populations[0]);
    const [selectedLocation, setSelectedLocation] = useState(locations[0]);
    const [selectedState, setSelectedState] = useState(states[0]);

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

          function updateVisualization() {
            // Determine the filter to use
            let currentFilter = 'serviceProviders';
            if (selectedService !== services[0] || selectedPopulation !== populations[0] || selectedLocation !== locations[0]) {
                currentFilter = selectedService;  // or other logic if you have more detailed filtering based on population and location
            }
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

    
    updateVisualization(); // or use multiple parameters if needed

  }, [selectedService, selectedPopulation, selectedLocation]);

  return (
    <div className="national-map">
        <div className="header-container">
        <img src={logo} alt="NACA Logo" className="logo"/>
            <span className="welcome-text">Mapping HIV Prevention Services, 2023</span>
            <span className="separator"> - </span>
            <span className="current-heading"> {currentHeading}</span>
        </div>
        
   <Container>
      <Row className='row'>
        <Col sm={8}>
                  <svg ref={svgRef} width={800} height={800}></svg>
          </Col>
        <Col sm={4}>
            


<h2> Filter by: </h2>

<h3>State</h3>
          {/* Bootstrap Dropdown Example */}
          <DropdownButton id="dropdown-basic-button_filter_state" title={selectedState} className="scrollable-dropdown">
              {states.map(state => (
                  <Dropdown.Item key={state} href={`/state/${state.toLowerCase().replace(/\s+/g, '-')}`}>{state}</Dropdown.Item>
              ))}
          </DropdownButton>

<h3>Service</h3>
                {/* Service Dropdown */}
                <DropdownButton id="dropdown-basic-button_filter_service" title={selectedService} className="scrollable-dropdown">
  {services.map(service => (
    <Dropdown.Item key={service} onClick={() => setSelectedService(service)}>
      {service}
    </Dropdown.Item>
  ))}
</DropdownButton>

<h3> Target Population</h3>
{/* Target Population Dropdown */}
<DropdownButton id="dropdown-basic-button_filter_population" title={selectedPopulation} className="scrollable-dropdown">
  {populations.map(population => (
    <Dropdown.Item key={population} onClick={() => setSelectedPopulation(population)}>
      {population}
    </Dropdown.Item>
  ))}
</DropdownButton>

<h3> Location</h3>
{/* Location Dropdown */}
<DropdownButton id="dropdown-basic-button_filter_location" title={selectedLocation} className="scrollable-dropdown">
  {locations.map(location => (
    <Dropdown.Item key={location} onClick={() => setSelectedLocation(location)}>
      {location}
    </Dropdown.Item>
  ))}
</DropdownButton>

        </Col>
      </Row>
    </Container>
    
  </div>
  );
  

            }
export default NationalMap; 