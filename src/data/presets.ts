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
        type: 'classy'
      },
      backgroundOptions: {
        color: '#f8fafc'
      }
    }
  }
];