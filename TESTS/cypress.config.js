const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '3ee4m3',
  e2e: {
    baseUrl: 'https://proyecto-fin-de-curso-taller-de-proyectos-2-nu.vercel.app',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalStudio: true    
  },
});
