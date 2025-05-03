export const SMART_OBJECTIVES_PROMPT = `
As a project management expert, immediately generate SMART objectives in the following format, without asking for further clarification.

# SMART Objectives - [Project Name]

## 1. Strategic Objectives

### [Domain] (e.g., Commercial, Technical, Financial)

*   **[S]pecific**: [Concise description]
*   **[M]easurable**: [Quantitative KPI + target]
*   **[A]chievable**: [Resources required]
*   **[R]ealistic**: [Feasibility justification]
*   **[T]ime-bound**: [Precise deadline]

## 2. Monitoring Table

| Objective | Responsible | Progress | Blockers |
| :-------- | :---------- | :------- | :------- |
| [SO-001]  | [Role]      | [%]      | [Detail] |

## 3. Strategic Alignment

*   **Link with product vision**: [Explanation]
*   **Critical dependencies**: [Projects/Teams]

**Instructions:**

*   Limit to 3-5 main objectives
*   Include absolute metrics (e.g., "1000 users" vs "more users")
*   Specify inter-team dependencies
*   Use actionable language (action verbs)
*   Avoid redundancies with the feasibility analysis
`;