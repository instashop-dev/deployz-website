---
title: "What is BYOC? A practical definition for small SaaS teams"
seoTitle: "What is BYOC? A practical definition for SaaS teams"
description: "BYOC (bring your own cloud) means your software runs in your customer's cloud account. Learn who owns, pays for and operates it, and what still leaves."
summary: "BYOC, or bring your own cloud, means your application runs in your customer's own cloud account instead of yours. The customer owns the resources and pays the cloud bill. Who operates the software, and which data leaves the account, depend on the setup you agree."
slug: "what-is-byoc"
category: "Decisions"
draft: false
author: "Team Deployz"
pubDate: 2026-11-25
cta: "how-it-works"
keyTakeaways:
  - "BYOC (bring your own cloud) means the vendor's application runs in a cloud account that the customer owns, not in the vendor's account."
  - "Separate three questions: whose account runs the software, who pays the cloud provider, and who operates the software day to day."
  - "Customer-hosted does not mean every piece of data stays in the customer's account. Check model APIs, integrations, builds, metadata, secrets and traffic routing."
  - "BYOC in a public cloud account is not the same as on-premises or air-gapped delivery. Those need different tooling."
  - "Before you offer BYOC, you need a repeatable install, versioned releases, a plan for updates and removal, and a support plan."
sources:
  - title: "Access to AWS accounts owned by third parties"
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html"
    publisher: "Amazon Web Services"
  - title: "The confused deputy problem"
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html"
    publisher: "Amazon Web Services"
  - title: "Shared Responsibility Model"
    url: "https://aws.amazon.com/compliance/shared-responsibility-model/"
    publisher: "Amazon Web Services"
  - title: "Use quick-create links to create CloudFormation stacks"
    url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stacks-quick-create-links.html"
    publisher: "Amazon Web Services"
related:
  - "saas-in-customer-aws-account"
  - "ai-app-customer-cloud-data-privacy"
---

BYOC, or bring your own cloud, means your application runs in your customer's own cloud account instead of yours. The customer owns the resources and pays the cloud provider directly. Who operates the software, and which data leaves the account, are separate questions. You answer them in the setup you agree with the customer.

When a prospect asks for "a BYOC option," they are asking for a specific mix of ownership, billing and control. This article gives you a working definition, a way to compare BYOC with the models it gets confused with, and a checklist of what your team needs before you say yes.

## What does BYOC mean?

In a BYOC deployment, the vendor's application runs inside a cloud account that the customer owns. On AWS, that means the compute, database, storage and network for your application are created in the customer's AWS account, not in yours.

You may also hear the same idea called customer-hosted deployment or private SaaS. Vendors use these terms in different ways. When a customer or a competitor says "BYOC," confirm what the offer includes before you compare it with yours.

A BYOC setup has two parts:

- **A control plane**: the coordinating service. It runs outside the customer's account: in yours, or in your deployment tool's. With Deployz, it runs in Deployz's AWS account. It holds the vendor's dashboard, release records and deployment status, and it coordinates installs and updates.
- **A data plane**: the running application in the customer's account, with its database, its files and its network.

The split is useful, but it does not tell you everything. You still need to know who can change what, and which data crosses between the two parts.

## Who owns, pays for and operates a BYOC deployment?

"Customer-hosted" tells you whose account runs the application. It does not tell you who operates it. Treat these as three separate questions:

| Question | BYOC answer | What to confirm with the customer |
| --- | --- | --- |
| Whose account runs the application? | The customer's cloud account | Which account and which Region they will use |
| Who pays the cloud provider? | The customer, directly | That your software fee is separate from their cloud bill |
| Who operates the software? | The vendor, through access the customer approves, unless you agree otherwise | Who installs, updates, rolls back, monitors and removes it |

Cloud providers draw their own line too. AWS describes a [shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/): AWS is responsible for security of the cloud, and the account owner is responsible for security in the cloud. The model describes the split between AWS and the account owner. It does not assign duties to a software vendor that works inside the account, so you and your customer need to agree that part yourselves.

Record the agreement in a short list:

