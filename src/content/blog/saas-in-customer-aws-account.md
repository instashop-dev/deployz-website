---
title: "Your customer wants your SaaS in their AWS account. Now what?"
description: "A practical guide to clarifying customer-hosted requirements, checking your app, assigning responsibilities and planning a first deployment."
slug: "saas-in-customer-aws-account"
category: "Decisions"
draft: false
author: "Team Deployz"
pubDate: 2026-10-18
related:
  - ai-app-customer-cloud-data-privacy
---

The demo went well. Then your customer asks: “Can this run in our AWS account?”

For a small software team, that question can open a useful opportunity. It can also turn into weeks of infrastructure work if you agree before understanding the requirement.

Start by clarifying what the customer needs to control. Then check whether you can deliver and maintain the same product in their account.

**The first milestone is a repeatable deployment you can update and support.** Getting one copy running is only part of that job.

## First, find out what they mean

A customer might want their own AWS bill, control over application data, a specific hosting region, or an application reachable only through their company network.

These are different requirements.

Ask five questions before choosing an architecture:

1. **What must run in your account?** The application, database, uploaded files, or every dependency?
2. **Where may data be processed?** Does this include analytics, email, support tools and AI services?
3. **How will users connect?** Through a public HTTPS address or a private company network?
4. **Who will operate it?** Your team, their team, or a defined combination?
5. **What must happen when the agreement ends?** Export data, remove access, retain backups and delete resources?

Ask who can approve installation permissions and which AWS account and region they plan to use.

Write down the answers. “Run it in our AWS” is not yet a deployment specification.

## Choose the delivery model that fits

Customer-hosted deployment means the application runs in a cloud account the customer owns. You may also hear “bring your own cloud,” or BYOC.

It is one of several ways to deliver a separate application instance:

| Approach | Infrastructure location | Operational question |
| --- | --- | --- |
| Dedicated instance in your account | Vendor's AWS account | Does separation satisfy the customer's actual requirement? |
| Vendor-operated customer deployment | Customer's AWS account | How will you install, update and support it with agreed permissions? |
| Customer-operated installation | Customer's AWS account | Can their team install and maintain the application from your releases and documentation? |

A dedicated instance in your account does not provide customer ownership of that account. Equally, customer ownership does not mean the customer wants to handle software updates.

Also, an AWS account and a private network are separate concepts. AWS describes a VPC as an isolated virtual network whose gateways and routing determine connectivity. An application in that network can still have an internet-facing endpoint. [AWS VPC overview](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)

A requirement for private-only access needs an explicit networking design. Confirm that your chosen deployment approach supports it.

## Agree on responsibilities before installation

The customer owns the account. Your team understands the software. Neither fact answers who restores a failed database or responds to an unhealthy application.

Use a simple responsibility table. Here is a starting point for a vendor-operated deployment, to adapt together:

| Area | Agree who owns this |
| --- | --- |
| AWS account and billing | Account administration, service limits, budgets and installation approval |
| Application releases | Testing, version selection, rollout and compatibility |
| Configuration and credentials | Who supplies each value, who can change it and how access is revoked |
| Backups and recovery | Backup settings, recovery objectives and restore tests |
| Monitoring and support | Alert recipients, diagnosis access, incident response and escalation |
| End of service | Data export, access removal, retained resources and final deletion |

Cloud services still have security responsibilities divided between AWS and the parties using them. Using managed services does not remove your responsibility for application behavior or configuration. [AWS shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/)

Make support access part of the design. A customer may prohibit access to production data or runtime logs. Decide how they can share useful, redacted evidence when something fails.

## Check whether the application can move

Before changing infrastructure, list everything your application needs to start and serve a real request.

A container image is one common way to package an application and its runtime so the same release can run in another environment.

For a typical web application, check:

- **Build and startup:** Can you produce a versioned deployable package, such as a container image, from a known commit?
- **Configuration:** Can each installation receive its own URLs, credentials and settings without editing the source?
- **Data:** Are durable files and records stored outside replaceable application containers?
- **Dependencies:** Can you identify the database, cache, background workers, scheduled tasks and external services?
- **Health:** Can a check confirm the application is ready to serve requests?
- **Updates:** Can you change the application without losing data or leaving incompatible database changes?

Pay particular attention to assumptions about your existing SaaS environment: a hardcoded storage bucket, a central database, or a worker running on a developer's machine.

If an application needs architectural changes, identify them before promising a delivery date.

## Plan the second release before the first

A manual installation can hide problems that appear during the next update.

Suppose a release renames a database field. Reinstalling the old application will not necessarily restore the old schema or deleted data.

Design migrations so that the old and new application versions can work during the transition. For example, add a new field first, move usage gradually, then remove the old field in a later release after it is safe.

Also decide how you will identify the version running in each customer account. Keep customer-specific settings separate from the shared application release. Avoid maintaining a source-code branch for every customer unless there is a deliberate product reason.

## Count the full cost

Separate three costs:

- **Infrastructure:** compute, database, storage, networking, backups and traffic.
- **Deployment tooling:** installation, release distribution and lifecycle management.
- **Your team's work:** application preparation, upgrades, incidents and customer coordination.

Include components that run even when usage is low. A small application can still need continuously running networking and database resources.

Buying deployment tooling can reduce work in the second category. It does not remove the infrastructure bill or the need to maintain your software.

Build your own tooling when the deployment model is a core capability worth owning. Evaluate a platform when its supported architecture fits and maintaining installation machinery would divert your team from the product.

## Start with a pilot you can repeat

Use a test account and representative sample data before a customer production installation.

A useful pilot should demonstrate that you can:

1. Install from documented inputs without manual server changes.
2. Complete a real application workflow.
3. Deploy a second release and verify it is healthy.
4. Handle a failed update and understand the recovery path.
5. Restore a backup and verify the recovered data.
6. Remove the deployment, inspect what remains and identify continuing charges.

Record prerequisites and observed results. A successful infrastructure creation event is not enough; the application must work.

## Where Deployz fits

Deployz is built for small software vendors delivering supported web applications into customer-owned AWS accounts.

The vendor connects a GitHub repository, prepares a release and shares an installation link. The customer reviews the plan and approves installation in AWS. The vendor then manages supported deployment operations through the Deployz dashboard.

Check application compatibility and networking requirements first. Deployz does not currently support private-only web applications or deployment into an existing customer VPC.

**[Explore Deployz](https://deployz.dev/) to see whether its customer-hosted deployment model fits your application.**
