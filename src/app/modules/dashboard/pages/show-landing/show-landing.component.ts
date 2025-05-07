import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-show-landing',
  imports: [],
  templateUrl: './show-landing.component.html',
  styleUrl: './show-landing.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowLandingComponent { 

  redirectToReactApp() {
    // URL de votre application React
    const reactAppUrl = 'https://votre-app-react.com/generate';
    
    // Option 1: Redirection simple
    window.location.href = reactAppUrl;
    
    // Option 2: Redirection avec état (si les apps partagent un domaine parent)
    // this.router.navigateByUrl('/external-redirect', { state: { url: reactAppUrl } });
  }

  // Dans votre composant
stacks = [
  {
    id: 'react',
    name: 'React',
    icon: 'R',
    color: '#61DAFB',
    description: 'Modern React 18 + Vite template',
    badges: ['HMR', 'SEO Ready']
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: 'N',
    color: '#000000',
    description: 'Full-stack framework with RSC',
    badges: ['App Router', 'ISR']
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: 'A',
    color: '#DD0031',
    description: 'Enterprise-grade framework',
    badges: ['SSR', 'Standalone']
  },
  {
    id: 'vue',
    name: 'Vue',
    icon: 'V',
    color: '#42b883',
    description: 'Progressive framework',
    badges: ['Composition API', 'Pinia']
  },
  {
    id: 'astro',
    name: 'Astro',
    icon: 'A',
    color: '#FF5D01',
    description: 'Island architecture',
    badges: ['MPA', '0JS']
  },
  {
    id: 'html',
    name: 'HTML/CSS',
    icon: 'H',
    color: '#E44D26',
    description: 'Vanilla with Tailwind',
    badges: ['Lightweight']
  }
];

selectedStackId: string | null = null;

selectStack(id: string) {
  this.selectedStackId = this.selectedStackId === id ? null : id;
}

// Dans votre composant
pageOptions = [
  {
    id: 'seo',
    name: 'SEO Optimization',
    icon: '🔍',
    description: 'Pre-configured meta tags and sitemap',
    features: ['Meta Tags', 'JSON-LD', 'Sitemap'],
    enabled: true
  },
  {
    id: 'contact',
    name: 'Contact Form',
    icon: '✉️',
    description: 'Embedded form with submission handling',
    features: ['Netlify', 'Recaptcha', 'Email Notifications'],
    enabled: false
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: '📊',
    description: 'Integrated tracking and metrics',
    features: ['Google Analytics', 'Hotjar', 'Fathom'],
    enabled: true
  },
  {
    id: 'i18n',
    name: 'Multilingual',
    icon: '🌐',
    description: 'Multi-language support',
    features: ['i18n', 'Language Switcher'],
    enabled: false
  },
  {
    id: 'performance',
    name: 'Performance',
    icon: '⚡',
    description: 'Optimized loading strategy',
    features: ['Lazy Loading', 'Image Optimization', 'Critical CSS'],
    enabled: true
  }
];
hoveredOption: string | null = null;


toggleOption(id: string) {
  const option = this.pageOptions.find(o => o.id === id);
  if (option) {
    option.enabled = !option.enabled;
  }
}
}
