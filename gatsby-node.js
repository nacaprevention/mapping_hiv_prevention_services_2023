const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;
  
    const result = await graphql(`
      {
        allServiceProvidersCsv {
          nodes {
            state
            lga_name
          }
        }
      }
    `);
  
    if (result.errors) {
        console.error("Error retrieving data from GraphQL:", result.errors);
        return;
    }

    const stateTemplate = path.resolve(`src/templates/stateTemplate.js`);
    const lgaTemplate = path.resolve(`src/templates/lgaTemplate.js`);

    // Unique set to track which states we've already created pages for
    const createdStates = new Set();

    result.data.allServiceProvidersCsv.nodes.forEach(node => {
        // Create state pages only once per unique state
        if (!createdStates.has(node.state)) {
            createPage({
                path: `/state/${node.state.toLowerCase().replace(/\s+/g, '-')}`, // Added hyphen replacement for state
                component: stateTemplate,
                context: {
                    state: node.state,
                },
            });
            createdStates.add(node.state);
        }

        // Create LGA pages
        createPage({
            path: `/state/${node.state.toLowerCase().replace(/\s+/g, '-')}/${node.lga_name.toLowerCase().replace(/\s+/g, '-')}`,
            component: lgaTemplate,
            context: {
                state: node.state,
                lga: node.lga_name,
            },
        });
    });
};
