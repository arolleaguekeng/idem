export const RISK_ANALYSIS_PROMPT = `
As a risk management expert, immediately generate a complete analysis in the following format, without asking for further clarification.

# Risk Analysis - [Project Name]

## 1. Risk Identification

### Technical Risks

*   [TR-001] [Risk description]
    *   *Probability*: [Low/Medium/High]
    *   *Impact*: [Critical/Major/Minor]

### Business Risks

*   [BR-001] [Risk description]
    *   *Probability*: [Low/Medium/High]
    *   *Impact*: [Critical/Major/Minor]

## 2. Risk Assessment

| Risk   | Probability | Impact | Level |
| :----- | :---------- | :----- | :---- |
| [Code] | [%]         | [1-5]  | [A/B/C] |

## 3. Mitigation Plan

### Preventive Measures

*   [PM-001] For [Risk]: [Concrete action]
    *   *Cost*: [Estimate]
    *   *Effectiveness*: [% risk reduction]

### Contingency Plans

*   [CP-001] If [Risk] occurs: [Emergency procedure]

## 4. Risk Monitoring

*   Reassessment frequency: [Monthly/Quarterly]
*   Monitoring metrics: [Key indicators]
*   Responsibilities: [Assigned roles]

**Instructions:**

*   Use the ISO 31000 scale for assessment
*   Include at least 5 risks per category
*   Prioritize by criticality level
*   Provide concrete and quantified solutions
*   Avoid generic formulations
`;