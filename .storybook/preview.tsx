import type { Preview } from '@storybook/react-vite'
import { useEffect } from 'react'

import '../src/tokens/tokens.css'

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Omnitaki DS theme (Semantic mode)',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light'
      useEffect(() => {
        const root = document.documentElement
        root.dataset.theme = theme
        document.body.style.background = 'var(--ot-color-bg-primary)'
        document.body.style.color = 'var(--ot-color-text-primary)'
      }, [theme])
      return <Story />
    },
  ],

  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
