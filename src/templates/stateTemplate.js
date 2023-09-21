// src/templates/stateTemplate.js
import React from 'react';
import { graphql } from 'gatsby';
import StateMap from '../components/StateMap';

export const query = graphql`
  query($state: String!) {
    serviceProvidersCsv(state: { eq: $state }) {
      state
    }
  }
`;

const StateTemplate = ({ data }) => {
  const stateName = data.serviceProvidersCsv.state;

  return (
    <div>
      <h1>{stateName}</h1>
      <StateMap stateName={stateName} />
    </div>
  );
};

export default StateTemplate;
