#!/bin/bash

# Vérification de la présence d'Angular CLI
if ! command -v ng &> /dev/null
then
    echo "Angular CLI n'est pas installé. Installez-le avec: npm install -g @angular/cli"
    exit 1
fi

# Définition des phases et sous-étapes
phases=(
    "Phase-1-Planning:FeasibilityStudy RiskAnalysis SmartObjectives RequirementsGathering StakeholderMeetings UseCaseModeling"
    "Phase-2-Design:ArchitectureChoice MonolithicArchitecture MicroservicesArchitecture EventDrivenArchitecture HexagonalArchitecture ComponentDesign UMLModeling DesignPatterns TechnologySelection BackendTechnologies FrontendTechnologies DatabaseTechnologies InfrastructureTechnologies"
    "Phase-3-Development:ProjectSetup GitInitialization CICDSetup DirectoryStructure BackendDevelopment APIImplementation DataAccessLayer ErrorHandling SecurityImplementation FrontendDevelopment UIComponents StateManagement ResponsiveDesign Authentication DatabaseDesign SchemaModeling QueryOptimization DataMigration"
    "Phase-4-Testing:UnitTesting IntegrationTesting FunctionalTesting PerformanceTesting SecurityTesting TestAutomation MockingStrategies"
    "Phase-5-Deployment:EnvironmentsSetup DevelopmentEnvironment StagingEnvironment ProductionEnvironment CICDSetup BuildAutomation SecretsManagement ScalableDeployment MonitoringMaintenance Logging Alerting PerformanceMonitoring"
)

# Création des dossiers et services Angular standalone
mkdir -p "src/app/modules/project/services/ai-agents"
for phase in "${phases[@]}"
do
    IFS=":" read -r phase_name steps <<< "$phase"
    mkdir -p "src/app/modules/project/services/ai-agents/$phase_name"
    for step in $steps
    do
        ng g service "/modules/project/services/ai-agents/$phase_name/$step" --skip-tests
    done
done
echo "Structure des agents IA créée avec succès."
