import { Injectable } from '@angular/core';
import { FeasibilityStudyService } from './feasibility-study.service';
import { RequirementsGatheringService } from './requirements-gathering.service';
import { RiskAnalysisService } from './risk-analysis.service';
import { SmartObjectivesService } from './smart-objectives.service';
import { StakeholderMeetingsService } from './stakeholder-meetings.service';
import { UseCaseModelingService } from './use-case-modeling.service';
import { ProjectModel } from '../../../models/project.model';
import { AnalysisResultModel } from '../../../models/analysisResult.model';

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
  async executeFirstPhase(
    project: ProjectModel
  ): Promise<AnalysisResultModel | { error: string; step: string }> {
    try {
      const literralProject = `
        Description: ${project.description}
        Type: ${project.type}
        Constraints: ${project.constraints.join(',')}
        Team Size: ${project.teamSize}
        Scope: ${project.scope}
        Budget Intervals: ${project.budgetIntervals}
        Targets: ${project.targets}
      `;
      // 1. Feasibility Study
      let feasibility: string;
      try {
        feasibility = await this.feasibilityStudyService.analyzeFeasibility(
          [],
          literralProject
        );
        console.log('Feasibility Study completed:', feasibility);
      } catch (error) {
        console.error('Feasibility Study failed:', error);
        return { error: 'Feasibility Study failed', step: 'feasibility' };
      }

      // 2. Risk Analysis
      let risks;
      try {
        // risks = await this.riskAnalysisService.analyzeRisks(literralProject);
        console.log('Risk Analysis completed:', risks);
      } catch (error) {
        console.error('Risk Analysis failed:', error);
        return { error: 'Risk Analysis failed', step: 'risks' };
      }

      // 3. SMART Objectives
      let smartObjectives;
      try {
        // smartObjectives =
        //   await this.smartObjectivesService.defineSmartObjectives(
        //     literralProject
        //   );
        console.log('SMART Objectives defined:', smartObjectives);
      } catch (error) {
        console.error('SMART Objectives failed:', error);
        return { error: 'SMART Objectives failed', step: 'smartObjectives' };
      }

      // 4. Requirements Gathering
      let requirements;
      try {
        // requirements =
        // await this.requirementsGatheringService.gatherRequirements(
        //   literralProject
        // );
        console.log('Requirements Gathering completed:', requirements);
      } catch (error) {
        console.error('Requirements Gathering failed:', error);
        return { error: 'Requirements Gathering failed', step: 'requirements' };
      }

      // 5. Stakeholder Meetings
      let stakeholderMeetings;
      try {
        // stakeholderMeetings =
        //   await this.stakeholderMeetingsService.organizeStakeholderMeetings(
        //     literralProject
        //   );
        console.log('Stakeholder Meetings organized:', stakeholderMeetings);
      } catch (error) {
        console.error('Stakeholder Meetings failed:', error);
        return {
          error: 'Stakeholder Meetings failed',
          step: 'stakeholderMeetings',
        };
      }

      // 6. Use Case Modeling
      let useCases;
      try {
        // useCases = await this.useCaseModelingService.modelUseCases(
        //   literralProject
        // );
        // console.log('Use Case Modeling completed:', useCases);
      } catch (error) {
        console.error('Use Case Modeling failed:', error);
        return { error: 'Use Case Modeling failed', step: 'useCases' };
      }
      const analysisResult: AnalysisResultModel = {
        planning: feasibility,
        architectures: [],
        design: [],
        development: '',
        charte: '',
        landing: '',
        testing: '',
        createdAt: new Date(Date.now()),
      };
      // Return the results of all steps
      return analysisResult;
    } catch (error) {
      console.error('Error during Phase 1 execution:', error);
      throw error;
    }
  }
}
