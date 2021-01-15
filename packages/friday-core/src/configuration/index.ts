import { ConfigurationService } from './configuration.service'

export const configurationService = new ConfigurationService()

export const getConfiguration = configurationService.getConfiguration

export type { IConfigurationService, IResponseConfiguration, IConfiguration } from './configuration'

export { default as useConfiguration } from './useConfiguration'
