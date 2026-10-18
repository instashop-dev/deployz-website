---
title: "Deploying an AI app in a customer's cloud: what stays private?"
description: "Learn where documents, prompts, embeddings, model calls and logs travel, and how to explain an AI application's data boundaries to customers."
slug: "ai-app-customer-cloud-data-privacy"
category: "Guides"
draft: true
---

Moving an AI application into a customer's AWS account gives them control over the resources deployed there. It does not, by itself, tell you where every piece of data goes.

A document may be stored in their account while an extract is sent to a model API. A response may return safely while a debugging tool records the full prompt elsewhere.

**To explain what stays private, follow the data through a complete request.** Include the model, integrations, logs and people who can access them.

This is useful work for both sides: the customer gets a clear answer, and your team knows which deployment requirements it can meet.

## Start with a real workflow

Imagine an assistant that answers questions about a company's contracts. This is an illustrative architecture, not a description of a specific product.

A user uploads a contract. The application stores it, prepares it for search, retrieves relevant passages and sends those passages with a question to a model.

That search-and-answer pattern is often called retrieval-augmented generation, or RAG. The model receives selected context rather than automatically reading every document.

The processing locations depend on how you build the system:

![Diagram of one possible design. The user browser connects to the AI application in the customer AWS account. In that account, the application reads and writes documents and the search index, and writes application logs. The application sends the question and selected passages to a model service outside the account and receives the generated response. If configured, it also sends data to an external telemetry service.](./ai-app-data-flow.svg)

The diagram shows one possible design. Document parsing, search preparation and other integrations may introduce additional destinations. The model service could be a hosted API or an AWS-managed service; self-hosted inference would have a different boundary.

## Map the data, not just the servers

For each stage, record what data is involved, where it is processed, where it is stored, who can access it and how long it remains.

| Stage | What to inspect |
| --- | --- |
| Upload and parsing | Original files, temporary copies and any external document-processing service |
| Search preparation | Text extracts, the embedding service and the search index |
| Model request | User question, retrieved passages, conversation history and tool results |
| Generated response | Storage, browser delivery, caches and downstream destinations |
| Diagnostics | Application logs, error reports, AI traces and support exports |
| Retention and deletion | Backups, old file versions, indexes, caches and service-side storage |

An embedding is a numerical representation used to find related content. It is still derived from customer information. Do not assume it is harmless because it is a list of numbers.

If an external service creates embeddings, text reaches that service before it reaches your search index. OWASP also identifies risks around unauthorized access and information exposure in vector and embedding systems. [OWASP vector and embedding guidance](https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/)

## Separate application hosting from model processing

There are three common arrangements:

| Model arrangement | Where the model runs | What to verify |
| --- | --- | --- |
| Hosted model API | A provider-operated environment | Data sent, processing location, retention, access and applicable terms |
| AWS-managed model service | AWS-managed service infrastructure | Service, model, API, region or routing settings, retention and logging |
| Self-hosted model | Infrastructure you deploy in the customer's account | Runtime access, outbound connections, logs, storage and operational requirements |

These are architectural choices, not a list of capabilities every deployment platform provides.

An AWS-managed service is not necessarily a model server deployed in your own account. For example, Amazon Bedrock describes model deployment accounts operated by the Bedrock service team. Its documentation says model providers do not have access to those accounts or customer prompts and completions. [Bedrock data protection](https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html)

That still leaves configuration questions to answer. Check the exact service and feature you use rather than making a blanket claim about every API or model.

### Ask separate questions about training and retention

“Is our data used for training?” and “Is our data retained?” are different questions.

Also check whether data is stored for application features, inspected under abuse-detection processes, or copied into logging destinations you configure.

“No training” is not a complete description of data handling. Review current provider documentation and the settings applicable to your account and workload. [Bedrock data retention](https://docs.aws.amazon.com/bedrock/latest/userguide/data-retention.html)

Self-hosted inference can reduce external model-processing dependencies. It also makes model serving part of your operating responsibility. Check compute needs, model licensing, updates and the quality your application requires.

## Check the less obvious copies

Privacy reviews often focus on the model request while overlooking the tools surrounding it.

An error report might contain the user question. An AI tracing tool might capture retrieved contract passages. A support engineer might receive a full conversation when a request identifier would have been enough.

Review what each tool actually collects.

For example, Amazon Bedrock supports optional invocation logging that can capture model inputs and outputs into CloudWatch Logs or S3. Application teams need to consider those copies as part of their design. [Bedrock invocation logging](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html)

Prefer diagnostic metadata, such as request identifiers, timing and error categories, when content is unnecessary. Where content logging is required, define access and retention explicitly.

Deletion needs the same care. Removing the original document may leave extracts, search entries, cached responses or backups. Define what deletion covers and when retained copies expire.

## Treat access and agent actions as separate controls

A resource can sit in the customer's account while vendor staff, support tools or application roles still have access to it.

List those identities and the permissions each one needs. Use AWS roles and temporary credentials where appropriate, and keep permissions limited to the task. [AWS IAM security practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

For agents, check what they can do as well as what they can read.

An assistant that summarizes contracts should not automatically have permission to email documents externally or delete them. Enforce access in application code and connected services. Do not rely on a prompt that tells the model to behave.

OWASP recommends limiting tool functionality and permissions, enforcing authorization, and requiring approval for high-impact actions. [OWASP excessive agency guidance](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)

A separate customer deployment also does not replace application-level authorization. Two employees using the same instance may have different rights to the documents stored there.

## Verify the map before making the promise

Run a representative request using synthetic data you can recognize. Test successful requests, failures and an enabled agent action.

Inspect:

- Model, embedding, parsing and integration endpoints.
- The fields actually sent in requests.
- Application logs and configured telemetry destinations.
- Stored files, search entries and conversation records.
- Support access and exported diagnostic information.
- Deletion behavior, including documented backup retention.

Application instrumentation, service settings and network observations provide different pieces of evidence. A network connection alone may reveal the destination without showing the encrypted request body. Use several checks to verify the complete path.

Repeat the review when changing providers, SDKs, tracing tools or application features.

## Explain the result in plain language

Give customers a specific statement they can evaluate. For an application that matches it, an illustrative explanation might be:

> Documents and the search index are stored in your AWS account. Selected passages are sent to the agreed model service to generate answers. We document the service, processing settings, retention and diagnostic data separately.

Complete that explanation with actual destinations, access rules and retention periods. Avoid using “everything stays in your cloud” when the request crosses additional boundaries.

## Where Deployz fits

Deployz addresses the application deployment part: distributing supported web applications into customer-owned AWS accounts and managing their deployment lifecycle.

Your application's model calls, document processing, telemetry and agent permissions still need their own design and review. Deployz does not currently provide GPU hosting or private-only web deployments.

Review the deployment platform's boundaries too. In Deployz's current architecture, builds and release images are handled in its control plane, while application runtime logs remain in the customer's account. Default deployment URLs use Cloudflare's edge, and vendor-managed custom domains route directly to the customer's load balancer.

**[Explore Deployz](https://deployz.dev/) as the deployment layer, then map the complete data path for your AI application.**
