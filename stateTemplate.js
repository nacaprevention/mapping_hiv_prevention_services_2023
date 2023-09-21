// src/templates/stateTemplate.js
import React from 'react';
import { graphql } from 'gatsby';

export const query = graphql`
  query($state: String!) {
    serviceProvidersCsv(state: { eq: $state }) {
      state
    }
  }
`;

const StateTemplate = ({ data }) => (
  <div>
    <h1>{data.serviceProvidersCsv.state}</h1>
    {/* Render other data fields as necessary */}
  </div>
);

export default StateTemplate;
