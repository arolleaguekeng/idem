export const STAKEHOLDER_MEETINGS_PROMPT = `
As a stakeholder management expert, immediately generate a meeting plan in the following format, without asking for further clarification.

# Stakeholder Meeting Plan - [Project Name]

## 1. Stakeholder Mapping

| Role          | Influence | Interest | Meeting Frequency |
| :------------ | :-------- | :------- | :---------------- |
| [Ex: Sponsor] | [1-5]     | [1-5]    | [Monthly/Quarterly] |

## 2. Typical Agenda

### Kickoff Meeting

*   **Objectives**: [List]
*   **Participants**: [Roles]
*   **Duration**: [Xh]
*   **Key Points**:
    *   [Point 1]
    *   [Point 2]

## 3. Minutes Template

### Decisions

*   [D-001] [Description]
    *   *Responsible*: [Name]
    *   *Deadline*: [Date]

### Actions

*   [A-001] [Description]
    *   *Owner*: [Role]
    *   *Deadline*: [DD/MM]

## 4. Commitment Tracking

| Action | Status | Delay | Comment |
| :----- | :----- | :---- | :------ |
| [ID]   | [%]    | [Days] | [Detail] |

**Instructions:**

*   Adapt the frequency according to the influence/interest matrix
*   Include ready-to-use templates
*   Specify the minimum roles required for each meeting
*   Use an action tracking system (D-XXX, A-XXX)
*   Provide historical participation indicators
`;