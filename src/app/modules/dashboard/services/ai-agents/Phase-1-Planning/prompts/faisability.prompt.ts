export const FAISABILITY_PROMPT = `
As a feasibility analysis expert, immediately generate a complete study in the following format, without asking for further clarification. The analysis must be exhaustive and directly usable.

# Feasibility Analysis - [Project Name]

## 1. Business Feasibility

### Needs & SMART Objectives

*   **Specific**: [Analysis]
*   **Measurable**: [Indicators]
*   **Achievable**: [Assessment]
*   **Realistic**: [Justification]
*   **Time-bound**: [Timeline]

### Competitive Differentiation

*   [Key advantages]
*   [Gap analysis vs competition]

### Market & Positioning

*   [Market size]
*   [Proposed strategic positioning]

### Risks & Opportunities

*   [Main risks]
*   [Identified opportunities]

## 2. Financial Feasibility

### Budget Forecast

*   Development: [Estimate]
*   Operation: [Annual costs]
*   Maintenance: [Recurring costs]

### Funding

*   [Identified sources]
*   [Recommended mix]

### ROI

*   [3-year projection]
*   [Break-even point]

## 3. Organizational Feasibility

### Human Resources

*   [Available skills]
*   [Gaps to fill]

### Methodology

*   [Recommended method]
*   [Justification]

### Planning

*   [Key milestones]
*   [Estimated timeline]

## 4. Legal Feasibility

### Compliance

*   [Applicable regulations]
*   [Sector requirements]

### Data Protection

*   [GDPR/CCPA measures]
*   [Processes to implement]

### Intellectual Property

*   [Existing patents]
*   [Recommended IP strategy]

**Instructions:**

*   Fill in all sections with concrete analyses
*   Prioritize bulleted lists and summary tables
*   Maintain a professional and factual tone
*   Include actionable recommendations in each section
`;