import { SelectItemGroup } from 'primeng/api';

export interface PhaseItem {
  label: string;
  tier: 'free' | 'standard' | 'premium'; // f, s, p
}

export interface DevelopmentPhase {
  id: string;
  label: string;
  tier: 'free' | 'standard' | 'premium'; // Niveau global de la phase
  subItems: PhaseItem[];
}
export interface SelectElement {
  name: string;
  code: string;
}

export default class CreateProjectDatas {
  static groupedTeamSizes: SelectElement[] = [
    { name: '1 personne', code: '1' },
    { name: '2-3 personnes', code: '2-3' },
    { name: '4-5 personnes', code: '4-5' },
    { name: '6-10 personnes', code: '6-10' },
    { name: '10+ personnes', code: '10+' },
  ];
  static groupedProjectTypes: SelectElement[] = [
    { name: 'Application Web', code: 'web' },
    { name: 'Application Mobile', code: 'mobile' },
    { name: 'IoT', code: 'iot' },
    { name: 'Application Desktop', code: 'desktop' },
    { name: 'API/Backend', code: 'api' },
    { name: 'IA/ML', code: 'ai' },
    { name: 'Blockchain', code: 'blockchain' },
  ];

  static groupedTargets: SelectElement[] = [
    { name: 'Entreprises', code: 'business' },
    { name: 'Étudiants', code: 'students' },
    { name: 'Grand public', code: 'general-public' },
    { name: 'Administrations', code: 'government' },
    { name: 'Professionnels de santé', code: 'healthcare' },
  ];

  static groupedScopes: SelectElement[] = [
    { name: 'Locale', code: 'local' },
    { name: 'Départementale', code: 'departmental' },
    { name: 'Régionale', code: 'regional' },
    { name: 'Nationale', code: 'national' },
    { name: 'Internationale', code: 'international' },
  ];
  static groupedBudgets: SelectElement[] = [
    { name: '< $5K', code: '0-5000' },
    { name: '$5K-$10K', code: '5000-10000' },
    { name: '$10K-$20K', code: '10000-20000' },
    { name: '$20K-$50K', code: '20000-50000' },
    { name: '$50K-$100K', code: '50000-100000' },
    { name: '> $100K', code: '100000+' },
  ];

  static phases: DevelopmentPhase[] = [
    {
      id: 'planning',
      label: 'Business plan',
      tier: 'free',
      subItems: [
        { label: 'Étude de faisabilité', tier: 'free' },
        { label: 'Analyse des risques', tier: 'standard' },
        { label: 'Objectifs SMART', tier: 'premium' },
      ],
    },

    {
      id: 'charter',
      label: 'Identité visuelle',
      tier: 'premium',
      subItems: [
        {
          label: 'Palette de couleurs',
          tier: 'free',
        },
        {
          label: 'Pack typographie',
          tier: 'standard',
        },
        {
          label: 'Kit UI complet (logos, icônes, thème front)',
          tier: 'premium',
        },
      ],
    },
    {
      id: 'design',
      label: 'Design',
      tier: 'standard',
      subItems: [
        { label: "Choix d'architecture", tier: 'free' },
        { label: 'Modélisation UML', tier: 'standard' },
        { label: 'Sélection technologique', tier: 'premium' },
      ],
    },
    {
      id: 'development',
      label: 'Development',
      tier: 'premium',
      subItems: [
        { label: 'Setup projet', tier: 'standard' },
        { label: 'Développement backend/frontend', tier: 'premium' },
        { label: 'Base de données', tier: 'premium' },
      ],
    },

    {
      id: 'landing',
      label: 'Landing Page',
      tier: 'standard',
      subItems: [
        {
          label: 'Template statique',
          tier: 'free',
        },
        {
          label: 'LP dynamique (React/Angular)',
          tier: 'standard',
        },
        {
          label: 'LP animée + analytics',
          tier: 'premium',
        },
      ],
    },
    {
      id: 'testing',
      label: 'Tests',
      tier: 'premium',
      subItems: [
        {
          label: 'Tests unitaires',
          tier: 'free',
        },
        {
          label: 'Tests d‘intégration',
          tier: 'standard',
        },
        {
          label: 'Benchmark performance',
          tier: 'premium',
        },
      ],
    },
  ];
  static groupedConstraints = [
    {
      label: 'Performance',
      value: 'performance',
      items: [
        { label: 'Temps de réponse < 2s', value: 'fast_response' },
        { label: 'Charge > 10k utilisateurs simultanés', value: 'high_load' },
        { label: 'Optimisation des requêtes DB', value: 'db_optimization' },
        { label: 'Cache stratégique', value: 'caching' },
      ],
    },
    {
      label: 'Sécurité',
      value: 'security',
      items: [
        { label: 'Authentification forte (MFA)', value: 'auth' },
        { label: 'Chiffrement des données', value: 'encryption' },
        { label: 'Protection OWASP Top 10', value: 'owasp' },
        { label: 'Certificats SSL/TLS', value: 'ssl' },
        { label: 'GDPR/Compliance', value: 'compliance' },
      ],
    },
    {
      label: 'Maintenabilité',
      value: 'maintainability',
      items: [
        { label: 'Documentation technique', value: 'documentation' },
        { label: 'Tests unitaires > 80%', value: 'unit_tests' },
        { label: 'Standards de codage', value: 'coding_standards' },
        { label: 'Intégration continue', value: 'ci' },
      ],
    },
    {
      label: 'Évolutivité',
      value: 'scalability',
      items: [
        { label: 'Architecture microservices', value: 'microservices' },
        { label: 'Auto-scaling cloud', value: 'autoscaling' },
        { label: 'Load balancing', value: 'load_balancer' },
        { label: 'Découplage des services', value: 'loose_coupling' },
      ],
    },
    {
      label: 'Disponibilité',
      value: 'availability',
      items: [
        { label: 'SLA > 99.9%', value: 'sla' },
        { label: 'Systèmes redondants', value: 'redundancy' },
        { label: 'Backups automatisés', value: 'backups' },
        { label: 'Monitoring 24/7', value: 'monitoring' },
      ],
    },
    {
      label: 'Expérience Utilisateur',
      value: 'ux',
      items: [
        { label: 'Accessibilité WCAG', value: 'accessibility' },
        { label: 'Design responsive', value: 'responsive' },
        { label: "Taux d'erreur < 1%", value: 'error_rate' },
        { label: 'Optimisation Core Web Vitals', value: 'web_vitals' },
      ],
    },
    {
      label: 'Coûts',
      value: 'cost',
      items: [
        { label: 'Optimisation cloud', value: 'cloud_optimization' },
        { label: 'Budget monitoring', value: 'budget_control' },
        { label: 'ROI mesurable', value: 'roi' },
      ],
    },
  ];
}
