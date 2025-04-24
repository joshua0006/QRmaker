import { Preset } from '../types/qr';

export const presets: Preset[] = [
  {
    name: 'Simple',
    type: 'simple',
    options: {
      dotsOptions: {
        color: '#000000',
        type: 'square'
      },
      backgroundOptions: {
        color: '#ffffff'
      }
    }
  },
  {
    name: 'Rounded',
    type: 'rounded',
    options: {
      dotsOptions: {
        color: '#000000',
        type: 'rounded'
      },
      backgroundOptions: {
        color: '#ffffff'
      }
    }
  },
  {
    name: 'Dots',
    type: 'dots',
    options: {
      dotsOptions: {
        color: '#000000',
        type: 'dots'
      },
      backgroundOptions: {
        color: '#ffffff'
      }
    }
  },
  {
    name: 'Elegant',
    type: 'elegant',
    options: {
      dotsOptions: {
        color: '#000000',
        type: 'classy'
      },
      backgroundOptions: {
        color: '#f8fafc'
      }
    }
  }
];