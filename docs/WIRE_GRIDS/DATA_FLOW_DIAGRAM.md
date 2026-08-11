# DATA FLOW DIAGRAM

```mermaid
flowchart TD
  Input[User Inputs] --> Validate[Validation Layer]
  Validate --> Calc[Calculation Engine]
  Calc --> Estimate[Estimate Output]
  Estimate --> Contract[Contract + Signoff]
```
