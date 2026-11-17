# Deploy your SaaS into customer AWS

## A deployment process for small SaaS teams

A customer asks to run your app in their AWS account. Deployz helps you prepare, install, and update a supported app there.

### Check the app before installation

Connect GitHub with read-only access. Review the readiness report. Provide required settings and fix code blockers. Build a versioned release. Test it in your own AWS account before you send a customer installation link.

### Let the customer approve AWS access

The customer opens your link and reviews the resources, estimated AWS costs, and requested permissions. They create a connector in their AWS console. They do not need a Deployz account.

### Manage each customer's release

Deployz creates the supported infrastructure and deploys the release. You select releases, start updates, view status, and roll back when needed. A rollback does not reverse database migrations.

## What can run

- One Linux x86-64 container image with an HTTP web or API service.
- Optional background workers from the same image.
- Optional PostgreSQL 16 or MySQL 8.0.
- Optional Redis-compatible cache and S3 storage.
- A new dedicated VPC, HTTPS, and an optional custom domain.

Existing VPCs, separate service images, Kubernetes, serverless apps, GPUs, ARM64, other clouds, and on-premises installations are not supported.

## Ownership and cost

Your team owns the application code and configuration. Your customer owns the AWS account and resources. Deployz manages the supported deployment process.

Evaluate for free with no card or time limit. The evaluation includes one active test deployment per app in your own AWS account. AWS charges apply.

The paid plan is USD 49 per month plus USD 19 per billable customer environment per month. Subscriptions start at USD 68 per month and include at least one billable customer environment. AWS bills infrastructure separately.

## Check the full architecture

Deployz receives deployment metadata. It does not receive database data, cache contents, S3 data, or application logs through the connector. Builds run in Deployz's AWS account. The default app URL uses a Deployz proxy; a custom domain routes directly to the customer's load balancer. App integrations can send data to other services.

Deployz has not completed its own SOC 2 audit. Customer AWS hosting does not make an app compliant by itself.

**Get Started Free:** https://app.deployz.dev/sign-up

Architecture: https://deployz.dev/security/

Pricing: https://deployz.dev/pricing/

Contact: help@deployz.dev