- **The vendor:** application code, releases, data handling in the application, and the decision to start each update.
- **The customer:** account administration, billing, access and governance.
- **The deployment tooling:** carrying out installs and updates, and reporting status.

## How is BYOC different from SaaS, self-hosted, on-premises and air-gapped?

These terms get mixed up, but they describe different things.

| Model | Where it runs | Who operates it |
| --- | --- | --- |
| Multi-tenant SaaS | Vendor's cloud account, shared by many customers | Vendor |
| Single-tenant SaaS | Vendor's cloud account, a dedicated copy per customer | Vendor |
| BYOC | Customer's cloud account | Vendor, with access the customer approves |
| Self-hosted | Customer's cloud account or servers | Customer, from the vendor's releases |
| On-premises | Customer's own data center | Customer |
| Air-gapped | Customer's isolated network | Customer |

Two distinctions matter most:

- **Single-tenant SaaS is not BYOC.** A dedicated copy in your account can meet a requirement for separation. It does not give the customer ownership of the account or the bill.
- **BYOC is not on-premises or air-gapped.** BYOC runs in a customer's public cloud account. On-premises runs in the customer's own data center, and an air-gapped network has no internet connection. Those two need different packaging, update and support processes.

If you are not sure which model a customer needs, start with the questions in [Your customer wants your SaaS in their AWS account. Now what?](/blog/saas-in-customer-aws-account/).

## How does the vendor get access to the customer's account?

The customer should not hand you long-term credentials. On AWS, AWS documents a pattern for this: the customer creates an IAM (AWS Identity and Access Management) role in their own account, and the vendor uses that role. See [Access to AWS accounts owned by third parties](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html). The role's permissions decide what the vendor can do, and any usage is billed to the account owner.

When the vendor's own account assumes that role, AWS recommends an external ID (a value the vendor sends each time it uses the role). The vendor generates a unique value for each customer, and the role's trust policy (the rule that says who may use the role) requires it. It protects against the [confused deputy problem](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html), where one customer could trick the vendor into acting on another customer's account. AWS notes that the external ID is not a secret.

Customers can approve this access by creating a CloudFormation stack (a set of AWS resources created from one template) in their own console. A [quick-create link](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stacks-quick-create-links.html) opens the stack page with the template and parameters filled in. The customer can still review the values before creating the stack, and a template that creates IAM resources needs their explicit acknowledgement.

Some tools use a different design, with no cross-account role. In Deployz, for example, the customer approves one connector stack through a CloudFormation quick-create link, as described above. The connector runs inside the customer's account and calls out to Deployz. It is the only Deployz code that calls AWS APIs in the customer's account. Deployz never asks for access keys or administrator credentials. Customers can read the details on [security and AWS access for customers](/docs/customers/security).

## Does all the data stay in the customer's account?

Not by default. BYOC moves the resources into the customer's account. It does not decide where every piece of data goes. Before you promise anything, check each path below.

### A checklist of data paths to check

1. **Code analysis.** Does the vendor's tooling read your repository, and does any of it go to an AI model?
2. **Model APIs and other integrations.** If your application calls an external AI model, an email service or an analytics tool, that data goes wherever the application sends it.
3. **Builds.** Where is your source code built into a release, and who can see the build?
4. **Deployment metadata.** What status and health information reaches your control plane?
5. **Secrets.** Where are configuration values stored before they reach the customer's account?
6. **Logs.** Do application logs stay in the account, or are they copied to a vendor tool?
7. **Traffic routing.** Does user traffic go straight to the customer's load balancer, or through a vendor proxy?

### Example: how Deployz answers these questions

The answers depend on your tooling, so here is one worked example. These are Deployz's documented boundaries:

