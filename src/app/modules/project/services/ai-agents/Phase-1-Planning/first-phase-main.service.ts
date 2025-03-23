import { Injectable } from '@angular/core';
import { FeasibilityStudyService } from './feasibility-study.service';
import { RequirementsGatheringService } from './requirements-gathering.service';
import { RiskAnalysisService } from './risk-analysis.service';
import { SmartObjectivesService } from './smart-objectives.service';
import { StakeholderMeetingsService } from './stakeholder-meetings.service';
import { UseCaseModelingService } from './use-case-modeling.service';

@Injectable({
  providedIn: 'root',
})
export class FirstPhaseMainService {
  constructor(
    private feasibilityStudyService: FeasibilityStudyService,
    private riskAnalysisService: RiskAnalysisService,
    private smartObjectivesService: SmartObjectivesService,
    private requirementsGatheringService: RequirementsGatheringService,
    private stakeholderMeetingsService: StakeholderMeetingsService,
    private useCaseModelingService: UseCaseModelingService
  ) {}

  /**
   * Executes all steps of Phase 1 - Planning.
   * @param projectDescription Project description.
   * @returns An object containing the results of each step.
   */
  async executeFirstPhase(projectDescription: string): Promise<{
    feasibility: string;
    risks: string;
    smartObjectives: string;
    requirements: string;
    stakeholderMeetings: string;
    useCases: string;
  }> {
    try {
      // 1. Feasibility Study
      const feasibility = await this.feasibilityStudyService.analyzeFeasibility(
        projectDescription
      );
      console.log('Feasibility Study completed:', feasibility);

      // 2. Risk Analysis
      const risks = await this.riskAnalysisService.analyzeRisks(
        projectDescription
      );
      console.log('Risk Analysis completed:', risks);

      // 3. SMART Objectives
      const smartObjectives =
        await this.smartObjectivesService.defineSmartObjectives(
          projectDescription
        );
      console.log('SMART Objectives defined:', smartObjectives);

      // 4. Requirements Gathering
      const requirements =
        await this.requirementsGatheringService.gatherRequirements(
          projectDescription
        );
      console.log('Requirements Gathering completed:', requirements);

      // 5. Stakeholder Meetings
      const stakeholderMeetings =
        await this.stakeholderMeetingsService.organizeStakeholderMeetings(
          projectDescription
        );
      console.log('Stakeholder Meetings organized:', stakeholderMeetings);

      // 6. Use Case Modeling
      const useCases = await this.useCaseModelingService.modelUseCases(
        projectDescription
      );
      console.log('Use Case Modeling completed:', useCases);

      // Return the results of all steps
      return {
        feasibility,
        risks,
        smartObjectives,
        requirements,
        stakeholderMeetings,
        useCases,
      };
    } catch (error) {
      console.error('Error during Phase 1 execution:', error);
      throw error;
    }
  }
}
