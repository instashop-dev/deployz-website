# Sales guide and objections

Use this guide with the sales deck and product sheet. The FAQ PDF contains customer-facing answers.

## First conversation

Ask what caused the customer AWS request. Confirm the required cloud, account owner, application architecture, data services, and release process.

Ask whether the customer requires an existing VPC, private networking, audit evidence, a specific contract, or other conditions. Record the requirement. Do not promise support before technical review.

## Discovery questions

1. Who asked for customer AWS hosting, and why?
2. Does the app build as one Linux x86-64 container image?
3. Does it answer HTTP requests? Do workers use the same image?
4. Which database, cache, storage, and integrations does it need?
5. Will the customer accept a new VPC?
6. Who approves IAM access and pays AWS costs?
7. Which data goes to model APIs or other external services?
8. How do you handle database migrations and customer updates?
9. What must a test prove before the customer can approve installation?

## Objection handling

**We could build the deployment scripts ourselves.**

You can. Compare the work for installation links, infrastructure setup, release selection, update status, and removal. Test Deployz against your actual app. No measured savings claim is available in this kit.

**Our customer has strict security requirements.**

Start with the security brief. Ask for the customer's requirements and compare them with the actual connector permissions and data flows. Deployz has not completed its own SOC 2 audit.

**We need a different architecture.**

Explain the supported scope. If the app needs an existing VPC, several separate images, GPUs, another cloud, or on-premises hosting, record the gap. Do not present a future feature as available.

**We want to try it without a subscription.**

The evaluation includes analysis, configuration, builds, and one active test deployment per app in your own AWS account. AWS charges apply. Customer installations require an active subscription.

**We do not want a vendor dependency.**

The app runs on standard AWS services. Future operations become your responsibility if you leave Deployz. Default URLs depend on the proxy. New tasks pull images from the Deployz registry.

## Next step

For a supported app, agree on a test and use the evaluation checklist. For an unsupported requirement, record the exact limit and stop the sales sequence. For an open technical question, use help@deployz.dev.
