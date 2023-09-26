import React, { useEffect, useState, useRef} from 'react';
import * as d3 from 'd3';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import logo from '../images/NACA.png';  
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { navigate } from 'gatsby';
import { Link } from "gatsby";



const states = [
  "All States","Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", 
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
        .domain([1, 6, 11, 21, 31]) 
        .range(["#76ff0d", "#a0d492", "#78b971", "#60a455", "#3e8d00", "#008000"]);
      
    // Add #D3D3D3 (light grey) for the value 0    

          const serviceToColumnMap = {
            "All Services": "serviceProviders",
            "Condom Distribtion": "CondomDistribution",
            "Family Life and HIV/AIDS Education (FLHE)/Sexuality Education": "FamilyLifeAndHivAidsEducationFlheSexualityEducation",
            "Gender and Human Rights (GHR)": "GenderAndHumanRightsGhr",
            "Harm Reduction: Medication-Assisted Treatment (MAT)": "HarmReductionMedicationAssistedTreatmentMat",
            "Harm Reduction: Needle and Syringe Exchange": "HarmReductionNeedleAndSyringeExchange",
            "HIV Self-Testing (HIVST)": "HivSelfTestingHivst",
            "HIV Testing Services (HTS)": "HivTestingServicesHts",
            "Mental Health Services": "MentalHealthServices",
            "Pre-Exposure Prophylaxis (PrEP)": "PreExposureProphylaxisPrep",
            "Social and Behaviour Change Communication (SBCC)": "SocialAndBehaviourChangeCommunicationSbcc",
            "STI Screening and Treatment": "StiScreeningAndTreatment",
            "Technical Assistance (TA)": "TechnicalAssistanceTa"
          };
          
          const populationToColumnMap = {
            "All Populations": "allPopulations",
            "AGYW in school": "agywInSchool",
            "AGYW out of school": "agywOutOfSchool",
            "ABYM in school": "abymInSchool",
            "ABYM out of school": "abymOutOfSchool",
            "Children living with HIV": "childrenLivingWithHIV",
            "General population": "generalPopulation",
            "HIV-exposed infants": "hivExposedInfants",
            "IDP": "idp",
            "KP_FSW": "kpFsw",
            "KP_MSM": "kpMsm",
            "KP_people in enclosed settings": "kpPeopleInEnclosedSettings",
            "KP_PWID": "kpPwid",
            "KP_transgender": "kpTransgender",
            "OVC": "ovc",
            "Parents": "parents",
            "People living with disabilities": "peopleLivingWithDisabilities",
            "PLHIV": "plhiv",
            "Serodiscordant couples": "serodiscordantCouples",
            "Teachers": "teachers",
            "Faith Leaders": "faithLeaders",
            "Fishermen": "fishermen",
            "Pastoralists": "pastoralists",
            "Transport Workers": "transportWorkers"
           }

           const locationToColumnMap = {
            "All Locations": "allLocations",
            "Community": "community",
            "Facility": "facility"
           }

           
          // Then, in your updateVisualization function:
          function updateVisualization() {
            let currentFilter = 'serviceProviders';
          
            if (selectedService !== services[0]) {
              currentFilter = serviceToColumnMap[selectedService] || selectedService;
            } else if (selectedPopulation !== populations[0]) {
              currentFilter = populationToColumnMap[selectedPopulation] || selectedPopulation; // Assuming you create a similar mapping for populations
            } else if (selectedLocation !== locations[0]) {
              currentFilter = locationToColumnMap[selectedLocation] || selectedLocation; // Assuming you create a similar mapping for locations
            }
          
        Promise.all([
            d3.json("/nigeria_geojson.geojson"),
            d3.csv("/stateData.csv")
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
              if (value === 0) {
                  return "#D3D3D3"; // return grey if the value is 0
              }
              return colorScale(value);
          })          
          
            .attr("stroke", "#FFFFFF")
            .on("mouseover", function(event, d) {
              d3.select(this).attr("fill", "#B11B10");
              setCurrentHeading(d.properties.state);
            })
            .on("mouseout", function(event, d) {
              const value = d.properties.currentValue;
              if (value === 0) {
                  d3.select(this).attr("fill", "#D3D3D3"); // return grey if the value is 0
              } else {
                  d3.select(this).attr("fill", colorScale(value));
              }
              setCurrentHeading("NIGERIA");
          })
          
            .on("click", function(event, d) {
                const stateURL = `/state/${d.properties.state.toLowerCase().replace(/\s+/g, '-')}`;
                window.location.href = stateURL;
            });
            
      const legendWidth = 40;
      const legendHeight = 20;

      // Calculate translation for legend to be positioned bottom-right
      const translateX = 650;  // 800 - 100 (legend total width with some padding)
      const translateY = 500;  // 800 - 200 (considering 5 blocks of color and some padding)

      // Create a group for the legend
      const legend = svg.append("g")
        .attr("transform", `translate(${translateX},${translateY})`);

        let legendData = colorScale.domain().map(lowerBound => {
          return [lowerBound, colorScale.invertExtent(colorScale(lowerBound))[1]];
      });
      
      // Filter out duplicates, based on the first element of each tuple
      legendData = legendData.filter((value, index, self) => 
          self.findIndex(v => v[0] === value[0]) === index);
      
      // Add the "No data" category at the start
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
          if (d[0] === 0) return "#D3D3D3";  // Explicitly return grey if the range is [0,0]
          return colorScale(d[0]);
        });    

        legendGroups.append("text")
        .attr("x", legendWidth + 5)
        .attr("y", legendHeight / 2)
        .attr("dy", "0.35em")
        .attr("font-size", "12px")
        .attr("font-family", "'Lato', sans-serif") 
        .text(d => {
          if (d[0] === 0) return `0`; 
          if (d[0] > 30) return 'Above 30';
          return `${d[0]} - ${d[1] - 1}`;
      });
      
        })
        
        
        .catch(error => {
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
                  <Dropdown.Item 
                  key={state} 
                  onClick={() => {
                    setSelectedState(state);
                    navigate(`/state/${state.toLowerCase().replace(/\s+/g, '-')}`); // LGA page navigation
                  }}>
                    {state}
                  </Dropdown.Item>
              ))}
          </DropdownButton>

