export const RISK_ANALYSIS_PROMPT = `
As a risk management expert, immediately generate a complete analysis in the following format, without asking for further clarification.

# Risk Analysis - [Project Name]

## 1. Risk Identification

### Technical Risks

### Business Risks

## 2. Risk Assessment

## 3. Mitigation Plan

### Preventive Measures

### Contingency Plans

## 4. Risk Monitoring

**Instructions:**

*   Use the ISO 31000 scale for assessment
*   Include at least 4 risks per category
*   Prioritize by criticality level
*   Provide concrete and quantified solutions
`;
