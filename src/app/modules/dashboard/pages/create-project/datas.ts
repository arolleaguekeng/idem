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
  static groupedConstraints: SelectItemGroup[];
  static phases: DevelopmentPhase[] = [
    {
      id: 'planning',
      label: 'Phase 1 - Planning',
      tier: 'free', // "s"
      subItems: [
        { label: 'Étude de faisabilité', tier: 'free' },
        { label: 'Analyse des risques', tier: 'standard' },
        { label: 'Objectifs SMART', tier: 'premium' },
      ],
    },
    {
      id: 'design',
      label: 'Phase 2 - Design',
      tier: 'standard', // "s"
      subItems: [
        { label: "Choix d'architecture", tier: 'free' },
        { label: 'Modélisation UML', tier: 'standard' },
        { label: 'Sélection technologique', tier: 'premium' },
      ],
    },
    {
      id: 'development',
      label: 'Phase 3 - Development',
      tier: 'premium', // "p"
      subItems: [
        { label: 'Setup projet', tier: 'standard' },
        { label: 'Développement backend/frontend', tier: 'premium' },
        { label: 'Base de données', tier: 'premium' },
      ],
    },
    {
      id: 'charte',
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
}
