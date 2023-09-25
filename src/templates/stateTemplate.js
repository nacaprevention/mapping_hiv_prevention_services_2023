import React from 'react';
import { graphql } from 'gatsby';
import StateMap from '../components/StateMap';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from '../images/NACA.png';
import { navigate } from 'gatsby';


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


export const query = graphql`
  query($state: String!) {
    allServiceProvidersCsv(filter: { state: { eq: $state } }) {
      nodes {
        state
        lga_name
      }
    }
  }
`;



const StateTemplate = ({ data }) => {
  const stateName = data.allServiceProvidersCsv.nodes[0]?.state;
  console.log("State Name in StateTemplate:", stateName);
  const [selectedService, setSelectedService] = React.useState(services[0]);
  const [selectedPopulation, setSelectedPopulation] = React.useState(populations[0]);
  const [selectedLocation, setSelectedLocation] = React.useState(locations[0]);
  const [selectedLGA, setSelectedLGA] = React.useState("All LGAs");


  return (
    <div className="state-map">
      <div className="header-container">
        <img src={logo} alt="NACA Logo" className="logo" />
        <span className="welcome-text">Mapping HIV Prevention Services, 2023</span>
        <span className="separator"> - </span>
        <span className="current-heading">{stateName}</span>
      </div>

      <Container>
        <Row className='row'>
          <Col sm={8}>
          <StateMap stateName={stateName} />
          </Col>
          <Col sm={4}>
            <h2>Filter by:</h2>
            <h3>LGA</h3>
            <DropdownButton id="dropdown-basic-button_filter_lga" title={selectedLGA}>
  <Dropdown.Item key="All LGAs" onClick={() => setSelectedLGA("All LGAs")}>
    All LGAs
  </Dropdown.Item>
  {data.allServiceProvidersCsv.nodes.map(node => (
    <Dropdown.Item 
      key={node.lga_name} 
      onClick={() => {
        setSelectedLGA(node.lga_name);
        navigate(`/state/${stateName.toLowerCase()}/${node.lga_name.toLowerCase().replace(/\s+/g, '-')}/`); // LGA page navigation
      }}>
      {node.lga_name}
    </Dropdown.Item>
  ))}
</DropdownButton>


            <h3>Service</h3>
            <DropdownButton id="dropdown-basic-button_filter_service" title={selectedService} className="scrollable-dropdown">
              {services.map(service => (
                <Dropdown.Item key={service} onClick={() => setSelectedService(service)}>
                  {service}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <h3>Target Population</h3>
            <DropdownButton id="dropdown-basic-button_filter_population" title={selectedPopulation} className="scrollable-dropdown">
              {populations.map(population => (
                <Dropdown.Item key={population} onClick={() => setSelectedPopulation(population)}>
                  {population}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <h3>Location</h3>
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
};

export default StateTemplate;