| Data path | Deployz answer |
| --- | --- |
| Code analysis | Deployz reads your repository through its GitHub App to analyze it. Deployz may send redacted repository excerpts to an external AI model to resolve open questions. It redacts secret-looking values before any excerpt leaves its analysis process. AI never creates infrastructure. |
| Model APIs and integrations | Your application controls these. Running in the customer's account does not change where the application sends data. |
| Builds | Release images are built in Deployz's AWS account from a commit you choose. Deployz stages your source in its own account for the build. New application tasks pull the release image from Deployz's image registry. |
| Deployment metadata | The connector reports deployment status and health to Deployz, such as how many tasks are running, whether the load balancer sees the application as healthy, the result of an HTTP check and which release image is running. |
| Secrets you or the customer enter | Values entered before the account connects are stored encrypted in Deployz. Deployz then delivers runtime values to AWS Secrets Manager in the customer's account. Values you set for every customer stay encrypted in Deployz. Build-time values are different: Deployz passes them to the build in its own AWS account, and they become part of the release image. |
| Secrets Deployz generates | Secret variables that Deployz generates for your application are created by the connector inside the customer's account, and Deployz never sees them. Deployz also generates secret template parameters for each install, such as an app API key and a signing secret. They stay in the install job until the connector picks it up. After that, Deployz masks them. |
| Logs | Application runtime logs stay in the customer's account. Deployz never copies them out. |
| Traffic routing | Traffic to the default `deployz.dev` URL passes through the Deployz proxy on Cloudflare. A custom domain routes directly to the customer's load balancer. |

AI applications add more paths, such as prompts, model responses and agent actions. For those, read [what stays private when you deploy an AI app in a customer's cloud](/blog/ai-app-customer-cloud-data-privacy/).

Also keep one rule in mind: hosting in the customer's account does not by itself make an application compliant or secure.

## Why do customers ask for BYOC?

A BYOC request can come from any of these needs:

- **Data control.** They want application data in resources they own.
- **Billing ownership.** They want the cloud cost on their own bill.
- **Region choice.** They need the application in a specific AWS Region.
- **Infrastructure visibility.** They want to see every resource the application uses.
- **Access policy.** Their rules don't allow a third party to hold permanent credentials to their systems.

Ask which of these the customer actually needs. A dedicated database or a specific Region can sometimes be met without BYOC. A requirement for private-only network access needs an explicit networking design, whatever model you choose.

## What does a small SaaS team need before offering BYOC?

One running copy in one customer's account is not a BYOC offering. A repeatable process is. Use this checklist before you agree to a first customer:

- [ ] **A production container image** that builds from your repository without manual steps.
- [ ] **A repeatable install** that the customer can review and approve in their own account.
- [ ] **Versioned releases**, so you know which version each customer runs.
- [ ] **An update plan** for many customer accounts, including who starts each update.
- [ ] **Backward-compatible database migrations.** Rolling back the application does not reverse a migration that already ran.
- [ ] **A removal plan** that says what is deleted, what is kept and who deletes retained data.
- [ ] **A cost explanation** that separates your software fee from the customer's cloud bill. Dedicated infrastructure for each customer has its own cloud cost, even for a small customer.
- [ ] **A support plan** that works without direct access to customer logs, or an agreed way to get them.

Not every application fits every BYOC tool. Check the architecture a tool supports before you plan around it.

## Where Deployz fits

Deployz helps SaaS teams deploy and update supported applications in their customers' AWS accounts. AWS is the cloud Deployz currently supports.

You connect your GitHub repository, and Deployz analyzes it and gives you a readiness report for your application. You build a release and test it in your own AWS account. Then you send your customer an install link. They review the plan, the AWS resources and the cost estimate, confirm their email with a one-time code, and approve a connector in their AWS console. They don't need a Deployz account. From one dashboard, you choose the release for each customer, deploy updates and roll back.

The customer owns the AWS resources and pays AWS directly. Deployz fees are separate; see [pricing](/pricing/) for details.

Deployz has clear limits:

- **Supported architecture:** one Linux x86-64 container image that runs a web service, in a new network in one AWS Region. Workers, PostgreSQL or MySQL, and a cache are optional. Every deployment gets an S3 bucket.
- **Not supported:** on-premises or air-gapped environments, Azure and GCP.
- **Rollbacks:** they do not reverse database migrations.
- **Removal:** the database, its credentials, the S3 bucket and the network parts that the database uses are kept until someone deletes them, and they can still cost money.

Check the [application requirements](/docs/prepare/requirements) to see whether your application fits.

To see the whole process, read about [BYOC deployments on AWS](/byoc-deployments/) or [see how it works](/how-it-works/).
