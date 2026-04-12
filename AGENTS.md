# Repository Context

This repository is a product documentation site for `Alauda Security Service`, not an application source repository for ACP or the security product backend/frontend.

## Stack

- Static docs site built with `@alauda/doom`
- Package manager: `yarn@4`
- Main commands: `yarn dev`, `yarn build`, `yarn lint`, `yarn serve`, `yarn translate`
- Main content lives under `docs/en`
- Theme is almost uncustomized and re-exports `@alauda/doom/theme`

## Product Positioning

The documented product is a Kubernetes and container security platform centered on:

- Vulnerability management
- Security policy management and enforcement
- Risk and violation investigation
- Network graph, baseline, and policy generation
- `roxctl` CLI workflows
- Offline-mode operation

The documented architecture clearly follows the StackRox / Red Hat Advanced Cluster Security model:

- Central
- Sensor
- Collector
- Admission Controller
- Scanner V4

## Relationship To Red Hat RHACS

This repository is best understood as an Alauda-branded documentation set derived from Red Hat Advanced Cluster Security for Kubernetes documentation, rather than a fully independent docs set written from scratch.

Current working assumption:

- The historical content base is closer to RHACS / StackRox 4.8
- The current migration work has already aligned the docs to a RHACS 4.9-oriented baseline for the currently documented feature set
- Future release-specific adjustments should start from the repository context files instead of recreating the migration analysis

Evidence observed during review:

- Information architecture closely matches RHACS operating docs:
  - vulnerability
  - policy
  - network
  - risk
  - violation
- Multiple pages map directly to RHACS topics such as:
  - examining images for vulnerabilities
  - process baselines
  - custom/default security policies
  - network graph and network policy generation
  - offline mode
  - `roxctl` installation and usage
- Terminology and component model remain RHACS-native:
  - `Central`, `Sensor`, `Collector`, `Scanner V4`
  - `roxctl`
  - `definitions.stackrox.io`
  - `collector-modules.stackrox.io`

## Current Documentation Constraints

These constraints have already been confirmed during the current upgrade work and should be treated as repository context for future sessions:

- `docs/en/compliance/**` has been intentionally removed
- User-facing documentation should not reintroduce compliance as a product capability, module, or navigation area
- `docs/en/install/install_plugin.mdx` intentionally keeps the current StackRox-style installation narrative
- Signature verification docs currently cover:
  - Cosign public keys
  - Cosign certificates
  - Rekor transparency log validation
  - keyless verification
- Do not add new standalone docs for:
  - machine-to-machine access
  - external JWT issuer
  - declarative configuration
  - CA rotation
  - delegated scanning
- Upstream endpoints such as `install.stackrox.io` and `definitions.stackrox.io` may remain when they reflect actual documented behavior
- Existing upstream policy names such as `OpenShift: ...` are intentionally preserved unless the user asks to localize them

## Current Verification Sources

The current repository context is based on three inputs:

- local documentation content under `docs/en`
- RHACS 4.9 upstream documentation used as the comparison baseline
- live UI inspection of the latest Alauda environment provided during this task

Live UI inspection already confirmed navigation and page structure for:

- Dashboard
- Vulnerability Management
- Policy Management
- Integrations
- System Configuration
- Clusters
- Network Graph follow-up dialogs and generator entry points

## Current Stop Point

As of 2026-04-12, the RHACS 4.9 documentation refresh for the current scope is considered closed from a planning perspective. The required live UI calibration for this round has already been completed.

Completed work includes:

- removed `docs/en/compliance/**`
- removed user-facing compliance module references from overview, dashboard, architecture, vulnerability, and policy context where applicable
- aligned many existing pages to the current UI structure without adding new product capabilities
- kept the StackRox-style installation narrative in `docs/en/install/install_plugin.mdx`
- updated signature verification to the RHACS 4.9 capability boundary, including Rekor transparency log validation and keyless verification
- updated index and introduction pages so navigation sections are no longer empty shells
- calibrated live UI details for:
  - vulnerability results and reporting
  - risk and violations
  - collections
  - network graph and network policy generator
  - signature integration subforms including transparency log fields

Do not continue broad cleanup or open-ended UI verification by default. Any future comparison phase should start from the current repo context and the user’s next explicit target.

For future sessions, use these repo-local context anchors first:

- `context/RHACS-4.9-doc-master-plan-zh.md`
- `context/UI-upstream-term-audit-2026-04-11.md`
- `skills/security-doc-ui-calibration/`

## Residual Upstream Traces

The Alauda adaptation is incomplete. The repo still contains direct StackRox / Red Hat traces that should be assumed intentional unless the user asks to clean them up.

Examples already confirmed:

- `docs/en/install/install_plugin.mdx`
  - contains `Alauda Security Service for StackRox`
  - contains `platform.stackrox.io/v1alpha1`
  - contains `stackrox-operator`
- `docs/en/network/howto/generate_network_policy.mdx`
  - still uses `stackrox-generated-<deployment-name>`
- `docs/en/install/offline_mode.mdx`
  - still references `https://install.stackrox.io/scanner/scanner-vuln-updates.zip`
- `docs/en/overview/architecture.mdx`
  - still references StackRox endpoints and RHACS component naming
- `docs/en/policy/guides/default_policy.mdx`
  - still includes OpenShift-specific default policy names
- `docs/en/violation/guides/violations.mdx`
  - still includes `stackrox` namespace and RHACS-style exclusions

When editing content, check whether a statement is:

- an Alauda-specific product commitment
- inherited RHACS behavior
- an upstream artifact that may need localization

Do not assume all current text is natively Alauda-authored.

## Build And Repo State Notes

Repository state observed during recent work:

- `yarn build` failed because the docs tooling expected `docs/zh`
- `yarn lint` failed with similar directory assumptions and an `EMFILE` watcher error
- CI/CD configuration exists under `.tekton/` and `.builds/`

Implication:

- Treat this repo as a content repository wired into shared company doc pipelines
- Do not assume local build and lint work out of the box without additional environment or repo conventions

## Recommended Working Assumptions For Future Sessions

- Start by treating this repo as documentation derived from RHACS/StackRox and verify whether a page is original, adapted, or still upstream-flavored.
- Preserve English documentation style unless explicitly asked to translate.
- For product-accuracy tasks, verify whether a statement reflects:
  - Alauda Security Service behavior
  - RHACS upstream behavior
  - ACP-specific environment adaptation
- Use the context files under `context/`, especially `context/RHACS-4.9-doc-master-plan-zh.md`, as the current migration baseline.
- Be careful when “fixing” residual StackRox references; some may still reflect actual implementation details.
- If asked for feature analysis during the current migration, compare against RHACS 4.9 first, while remembering that some repository content still reflects 4.8-era structure.
