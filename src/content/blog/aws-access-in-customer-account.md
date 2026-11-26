---
title: "What AWS access should you ask for in a customer's account?"
seoTitle: "What AWS access to ask for in a customer account"
description: "Ask for an IAM role, not access keys. Learn how to split deploy and operate permissions, limit created roles, and let customers review and revoke access."
summary: "Ask for an IAM role that your account assumes with an external ID you generate for that customer, not for access keys. Scope it to deploying and operating your application, limit the IAM roles it can create, and give the customer a template to review and a way to revoke access."
slug: "aws-access-in-customer-account"
category: "Guides"
draft: false
author: "Team Deployz"
pubDate: 2026-11-26
cta: "security"
keyTakeaways:
  - "AWS describes third-party access as a role that the account owner creates and the vendor assumes, without sharing AWS security credentials."
  - "AWS says the external ID must be unique among your customers and controlled by you, not by your customers."
  - "We recommend that you keep the permissions to deploy apart from the permissions to operate. A CloudFormation service role is one way to do that."
  - "Limit the IAM roles your deployment creates with a permissions boundary, and scope access with tags."
  - "CloudTrail Event history shows 90 days of management events, and Revoke active sessions ends sessions issued before that time."
sources:
  - title: "Access to AWS accounts owned by third parties"
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html"
    publisher: "Amazon Web Services"
  - title: "The confused deputy problem"
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html"
    publisher: "Amazon Web Services"
  - title: "Security best practices in IAM"
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html"
    publisher: "Amazon Web Services"
  - title: "Methods to assume a role"
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html"
    publisher: "Amazon Web Services"
  - title: "Permissions boundaries for IAM entities"
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html"
    publisher: "Amazon Web Services"
  - title: "Define permissions based on attributes with ABAC authorization"
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html"
    publisher: "Amazon Web Services"
  - title: "CloudFormation service role"
    url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-servicerole.html"
    publisher: "Amazon Web Services"
  - title: "Use quick-create links to create CloudFormation stacks"
    url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stacks-quick-create-links.html"
    publisher: "Amazon Web Services"
  - title: "Control CloudFormation access with IAM"
    url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/control-access-with-iam.html"
    publisher: "Amazon Web Services"
  - title: "Using AWS IAM Access Analyzer"
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html"
    publisher: "Amazon Web Services"
  - title: "What is AWS CloudTrail?"
    url: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html"
    publisher: "Amazon Web Services"
  - title: "Revoke IAM role temporary security credentials"
    url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html"
    publisher: "Amazon Web Services"
related:
  - "saas-in-customer-aws-account"
  - "what-is-byoc"
---

Ask for an IAM role that your AWS account assumes with an external ID you generate for that customer, not for long-term access keys. Give the role what deploying and operating your application needs, limit the IAM roles your deployment can create, and give the customer a template to review and a way to revoke your access. The sections below turn that into a checklist you can send to a customer's security team.

## What AWS access should you ask for?

This checklist is our recommendation for a small team. The sections below give the AWS guidance behind items 1, 2, 4, 5 and 6.

1. An IAM role in the customer's account, not an IAM user with access keys.
2. A trust policy that requires an external ID that you generate for that customer.
3. Permissions to deploy your application, kept apart from the permissions to operate it.
4. A permissions boundary on each IAM role that your deployment creates.
5. A CloudFormation template that the customer launches from a quick-create link.
6. A short note on how the customer can audit your calls in CloudTrail and revoke your access.

The illustration shows the pieces: your AWS account, the role in the customer's account, and the limits on what that role can create.

