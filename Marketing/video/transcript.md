# Deployz product walkthrough transcript

Narration: local synthetic voice. This video uses a live product capture and labelled diagrams. It is not a recording of a new AWS installation.

## 1. Deploy your SaaS into customer AWS

A customer wants your SaaS in their AWS account. Deployz helps small teams prepare and manage supported customer installations. This walkthrough uses a real configuration capture and labelled product diagrams. It does not show a new live deployment.

## 2. Check the app before installation

Connect GitHub with read-only access. Deployz checks what the app needs. Review the readiness report for required values and code blockers. The report is advisory and can miss code behavior. Your team fixes relevant issues before testing. Deployz does not change the repository.

## 3. Review resources and settings

This is a real resource configuration screen. It shows the web service, runtime, port, and health check. Review the detected resources and provide required settings. Build a versioned release from a commit. Test the release in your own AWS account. AWS resource charges still apply.

## 4. Your customer approves AWS access

Send your customer an installation link. They review the resources, estimated AWS costs, and requested permissions. They approve a connector in their own AWS console. The connector calls out to Deployz. Your customer owns the resources and pays AWS directly. They do not need a Deployz account.

## 5. Deploy the selected release

Deployz creates the supported infrastructure and deploys the selected release. The environment becomes ready after its health check passes. The current architecture supports one Linux x eighty six sixty four image, an HTTP service, and optional workers from the same image. It creates a new dedicated VPC in AWS.

## 6. Choose each customer's release

Choose the release for each customer. Start updates and check deployment status. If a new version fails its health check, the previous version keeps running. Rollbacks do not reverse database migrations. Review migration compatibility before you update a customer environment.

## 7. Review data flows and costs

Deployz receives deployment metadata. Builds run in Deployz's AWS account. The default app URL uses a Deployz proxy. App integrations can send data to external services. Subscriptions start at sixty eight US dollars per month, including one customer environment. The fee is forty nine dollars plus nineteen dollars per billable environment per month. AWS costs are separate.

## 8. Get Started Free at deployz.dev

Start with a free evaluation. Connect GitHub, review readiness, and test one supported app deployment in your own AWS account. No card or time limit. AWS charges apply. Check the architecture and pricing details at deployz dot dev. For product questions, contact help at deployz dot dev.
