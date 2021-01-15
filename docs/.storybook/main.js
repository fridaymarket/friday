const path = require("path");


module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../../packages/friday-hooks/src/**/*.stories.mdx",
    "../../packages/friday-components/src/**/*.stories.mdx"
  ],
  typescript: {
    check: false
  },
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: "@storybook/preset-ant-design",
    }
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.performance = {
      
      hints: "warning", 

      maxAssetSize: 300000, 

      maxEntrypointSize: 500000,
    }
    
    return config;
  },
}
