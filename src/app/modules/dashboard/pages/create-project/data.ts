import { ColorModel, TypographyModel } from '../../models/brand-identity.model';
import { LogoModel } from '../../models/logo.model';

export class VisualIdentityData {
  static logos: LogoModel[] = [
    {
      id: 'logo1',
      name: 'Logo 1',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" fill="#3498db"/>
        <circle cx="50" cy="50" r="30" fill="#ffffff"/>
        <path d="M35 50 L65 50" stroke="#3498db" stroke-width="5"/>
      </svg>`,
      concept: 'Modern Minimalist',
      colors: ['#3498db', '#ffffff'],
      fonts: [],
    },
    {
      id: 'logo2',
      name: 'Logo 2',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <polygon points="50,10 90,90 10,90" fill="#e74c3c"/>
        <circle cx="50" cy="50" r="15" fill="#ffffff"/>
      </svg>`,
      concept: 'Modern Minimalist',
      colors: ['#e74c3c', '#ffffff'],
      fonts: [],
    },
    {
      id: 'logo3',
      name: 'Logo 3',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <rect width="100" height="100" fill="#2c3e50"/>
        <circle cx="30" cy="30" r="15" fill="#27ae60"/>
        <circle cx="70" cy="70" r="15" fill="#27ae60"/>
        <line x1="30" y1="30" x2="70" y2="70" stroke="#27ae60" stroke-width="5"/>
      </svg>`,
      concept: 'Modern Minimalist',
      colors: ['#2c3e50', '#27ae60'],
      fonts: [],
    },
    {
      id: 'logo5',
      name: 'Logo 5',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8e44ad;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f1c40f;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#grad)"/>
        <text x="50" y="55" font-family="Arial" font-size="24" text-anchor="middle" fill="#ffffff">L</text>
      </svg>`,
      concept: 'Modern Minimalist',
      colors: ['#8e44ad', '#f1c40f'],
      fonts: [],
    },
    {
      id: 'logo4',
      name: 'Logo 4',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8e44ad;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f1c40f;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#grad)"/>
        <text x="50" y="55" font-family="Arial" font-size="24" text-anchor="middle" fill="#ffffff">L</text>
      </svg>`,
      concept: 'Modern Minimalist',
      colors: ['#8e44ad', '#f1c40f'],
      fonts: [],
    },
  ];

  static colorPalettes: ColorModel[] = [
    {
      id: 'palette1',
      name: 'Modern Blue',
      url: 'https://via.placeholder.com/300/3498db/FFFFFF?text=Blue+Palette',
      colors: {
        primary: '#3498db',
        secondary: '#2980b9',
        accent: '#e74c3c',
        background: '#ecf0f1',
        text: '#2c3e50',
      },
    },
    {
      id: 'palette2',
      name: 'Earthy Tones',
      url: 'https://via.placeholder.com/300/27ae60/FFFFFF?text=Earthy+Palette',
      colors: {
        primary: '#27ae60',
        secondary: '#2ecc71',
        accent: '#f39c12',
        background: '#f5f5f5',
        text: '#333333',
      },
    },
    {
      id: 'palette3',
      name: 'Dark Mode',
      url: 'https://via.placeholder.com/300/2c3e50/FFFFFF?text=Dark+Palette',
      colors: {
        primary: '#2c3e50',
        secondary: '#34495e',
        accent: '#e74c3c',
        background: '#1a1a1a',
        text: '#ecf0f1',
      },
    },
    {
      id: 'palette4',
      name: 'Vibrant',
      url: 'https://via.placeholder.com/300/9b59b6/FFFFFF?text=Vibrant+Palette',
      colors: {
        primary: '#9b59b6',
        secondary: '#8e44ad',
        accent: '#f1c40f',
        background: '#ffffff',
        text: '#34495e',
      },
    },
  ];

  static typographyOptions: TypographyModel[] = [
    {
      id: 'typo1',
      name: 'Modern Sans',
      url: 'https://via.placeholder.com/300/cccccc/333333?text=Sans+Serif',
      primaryFont: 'Inter',
      secondaryFont: 'Roboto',
    },
    {
      id: 'typo2',
      name: 'Classic Serif',
      url: 'https://via.placeholder.com/300/cccccc/333333?text=Serif',
      primaryFont: 'Playfair Display',
      secondaryFont: 'Merriweather',
    },
    {
      id: 'typo3',
      name: 'Tech Monospace',
      url: 'https://via.placeholder.com/300/cccccc/333333?text=Monospace',
      primaryFont: 'JetBrains Mono',
      secondaryFont: 'Roboto Mono',
    },
    {
      id: 'typo4',
      name: 'Playful Mix',
      url: 'https://via.placeholder.com/300/cccccc/333333?text=Mixed+Fonts',
      primaryFont: 'Poppins',
      secondaryFont: 'Nunito',
    },
  ];
}
