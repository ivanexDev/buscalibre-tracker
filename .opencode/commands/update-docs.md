---
description: Update documentation based on recent changes and close merged PR tickets in Jira
agent: general
---

Use `ai-specs/specs/documentation-standards.mdc` to update whatever documentation is needed according to the changes made

After updating documentation, check for recently merged PRs and update their corresponding Jira tickets:

1. Get recently closed PRs from GitHub (state=closed)
2. Filter only merged PRs (merged_at != null)
3. Extract Jira ticket ID from PR title (pattern: BOOK-\d+)
4. For each merged PR with a Jira ticket:
   - Check current ticket status in Jira
   - If not in "Done" status:
     - Add a comment: "PR mergeado ✅ - Documentación actualizada automáticamente"
     - Transition the ticket to "Done" (transition id: "31")

Cloud IDs:
- Jira project: 49323cac-b56a-4062-aa68-bf0ca515fb13
- GitHub repo: ivanexDev/buscalibre-tracker
