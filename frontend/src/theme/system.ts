import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" },
        heading: { value: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" },
      },
      radii: {
        xl: { value: '12px' },
        '2xl': { value: '16px' },
      },
    },
  },
  globalCss: {
    'html, body': {
      fontFamily: 'body',
    },
  },
})

export const system = createSystem(defaultConfig, config)
