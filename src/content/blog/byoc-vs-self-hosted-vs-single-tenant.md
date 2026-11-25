---
title: "BYOC, self-hosted or single-tenant SaaS: which one does your customer need?"
seoTitle: "BYOC vs self-hosted vs single-tenant SaaS"
description: "Compare BYOC, self-hosted and single-tenant SaaS: whose account runs it, who pays the cloud bill, who operates it, and which requests each one meets."
summary: "Pick the model from the requirement. In the setups compared here, single-tenant SaaS gives isolation in your own account, vendor-operated BYOC runs your software in the customer's cloud account while you operate it, and self-hosted hands operation to the customer. Choose the least work that meets the request."
slug: "byoc-vs-self-hosted-vs-single-tenant"
category: "Decisions"
draft: false
author: "Team Deployz"
pubDate: 2026-11-25
cta: "how-it-works"
keyTakeaways:
  - "As this article defines it, single-tenant SaaS isolates a customer, but it runs in your account and on your bill. It doesn't give the customer the account or the bill."
  - "In the setups compared here, BYOC and self-hosted both run in the customer's account. In vendor-operated BYOC you operate the software; in self-hosted the customer does."
  - "AWS Marketplace lets a SaaS application plane run in the buyer's account, but the control plane must stay in infrastructure the seller manages for the product to count as SaaS."
  - "A request for no third-party access rules out vendor-operated BYOC. Scope on-premises and air-gapped requests as separate models."
  - "Deployz covers vendor-operated BYOC on AWS for one supported architecture. It does not provide on-premises, air-gapped, Azure or GCP deployments."
sources:
  - title: "SaaS product guidelines for AWS Marketplace"
    url: "https://docs.aws.amazon.com/marketplace/latest/userguide/saas-guidelines.html"
    publisher: "Amazon Web Services"
  - title: "AMI-based products in AWS Marketplace"
    url: "https://docs.aws.amazon.com/marketplace/latest/buyerguide/buyer-server-products.html"
    publisher: "Amazon Web Services"
  - title: "Container-based products on AWS Marketplace"
    url: "https://docs.aws.amazon.com/marketplace/latest/userguide/container-based-products.html"
    publisher: "Amazon Web Services"
  - title: "Shared Responsibility Model"
    url: "https://aws.amazon.com/compliance/shared-responsibility-model/"
    publisher: "Amazon Web Services"
related:
  - "saas-in-customer-aws-account"
  - "ai-app-customer-cloud-data-privacy"
---

Pick the model from the requirement, not from the words the customer uses. In the setups this article compares, single-tenant SaaS gives a customer isolation, but it runs in your own cloud account and on your bill. Vendor-operated BYOC (bring your own cloud) runs your software in the customer's cloud account while you keep operating it. Self-hosted, as this article uses the term, hands operation to the customer. Match each request to the model that meets it with the least ongoing work for your team.

## Which model does your customer need?

A prospect says "we need this in our own environment" or "we can't share infrastructure with other customers." Those sentences can point to different delivery models. These are the four setups this article compares, described by whose account runs the software and who operates it:

- **Multi-tenant SaaS:** your account runs one copy for your customers together. You operate it.
- **Single-tenant SaaS:** your account runs a dedicated copy for one customer. You operate it.
- **BYOC, vendor-operated:** the customer's cloud account runs your software. You operate it through access the customer approves.
- **Self-hosted:** the customer's cloud account runs your releases. The customer operates them.

This article treats self-hosted on the customer's own servers as the on-premises case, covered below.

In this article, BYOC on its own says where the software runs, not who operates it. On AWS, AWS bills the account owner directly, so the customer pays for the resources in their account. Who operates the software depends on the setup you agree. See [what BYOC means for a small SaaS team](/blog/what-is-byoc/).

Find out first what the customer must control: the account, the bill, the Region, the network, or who can reach the software. For a longer list, see the [questions to ask when a customer wants your SaaS in their AWS account](/blog/saas-in-customer-aws-account/).

