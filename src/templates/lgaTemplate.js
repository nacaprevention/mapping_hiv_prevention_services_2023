import React, { useState } from 'react';
import { graphql } from 'gatsby';
import LgaMap from '../components/LgaMap';
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
query($state: String!, $lga: String!) {
  serviceProvidersCsv(state: { eq: $state }, lga_name: { eq: $lga }) {
    state
    lga_name
    serviceProviders
    CondomDistribution  
  }
}
`;

const LgaTemplate = ({ data }) => {
  // Existing variables and state definitions
  const lgaData = Array.isArray(data.serviceProvidersCsv) ? data.serviceProvidersCsv[0] : data.serviceProvidersCsv;
  const [currentHeading, setCurrentHeading] = useState(lgaData.lga_name || "N/A");
  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedPopulation, setSelectedPopulation] = useState(populations[0]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const lgaDetails = data.serviceProvidersCsv;

  return (
    <div className="state-map">
        <div className="header-container">
            <img src={logo} alt="NACA Logo" className="logo" />
            <span className="welcome-text">Mapping HIV Prevention Services, 2023</span>
            <span className="separator"> - </span>
            <span className="current-heading">{currentHeading}</span>
        </div>

        <div className="lga-page">
            <h1>{lgaData.lga_name}</h1>
            <h2>{lgaData.state}</h2>
            <p>No. of Service Providers: {lgaData.serviceProviders}</p>
            <p>Number of Service Providers involved in Condom Distribution: {lgaData.CondomDistribution}</p>
        </div>

      <Container>
        <Row className='row'>
          <Col sm={8}>
            <LgaMap lgaName={lgaData.lga_name} stateName={lgaData.state} />
          </Col>
          <Col sm={4}>
            <h2>Filter by:</h2>
            <h3>Service</h3>
            <DropdownButton id="dropdown-basic-button_filter_service" title={selectedService}>
              {services.map(service => (
                <Dropdown.Item key={service} onClick={() => setSelectedService(service)}>
                  {service}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <h3>Target Population</h3>
            <DropdownButton id="dropdown-basic-button_filter_population" title={selectedPopulation}>
              {populations.map(population => (
                <Dropdown.Item key={population} onClick={() => setSelectedPopulation(population)}>
                  {population}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <h3>Location</h3>
            <DropdownButton id="dropdown-basic-button_filter_location" title={selectedLocation}>
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

export default LgaTemplate;
