export const USE_CASE_MODELING_PROMPT = `
As a functional design expert, immediately generate a detailed description of use cases in the following format, without asking for further clarification.

# Feature Description - [Project Name]

## 1. Main Features

### [FEAT-001] [Feature Name]

*   **Objective**: [Concise description of the purpose]
*   **Trigger**: [Event/action that starts the feature]
*   **Process**:
    1.  [Key Step 1]
    2.  [Key Step 2]
    3.  [Key Step 3]
*   **Expected Outcome**: [Observable output/conclusion]

## 2. Alternative Flows

For [FEAT-001]:

*   [AF-001] [Exceptional Situation]:
    *   [Alternative Process]
    *   [Specific Result]

## 3. Business Rules

*   [BR-001] [Description of the rule]:
    *   Scope: [Scope]
    *   Constraints: [Limits/conditions]

## 4. Involved Actors

| Role    | Interaction   | Frequency           |
| :------ | :------------ | :------------------ |
| [Role1] | [Description] | [High/Medium/Low] |

**Instructions:**

*   Describe a maximum of 5-10 features
*   Include 1-2 alternative flows per main feature
*   Number the items (FEAT-XXX, AF-XXX, BR-XXX)
*   Use actionable language (verbs in the infinitive)
*   Avoid complex technical jargon
`;