## How do the models compare?

This section compares the four setups on four points: whose account runs the software, who pays the cloud provider, who ships updates and who responds to incidents.

![Three delivery models stacked from top to bottom. Single-tenant SaaS: a dedicated copy for one customer inside your AWS account, which you operate and pay AWS for. BYOC, vendor-operated: your application inside the customer AWS account, connected to you, the vendor, by a line labeled "operates it through access that the customer approves"; the customer pays AWS. Self-hosted, shown for the cloud-account case: your release inside the customer AWS account, connected to you by a line labeled "ships releases and support, no operating access"; the customer team installs, updates and operates it, and pays AWS.](./byoc-vs-self-hosted-vs-single-tenant-models.svg)

For the setups described above, the responsibilities split like this:

| Model | Whose account runs it | Who pays the cloud provider | Who ships updates | Who responds to incidents |
| --- | --- | --- | --- | --- |
| Multi-tenant SaaS | Yours | You | You | You |
| Single-tenant SaaS | Yours | You, for each copy | You, to each copy | You |
| BYOC, vendor-operated | The customer's | The customer | You | You, within the access the customer approves |
| Self-hosted | The customer's | The customer | You publish releases; the customer applies them | The customer |

AWS Marketplace's SaaS guidelines say three things about where the software runs and who pays for it ([SaaS product guidelines for AWS Marketplace](https://docs.aws.amazon.com/marketplace/latest/userguide/saas-guidelines.html)):

- The application plane can run in the seller's AWS account, the buyer's AWS account or both.
- When the product needs resources in the buyer's account, the seller's control plane must stay in infrastructure the seller manages for the product to count as SaaS rather than a managed service.
- In that case, the seller must tell customers, in the product description, that they must pay any separate AWS infrastructure charges.

In single-tenant SaaS, each dedicated copy runs in your account, so plan for its cloud charges on your bill. Price each copy to cover its infrastructure and the time you spend on it.

## What is the difference between BYOC and self-hosted?

In both setups, the software runs in the customer's account. The difference is who operates it.

In vendor-operated BYOC, you keep operating it: you start updates, watch health and fix failures, through access the customer grants. In self-hosted, the customer does that work. AWS Marketplace AMI-based products have a similar split: they run in the customer's AWS account. AWS says the buyer keeps more control over the software configuration and the servers, and takes on more responsibility for server configuration and maintenance ([AMI-based products in AWS Marketplace](https://docs.aws.amazon.com/marketplace/latest/buyerguide/buyer-server-products.html)). Container-based products on AWS Marketplace ship as container images plus deployment templates that buyers launch themselves ([container-based products on AWS Marketplace](https://docs.aws.amazon.com/marketplace/latest/userguide/container-based-products.html)).

In self-hosted, the customer applies your releases, so plan to support the versions they run as well as your latest release.

The AWS Shared Responsibility Model divides duties between AWS (security of the cloud) and the AWS customer (security in the cloud) ([Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)). In BYOC and self-hosted, the AWS customer is your customer. The model names two parties, AWS and the AWS customer. Agree in your contract which security work you do in the customer's account.

## Is single-tenant SaaS the same as BYOC?

Not in the setups this article compares. Here, single-tenant SaaS isolates one customer from your other customers, but the copy runs in your account and on your bill. BYOC puts the resources in the customer's account. On AWS, AWS bills the account owner directly, so the customer pays for those resources.

So single-tenant SaaS, as described here, meets a request for separation from other tenants. It doesn't meet a request to own the account, the bill or the resources. Two questions tell the requests apart:

- Whose AWS account ID must own the resources?
- Whose bill must the AWS charges appear on?

If the customer answers "yours is fine" to both, single-tenant SaaS meets the ownership part of the request, and the resources stay in your own account. Check the other requirements, such as Region and network, separately.

## Match the request to the model

This table is this article's suggestion for a small team, not a measured ranking. Confirm the detail in the third column before you quote a price.