<h3>Service</h3>
<DropdownButton id="dropdown-basic-button_filter_service" title={selectedService} 
className={`scrollable-dropdown ${selectedService !== services[0] ? 'non-default-service' : ''}`}>
  {services.map(service => (
    <Dropdown.Item 
      key={service} 
      onClick={() => {
        setSelectedService(service); 
        setSelectedPopulation(populations[0]); // Resetting Population dropdown
        setSelectedLocation(locations[0]);     // Resetting Location dropdown
      }}>
      {service}
    </Dropdown.Item>
  ))}
</DropdownButton>


<h3> Target Population</h3>
<DropdownButton id="dropdown-basic-button_filter_population" title={selectedPopulation} 
    className={`scrollable-dropdown ${selectedPopulation !== populations[0] ? 'non-default-population' : ''}`}
    >
  {populations.map(population => (
    <Dropdown.Item 
      key={population} 
      onClick={() => {
        setSelectedPopulation(population);
        setSelectedService(services[0]);   // Resetting Service dropdown
        setSelectedLocation(locations[0]); // Resetting Location dropdown
      }}>
      {population}
    </Dropdown.Item>
  ))}
</DropdownButton>


<h3> Location</h3>
<DropdownButton id="dropdown-basic-button_filter_location" title={selectedLocation}    
    className={`scrollable-dropdown ${selectedLocation !== locations[0] ? 'non-default-location' : ''}`}
    >
  {locations.map(location => (
    <Dropdown.Item 
      key={location} 
      onClick={() => {
        setSelectedLocation(location);
        setSelectedService(services[0]);       // Resetting Service dropdown
        setSelectedPopulation(populations[0]); // Resetting Population dropdown
      }}>
      {location}
    </Dropdown.Item>
  ))}
</DropdownButton>

      <Link className="link" to="/SubmissionStatus"> View submission status</Link>
        </Col>
      </Row>
    </Container>
    
  </div>
  );
  
            }
export default NationalMap; 