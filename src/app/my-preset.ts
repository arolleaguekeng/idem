//mypreset.ts
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        formField: {
          hoverBorderColor: '{primary.color}',
          backgroundColor: 'red',
          color: 'red',
        },
      },
      dark: {
        formField: {
          hoverBorderColor: '{primary.color}',
          backgroundColor: 'red',
          color: 'red',
        },
      },
    },
  },
});
