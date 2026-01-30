import { createTheme } from '@mantine/core';
import { Group, Stack } from '@mantine/core';

const solid = (hex: string) =>
  [hex, hex, hex, hex, hex, hex, hex, hex, hex, hex] as const;

export const theme = createTheme({
  components: {
    Group: Group.extend({
      defaultProps: {
        gap: 'xs'
      }
    }),
    Stack: Stack.extend({
      defaultProps: {
        gap: 'xs'
      }
    })
  },
  colors: {
    appDeepTeal: solid('#053f3f'),
    appSoftWhite: solid('#ffffff'),
    appTealBlue: solid('#056672'),
    appMintTeal: solid('#8FCFC0'),
    appCyanLight: solid('#e0f7fa'),
    appPinkLight: solid('#fce4ec')
  }
});
