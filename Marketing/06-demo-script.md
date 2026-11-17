# Three-minute demo script

Status: Script for a future live installation recording. A separate finished [product walkthrough](video/deployz-product-walkthrough.mp4) uses a real configuration capture and labelled diagrams. See [video notes](video/README.md) for its limits.

Use a sample app that meets the supported architecture. Use a test AWS account. Hide secrets, account IDs, customer names, private repository names, and installation tokens.

Record the actual flow. Mark any time skip on screen. Do not imply that build or AWS resource creation finishes in three minutes.

| Time | Screen | Narration |
| --- | --- | --- |
| 0:00–0:20 | Title and sample app | A customer wants your SaaS in their AWS account. Here is how you can prepare a supported app with Deployz. |
| 0:20–0:45 | GitHub connection and readiness report | Connect GitHub with read-only access. Review the checks, required values, and blockers. The report is advisory. Fix relevant code issues before deployment. |
| 0:45–1:10 | Configuration and release | Provide the settings. Build a versioned release from a commit. Use a test deployment in your own AWS account to check the result. AWS charges apply. |
| 1:10–1:40 | Customer installation page and AWS connector approval | Send an installation link. The customer reviews the resources, AWS estimate, and requested permissions. They approve a connector in their AWS console. They do not need a Deployz account. |
| 1:40–2:05 | Deployment progress and ready state | Deployz creates the supported infrastructure and deploys the release. This recording skips the wait for AWS resources. The environment becomes ready after its health check passes. |
| 2:05–2:30 | Customer environments and release selection | Choose the release for each customer. Start an update and check its status. Rollbacks do not reverse database migrations. |
| 2:30–2:45 | Ownership and cost card | Your customer owns the AWS resources and pays AWS directly. Deployz fees are separate. |
| 2:45–3:00 | Closing card | Check what your app needs before customer installation. Get Started Free at deployz.dev. |

## Capture list

1. Readiness report with passed checks, required values, and a real blocker.
2. Configuration screen with secret values hidden.
3. Release screen with a sample commit and version.
4. Customer installation page with resource and permission details.
5. AWS connector approval in a test account.
6. Deployment progress and successful health check.
7. Two sample customer environments with different selected releases, if the app supports this test setup.

If a required screen is not available, remove the scene or label it as a concept. Do not present a mock screen as the live app.

## Design notes

Use the website's white background, near-black text, and blue `#2563eb`. Use Inter where available. Keep text large and provide captions. Use the existing Deployz mark from `../public/deployz-icon-master.svg` without changes.

Suggested output: a 1920 × 1080 demo and one 1080 × 1080 short clip. Check each export on a small screen. Show only one action per short clip.

Suggested thumbnail copy: **Deploy into customer AWS**. Add a real, redacted product capture. Use the Deployz mark. Do not add customer logos without permission.
