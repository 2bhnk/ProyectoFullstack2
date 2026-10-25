module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'vite'],
    plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-vite'],
    files: [{ pattern: 'src/**/*.test.jsx', type: 'module', watched: false }],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    vite: { config: {} }
  });
};