![A vendor role and a customer role across two AWS accounts. At the top, your AWS account holds your service's IAM role. A line labeled "AssumeRole with the customer's external ID" and "AWS STS returns temporary credentials" connects it to a cross-account role in the customer AWS account, whose trust policy has an sts:ExternalId condition. A second line, labeled "creates and updates", goes from that role to your application's resources, which include the IAM roles your stack creates, limited by a permissions boundary and by tags. CloudTrail records the calls the role makes.](./aws-access-in-customer-account-role.svg)

This is the basic cross-account role pattern that AWS describes; the service role section below splits the "creates and updates" step. Deployz uses a connector inside the customer's account instead; see [how Deployz handles customer AWS access](#how-deployz-handles-customer-aws-access).

## Why ask for a role instead of access keys?

AWS's IAM User Guide describes third-party access this way: the account owner creates a role, and the third party assumes it, without the owner sharing AWS security credentials. To create the role, the owner needs your AWS account ID, an external ID and the permissions you require. Then they give you the role's ARN (Amazon Resource Name). The same page notes that the third party's use of resources in the account is billed to the account owner, which here is your customer. See [access to AWS accounts owned by third parties](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html).

AWS's [security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) say that workloads should use temporary credentials through IAM roles. When your service calls `AssumeRole`, the temporary credentials last at least 15 minutes and one hour by default. If your service calls `AssumeRole` with credentials from another IAM role (role chaining), the session is limited to one hour. Otherwise the maximum is the role's maximum session duration, which can be set from 1 to 12 hours ([methods to assume a role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html)).

## What is an external ID, and who generates it?

An external ID protects against the confused deputy problem. AWS describes that problem as an entity without permission getting a more-privileged entity to act for it. For a vendor, it looks like this:

1. A customer gives your service the ARN of a role in their account.
2. Role ARNs are not secret, so a second customer could give your service that same ARN.
3. The external ID check is what stops the second request.

If each customer's trust policy requires an external ID that is unique to that customer, and your service always sends the external ID of the customer that made the request, AWS says this helps prevent your service from acting on the wrong account ([the confused deputy problem](https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html)).

AWS says that the external ID must be unique among your customers and controlled by you, not by your customers. So generate one for each customer, show it to them during setup, and don't let them choose it.

## Separate deploy access from operate access

This split is our recommendation, not an AWS rule. For example, deploying an application can mean creating its network, compute, storage and the IAM roles that your workload runs as. Operating it afterward can mean updating it to a new release, restarting it, checking its health and removing it. Ask for each set of permissions on its own terms.

The IAM best practices page asks you to grant only the permissions required to perform a task, and it warns that AWS managed policies might not grant least-privilege permissions for your use case. So write your own policies instead of asking for a broad managed policy.

A CloudFormation service role is one way to keep the two apart. With a service role, CloudFormation creates, updates and deletes the stack's resources with that role's permissions instead of the caller's. Passing the role requires `iam:PassRole`, and you can't remove a service role from a stack after the stack is created. AWS also warns that other users with permission to work on the stack can use its service role, so keep that role least-privilege ([CloudFormation service role](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-servicerole.html)).

## How do you limit the IAM roles your deployment creates?

If your deployment creates IAM roles for your workload, limit what those roles can do. Two AWS features help with this.

- **Permissions boundaries.** A permissions boundary is a managed policy that sets the maximum permissions an identity-based policy can grant. The effective permissions are those that both policies allow, and an explicit deny in either one wins. AWS shows how to delegate user creation with a condition on the permissions boundary: the delegated administrator can create IAM users on the condition that they carry a set boundary, which caps what the users' identity-based policies can grant. Apply the same idea to the roles your deployment creates ([permissions boundaries for IAM entities](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html)).
- **Tags.** With attribute-based access control (ABAC), a policy can allow an action when the principal's tag matches the resource's tag. Tag your role and the resources your deployment creates with the same value, and the policy lets your role act on resources whose tag matches its own ([ABAC authorization](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html)).

## What does the customer review before approving?

Give the customer a CloudFormation template instead of IAM policy text to paste. A quick-create link opens the **Quick create stack** page with the template URL, the stack name and parameter values filled in. The customer can change the values, view the template and create a change set before they create the stack. CloudFormation ignores parameters marked `NoEcho` (typically user names and passwords) in the link, so you can't prefill those parameters that way. The values that you do prefill are part of the link's query string, and the customer can change them on the page before creating the stack. AWS recommends that templates reference secrets stored in Secrets Manager or Parameter Store instead of embedding them ([quick-create links](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stacks-quick-create-links.html)).

If the template creates IAM resources, the customer must select **I acknowledge that this template may create IAM resources**. CloudFormation requires this acknowledgement, called an IAM capability, so that the user reviews the permissions first ([control CloudFormation access with IAM](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/control-access-with-iam.html)).

The customer's security team can also use IAM Access Analyzer. It validates policies and reports IAM roles that are shared with principals outside the zone of trust, which is the account or organization that the analyzer treats as trusted. Some of its analyzers have charges ([IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html)).

## How can the customer audit and revoke your access?

Tell the customer where to look and how to stop you.

- **Audit.** CloudTrail **Event history** gives a searchable record of the past 90 days of management events in each Region, with no CloudTrail charge ([what is AWS CloudTrail?](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)).
- **Revoke.** In the IAM console, **Revoke active sessions** attaches an inline policy to the role. It denies actions to sessions that were issued before that time. Without that step, temporary credentials that were already issued keep working until they expire ([revoke IAM role temporary security credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html)).

Also tell the customer what happens to your application's resources and data when your access ends, so that they can plan the cleanup.

## How Deployz handles customer AWS access

Deployz takes a different shape from a role that your account assumes. The AWS calls run from a connector inside the customer's account.

- **Approval.** The customer reviews what will be created and what it costs, and approves one CloudFormation Quick Create stack in their own account. Deployz never asks for access keys or administrator credentials. See [what the customer checks before installing](/docs/customers/before-you-install).
- **The connector.** The stack contains the relay (the connector's Lambda function) on a one-minute schedule, or five minutes on connectors published before the schedule change, its IAM role with a permissions boundary, the CloudFormation execution role, and the relay credential in Secrets Manager. The relay connects out to Deployz and makes the AWS calls in the customer's account. The Deployz control plane holds no customer AWS credentials. It sends HTTPS probes to the application's public address.
- **Traffic.** Traffic to the default deployz.dev address passes through Deployz's Cloudflare zone, where TLS ends. A custom domain sends traffic straight to the customer's load balancer.
- **Limits.** The connector's write grants are limited to the resources of its own deployment, with the exceptions in the next two items and the older connectors described below. Where AWS evaluates tags, the limit is the deployment's installation tag. Otherwise it's the resource name.
- **Relay exceptions.** Reads and discovery (Describe and List calls, bucket tags) have no condition. Neither does the ECS action that deregisters task definitions, which ECS supports only on all resources. The relay code limits that action to the deployment's own task families.
- **Execution role exceptions.** The CloudFormation execution role has no permissions boundary of its own. It can deregister ECS task definitions and generate random passwords in Secrets Manager on all resources. It also gets the ElastiCache default parameter group and member cache nodes without a tag.
- **Roles it can create.** The execution role can create roles only under the deployment's name prefix, only with its installation tag, and only when the role carries the connector's application role boundary. IAM can't limit a role's trust policy, so a created role can still trust another account; the application role boundary is what limits what that role can do.
- **Logs.** The relay has no log-reading permissions.
- **Older connectors.** A connector installed before these per-deployment limits keeps its wider grants until the customer updates the connector stack.
- **Removal.** You remove the deployment from the Deployz dashboard. Removal keeps the database, its credentials, the S3 bucket and the network parts the database uses.
- **Retained data.** These keep causing AWS charges until you delete the retained data from the Deployz dashboard, or the customer deletes them in their AWS console.
- **Last step.** After the retained data is deleted, the customer deletes the connector stack to end Deployz access. See [remove the application from your AWS account](/docs/customers/remove).

For the full permission list, see [security and AWS access for customers](/docs/customers/security) and [AWS resources Deployz creates](/docs/reference/aws-resources). To see how the connector, data and removal fit together, [review security and architecture](/security/).