| The customer asks for | Model to start with | What to confirm |
| --- | --- | --- |
| Isolation from other customers | Single-tenant SaaS | Whether separate infrastructure in your account is enough, or they also need to own it |
| Our data in our own AWS account | BYOC, or self-hosted if the customer will operate it | Which data paths still leave the account, such as builds, model calls, logs, metadata and traffic routing |
| AWS costs on our own bill | BYOC, or self-hosted if the customer will operate it | That they accept your software fee in addition to their AWS charges |
| A specific AWS Region | Multi-tenant or single-tenant SaaS in that Region, if you can run there | Whether "in our Region" also means "in our account" |
| Private network, with no public endpoint | A network design you build for this case, in any model | Which paths they allow, such as VPN, PrivateLink or an existing VPC |
| No third-party access | Self-hosted | Whether their team can apply updates and handle incidents |
| On-premises or air-gapped | Self-hosted, packaged for that environment | How you deliver releases and support on their servers, and without internet access for an air-gapped site |

Two rows need care. "Our data in our account" is not the same as "no data leaves the account": external integrations that your application calls still control where they send data. For an AI application, see [what stays private when you deploy an AI app in a customer's cloud](/blog/ai-app-customer-cloud-data-privacy/). And "no third-party access" rules out the vendor-operated setup this article calls BYOC, because in that setup the vendor keeps operating access.

## Is customer-hosted the same as on-premises?

No. In this article, customer-hosted means BYOC or self-hosted in the customer's cloud account, on-premises means the customer's own servers, and air-gapped means no internet connection.

Scope on-premises and air-gapped requests as separate work: plan how you will package releases, deliver updates and give support there. Deployz doesn't provide on-premises or air-gapped deployments.

## Can you offer more than one model?

Yes. The choice can be per customer. For example, you can run multi-tenant SaaS by default and offer BYOC to customers whose contracts require their own account.

Before you offer another model, list the release, support and documentation work it would add for your team, and add it when a real customer needs it.

## Where Deployz fits

Deployz covers the vendor-operated BYOC case on AWS. It lets a small B2B software vendor run its web application inside each customer's own AWS account, without building a private-deployment platform. If you are weighing that option, see [BYOC deployments on AWS](/byoc-deployments/).

- **Install:** the customer opens your install link, reviews what will be created and what it costs, and approves one CloudFormation Quick Create stack in their own account. They need no Deployz account; they confirm their email with a one-time code. Deployz never asks for access keys or administrator credentials. The Deployz connector runs in the customer's account and connects out to Deployz.
- **Operate:** you deploy, roll back, restart, reconfigure, diagnose and remove customer deployments from one dashboard. The customer chooses the AWS Region for an install link or an invitation. You choose it for a test deployment or a deployment you create. The Region can't be changed after the deployment is created. See [AWS Regions](/docs/share/regions).
- **Pay:** the customer owns the AWS resources, and AWS bills them directly. Deployz charges are separate: $49 a month plus $19 a month for each billable customer deployment, from $68 a month, before taxes. See [pricing](/pricing/) for when billing starts and pauses. One active test deployment per application, in your own AWS account, has no Deployz charge. AWS still bills your account for the resources it creates.

Know the limits before you promise a customer:

- Deployz supports one application architecture on AWS. It doesn't provide on-premises, air-gapped or multi-Region deployments, and it doesn't support Azure or GCP.
- Deployz doesn't provide existing customer VPCs, PrivateLink, VPN or private-only applications. A customer who needs one of these needs another approach. See [what Deployz doesn't support](/docs/prepare/not-supported).
- Release images are built in Deployz's AWS account. Traffic to the default deployz.dev URL passes through the Deployz proxy on Cloudflare; a custom domain goes directly to the customer's load balancer. To see what Deployz receives from a deployment, read [Deployz security and architecture](/security/).
- A rollback doesn't reverse database migrations.

To follow the install and update steps in order, [see how it works](/how-it-works/).
