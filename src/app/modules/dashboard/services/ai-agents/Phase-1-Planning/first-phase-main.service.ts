import { Injectable } from '@angular/core';
import { FeasibilityStudyService } from './feasibility-study.service';
import { RequirementsGatheringService } from './requirements-gathering.service';
import { RiskAnalysisService } from './risk-analysis.service';
import { SmartObjectivesService } from './smart-objectives.service';
import { StakeholderMeetingsService } from './stakeholder-meetings.service';
import { UseCaseModelingService } from './use-case-modeling.service';
import { ProjectModel } from '../../../models/project.model';
import { PlanningModel } from '../../../models/planning.model';
import { ProjectService } from '../../project.service';

@Injectable({ providedIn: 'root' })
export class FirstPhaseMainService {
  constructor(
    private feasibilityStudyService: FeasibilityStudyService,
    private riskAnalysisService: RiskAnalysisService,
    private smartObjectivesService: SmartObjectivesService,
    private requirementsGatheringService: RequirementsGatheringService,
    private stakeholderMeetingsService: StakeholderMeetingsService,
    private useCaseModelingService: UseCaseModelingService,
    private projectService: ProjectService
  ) {}

  async executeFirstPhase(project: ProjectModel): Promise<PlanningModel> {
    const planning = project.analysisResultModel.planning;
    const literralProject =
      this.projectService.getProjectDescriptionForPrompt(project);

    const feasibilityStudy = await this.generateStep(
      planning?.feasibilityStudy,
      (history) =>
        this.feasibilityStudyService.analyzeFeasibility(
          history,
          literralProject
        ),
      'Feasibility Study'
    );

    const riskAnalysis = await this.generateStep(
      planning?.riskanalysis,
      (history) =>
        this.riskAnalysisService.analyzeRisks(history, literralProject),
      'Risk Analysis'
    );

    const smartObjectives = await this.generateStep(
      planning?.smartObjectives,
      (history) =>
        this.smartObjectivesService.defineSmartObjectives(
          history,
          literralProject
        ),
      'SMART Objectives'
    );

    const requirementsGathering = await this.generateStep(
      planning?.requirementsGathering,
      (history) =>
        this.requirementsGatheringService.gatherRequirements(
          history,
          literralProject
        ),
      'Requirements Gathering'
    );

    const stakeholdersMeeting = await this.generateStep(
      planning?.stakeholdersMeeting,
      (history) =>
        this.stakeholderMeetingsService.organizeStakeholderMeetings(
          history,
          literralProject
        ),
      'Stakeholder Meetings'
    );

    const useCaseModeling = await this.generateStep(
      planning?.useCaseModeling,
      (history) =>
        this.useCaseModelingService.modelUseCases(history, literralProject),
      'Use Case Modeling'
    );

    return {
      feasibilityStudy,
      riskanalysis: riskAnalysis,
      smartObjectives,
      requirementsGathering,
      stakeholdersMeeting,
      useCaseModeling,
    };
  }

  private async generateStep(
    existingData: { content: string; summary: string } | undefined,
    generationFn: (
      history: string
    ) => Promise<{ content: string; summary: string }>,
    stepName: string
  ): Promise<{ content: string; summary: string }> {
    const isEmpty =
      !existingData ||
      (existingData.content === '' && existingData.summary === '');
    if (!isEmpty) return existingData;

    try {
      const result = await generationFn('');
      console.log(`${stepName} completed`, result);
      return result;
    } catch (error) {
      console.error(`${stepName} failed`, error);
      return { content: '', summary: '' };
    }
  }
}
