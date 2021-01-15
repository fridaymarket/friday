import React from 'react'
import anysort from 'anysort'
import theme from './theme'
import { axiosService, httpAxios, AsyncRequestProvider} from '@friday/async'

export const decorators = [
  (Story) => {
    const axiosInstance = httpAxios({
      baseURL: 'http://10.2.32.178:3000/mock/40/friday',
    })
    return  (
      <AsyncRequestProvider value={{
        axiosInstance,
        fetcher: (params) => axiosInstance(params)
      }}>
        <Story />
      </AsyncRequestProvider>
    ) 
  } 
]

export const parameters = {
  viewMode: 'docs',
  actions: { argTypesRegex: "^on[A-Z].*" },
  previewTabs: { 'storybook/docs/panel': { index: -1 } },
  options: {
    theme: theme,
    showRoots: false,
    storySort: (previous, next) => {
      const [previousStory, previousMeta] = previous
      const [nextStory, nextMeta] = next

      return anysort(previousMeta.kind, nextMeta.kind, [
        'Overview/Introduction',
        'Overview/Getting Started',
        'Overview/入门课',
        'Overview/数据流',
        'Overview/**',
        'Documentation/Friday Core',
        'Documentation/Friday Router',
        'Documentation/Friday Async',
        'Documentation/**',
        'Hooks/index 简述',
        'Hooks/**',
        'Components/index 简述',
        'Components/**',
        'Components/更新日志',
        'Helper/**',
        'Development/*',
        'Troubleshooting/*',
      ])
    }
  },
  docs: {
    inlineStories: true
  }
}
