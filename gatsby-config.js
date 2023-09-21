/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Mapping HIV Prevention Services, Nigeria, 2023`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/static/`, // Use __dirname to get an absolute path to the directory where gatsby-config.js exists
      },
    },
    `gatsby-transformer-csv`,
    // ... other plugins
  ],
};
