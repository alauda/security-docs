---
name: security-doc-ui-calibration
description: Use when calibrating Alauda Security Service product docs against a live UI environment, extracting verified labels/fields/routes from the product, or auditing upstream product terms such as RHACS, OpenShift, or Red Hat in the UI.
---

# Security Doc UI Calibration

Use this skill for repo-specific UI verification work in `security-docs`.

## When To Use

Use this skill when you need to:

- verify documentation wording against a live Alauda Security Service UI
- inspect vulnerability-reporting, network-graph, or similar complex UI flows before editing docs
- audit visible upstream terms such as `RHACS`, `OpenShift`, `OCP`, `Red Hat`, or `StackRox`
- capture only verified UI fields, labels, tabs, table columns, and placeholders

Do not use this skill for general web browsing or for editing product docs without UI verification needs.

## Workflow

1. Confirm the target environment URL and credentials are available in the current task context.
2. Run the appropriate bundled script from `scripts/`.
3. Feed the script three stdin lines in this order:
   - base URL
   - username
   - password
4. Read the JSON result and extract only stable, visible UI facts.
5. Update docs conservatively:
   - keep verified labels and flows
   - avoid inventing hidden steps or backend behavior
   - mark no-data pages as unresolved instead of guessing
6. After the docs change, note which pages were verified and which areas remain intentionally out of scope.

## Bundled Scripts

- `scripts/inspect_vulnerability_deep.js`
  Use for vulnerability results, reporting, collections, and exception-management follow-up checks.
- `scripts/inspect_network_graph_cert_manager.js`
  Use for the `Network Graph` flow that requires selecting the `cert-manager` namespace.
- `scripts/audit_ui_upstream_terms.js`
  Use for route-based audits of upstream wording in the product UI.

## Execution Notes

- These scripts rely on Playwright and ignore HTTPS errors for internal environments.
- They are repo-specific and intentionally tuned to current Alauda Security Service routes.
- Treat screenshots and ad hoc one-off scripts as temporary artifacts; keep only reusable scripts in this skill.
- Do not commit credentials, session tokens, or environment-specific secrets.

## Output Standard

When using this skill, the desired outcome is:

- a short list of verified UI facts
- a conservative doc update based on those facts
- a short list of unresolved pages only if they materially block documentation accuracy
