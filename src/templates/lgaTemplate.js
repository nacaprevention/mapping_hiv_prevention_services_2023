import React from 'react';
import { graphql } from 'gatsby';
import LgaMap from '../components/LgaMap';

export const query = graphql`
  query($state: String!, $lga: String!) {
    serviceProvidersCsv(state: { eq: $state }, lga_name: { eq: $lga }) {
      state
      lga_name
    }
  }
`;

const lgaTemplate = ({ data }) => { 
  // If there are multiple records, take the first one. Otherwise, use the single record.
  const lgaData = Array.isArray(data.serviceProvidersCsv) ? data.serviceProvidersCsv[0] : data.serviceProvidersCsv;

  return (
    <div>
      <h1>{lgaData.lga_name}</h1>
      <h2>{lgaData.state}</h2>
      <LgaMap lgaData={lgaData}/> 
    </div>
  );
};

export default lgaTemplate;