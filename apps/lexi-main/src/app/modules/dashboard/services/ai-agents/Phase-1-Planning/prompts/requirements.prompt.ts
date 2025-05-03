export const REQUIREMENTS_PROMPT = `
As a senior functional analyst, immediately generate a complete requirements document in the following format, without asking for further clarification.

# Requirements Document - [Project Name]

## 1. Functional Requirements

### Main Features

*   [FR-001] [Clear description in 1 sentence]
    *   *Acceptance criteria*:
        *   [AC1] [Measurable condition]
        *   [AC2] [Observable condition]

### Business Workflows

\`\`\`mermaid
flowchart TD
    A[Step 1] --> B[Step 2]
    B --> C[Step 3]
\`\`\`

## 2. Non-Functional Requirements

### Performance

*   [NF-001] Response time < 500ms for 90% of requests

### Security

*   [NF-002] Mandatory 2-factor authentication

### Compatibility

*   [NF-003] Browser support: Chrome, Firefox, Safari

## 3. Technical Constraints

| Type          | Detail        | Impact              |
| :------------ | :------------ | :------------------ |
| [Technology] | [Description] | [Effect on project] |

## 4. Personas & Use Cases

### User Profiles

*   [Persona 1]: [Description + Objectives]
*   [Persona 2]: [Description + Objectives]

### User Stories

*   [US-001] As a [role], I want [action] to [benefit]

**Instructions:**

*   Number all requirements (FR-xxx, NF-xxx)
*   Include at least 3 complete user stories
*   Use Mermaid diagrams for workflows
*   Prioritize requirements (Must-have, Should-have, Could-have)
*   Avoid any redundancy with the feasibility study
`;