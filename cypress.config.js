const { defineConfig } = require('cypress')

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'Automation Exercise - XPath',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true
  },
  viewportWidth: 1366,
  viewportHeight: 768,
  defaultCommandTimeout: 10000,
  retries: {
    runMode: 1,
    openMode: 0
  },
  // Anúncios do Google deixam o site lento e abrem o "google_vignette" por cima da página
  blockHosts: [
    '*.googlesyndication.com',
    '*.doubleclick.net',
    '*.googleadservices.com',
    '*.google-analytics.com',
    '*.googletagmanager.com',
    '*.googletagservices.com',
    '*.adtrafficquality.google',
    '*.fundingchoicesmessages.google.com'
  ],
  e2e: {
    baseUrl: 'https://automationexercise.com',
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
      return config
    }
  }
})
