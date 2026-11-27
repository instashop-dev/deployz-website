---
title: "Prepare your app for customer-hosted deployment: Dockerfile, health check and migrations"
seoTitle: "Prepare your app for customer-hosted deployment"
description: "A pre-flight checklist for running your app in a customer's AWS account: Dockerfile, port, health check, migrations, configuration and storage."
summary: "Ship one production image that listens on 0.0.0.0 at a known port, answers a health path, keeps no state on local disk and reads per-customer settings at runtime. Prefer a separate migration step before the rollout, keep migrations backward compatible, and confirm it with a test deployment."
slug: "prepare-app-for-customer-hosted-deployment"
category: "Guides"
draft: false
author: "Team Deployz"
pubDate: 2026-11-27
cta: "signup"
keyTakeaways:
  - "In Deployz, the connector cannot read application logs, so check the port, bind address and health path before the first customer install."
  - "Listen on 0.0.0.0 at the configured port, and give the health check a path that answers 200 without a login."
  - "Deployz runs a migration command as a one-shot task before services update. Retries can run it again, so make it safe to repeat."
  - "A Deployz rollback never reverses database migrations, so keep each migration compatible with the previous release."
  - "Deployz has no per-customer builds: put per-customer values in runtime variables and keep secrets out of the image."
sources:
  - title: "Determine Amazon ECS task health using container health checks"
    url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/healthcheck.html"
    publisher: "AWS (Amazon ECS Developer Guide)"
  - title: "Health checks for Application Load Balancer target groups"
    url: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html"
    publisher: "AWS (Elastic Load Balancing User Guide)"
  - title: "Amazon ECS service definition parameters"
    url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service_definition_parameters.html"
    publisher: "AWS (Amazon ECS Developer Guide)"
  - title: "Best practices for Amazon ECS container images"
    url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/container-considerations.html"
    publisher: "AWS (Amazon ECS Developer Guide)"
  - title: "Use bind mounts with Amazon ECS"
    url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/bind-mounts.html"
    publisher: "AWS (Amazon ECS Developer Guide)"
  - title: "Building best practices"
    url: "https://docs.docker.com/build/building/best-practices/"
    publisher: "Docker (Docker Docs)"
  - title: "Build secrets"
    url: "https://docs.docker.com/build/building/secrets/"
    publisher: "Docker (Docker Docs)"
  - title: "Multi-platform builds"
    url: "https://docs.docker.com/build/building/multi-platform/"
    publisher: "Docker (Docker Docs)"
  - title: "The Twelve-Factor App: Admin processes"
    url: "https://12factor.net/admin-processes"
    publisher: "The Twelve-Factor App"
  - title: "The Twelve-Factor App: Config"
    url: "https://12factor.net/config"
    publisher: "The Twelve-Factor App"
  - title: "Expand and contract pattern"
    url: "https://www.prisma.io/docs/orm/prisma-migrate/workflows/expand-and-contract"
    publisher: "Prisma (vendor documentation)"
  - title: "Connection refused? Docker networking and how it impacts your image"
    url: "https://pythonspeed.com/articles/docker-connection-refused"
    publisher: "Python Speed (Itamar Turner-Trauring)"
related:
  - "saas-in-customer-aws-account"
  - "byoc-vs-self-hosted-vs-single-tenant"
---

To run reliably in each customer's AWS account, your app needs one production image that listens on 0.0.0.0 at a known port, answers a health path, keeps no state on local disk and reads per-customer settings at runtime. Prefer a separate migration step before the rollout, keep migrations backward compatible, and confirm the result with a test deployment in your own AWS account before the first customer installs.

In this article, a customer-hosted deployment means a separate copy of your application, with its own storage and, when it needs one, its own database, running in a customer's own AWS account.

Each section names the AWS or Docker behavior behind a requirement, then what Deployz does. A checklist near the end sums up the items. If you are still deciding whether to offer this, start with [your customer wants your SaaS in their AWS account](/blog/saas-in-customer-aws-account/).

## Why check your app before the first install?

In Deployz, the connector that runs in the customer's account has no permission to read logs. The customer's runtime logs stay in their account, and Deployz never copies them out. So in Deployz, a wrong container port shows up as a failed health check, because Deployz has no runtime log access.

Check each item below before the first install, and prove the result in your own AWS account. The [application requirements](/docs/prepare/requirements) page lists what Deployz supports.

## What should the Dockerfile look like?

Docker's [building best practices](https://docs.docker.com/build/building/best-practices/) list these points:

- Use a multi-stage build (a Dockerfile with several build stages) to keep the final image small.
- Choose a small base image from a trusted source. Pin it by digest, because tags are mutable.
- Add a `.dockerignore` file.
- Run as a non-root user with `USER` when possible.

### What Deployz expects from the Dockerfile

- Deployz builds each release from a commit with CodeBuild in Deployz's AWS account. A deploy targets the pinned image digest.
- The Dockerfile must build a production image from the repository source. If it copies a file or directory that the repository does not contain, such as a build output that a CI step makes first, the readiness check blocks it.
- A Dockerfile that starts a dev server, such as `npm run dev` or `nodemon`, is never selected.
- The source archive has no `.git` directory. A Dockerfile that copies `.git`, or reads git history without a fallback, needs a repository change.
- One image runs the web service, the workers and the migration task. A worker that needs a different Dockerfile is not supported.
- If you use a migration command, keep `sh` in the final image. A migration command replaces the image ENTRYPOINT and runs through `sh -c`, so an image built `FROM scratch` cannot run it.

## Do you need to build for linux/amd64?

Your release image must not be an ARM64 image: Deployz does not support ARM64 containers. Deployz builds the release image from your Dockerfile with CodeBuild in Deployz's AWS account.

Docker's [multi-platform builds](https://docs.docker.com/build/building/multi-platform/) page explains that code in a container must match the host architecture: a `linux/amd64` container does not run on an arm64 host without emulation. The `--platform linux/amd64` flag sets the target platform for a build.

## Why can the load balancer not reach your app?

Check the bind address first. [Python Speed explains](https://pythonspeed.com/articles/docker-connection-refused), in a third-party article on Docker networking, that a server listening on 127.0.0.1 inside the container refuses traffic forwarded from outside it, and that listening on 0.0.0.0 fixes it.

What Deployz does with the port and bind address:

- Deployz injects a `PORT` variable as a managed value.
- Analysis detects the container port, first from `ENV PORT` or `EXPOSE` in the production stage of your Dockerfile, then from other evidence: a HEALTHCHECK, the production Compose file or a port in your source. You can override the detected port.
- Analysis has a bind address check for loopback-only servers. A loopback bind address is a required repository change.
- A changed port or health path applies to deployments that you create after the change, so check both before the first install.

## Which health check does ECS act on?

Two health checks matter for an app on Amazon ECS behind an Application Load Balancer. This section describes AWS behavior in general; what Deployz does is under "What Deployz checks".

### The container health check

The [Amazon ECS container health check](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/healthcheck.html) is a command that ECS runs inside the container, as defined in the task definition. Exit code 0 means healthy. ECS monitors only health checks in the task definition: a Docker `HEALTHCHECK` in your image is not monitored unless the container definition specifies one. Because the command runs inside the container, the tool it calls, for example `curl`, must be in the image. A service replaces a task that becomes UNHEALTHY.

### The target group health check

The [target group health check](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) is the request an Application Load Balancer sends to each registered target to decide whether the target receives traffic. By default, the check is an HTTP GET request on `/` that expects status 200. A new target must pass one check before it receives traffic.

According to the [ECS service definition parameters](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service_definition_parameters.html), during a deployment ECS counts a task behind a load balancer toward the minimum healthy percent only when its target group check is healthy. If an essential container has a health check, the task must also be healthy.

### What Deployz checks

- **Health path.** Analysis takes the URL that the production HEALTHCHECK or a production Compose app service probes, then a dedicated health route that your app registers, then the Spring actuator route. You can set the path yourself.
- **Status codes.** The target group counts HTTP 200 as healthy. It also counts 400 when analysis finds that your app checks the Host header, for example with Django `ALLOWED_HOSTS` or Rails `config.hosts`, because in Deployz the load balancer health check sends the task IP as the Host.
- **No health path.** When there is no health evidence, or your own HEALTHCHECK probes `/`, the check probes `/` and counts 200 to 399, so a redirect passes.
- **Saved path.** If you save a health path, use one that answers 200 without a login, such as a dedicated health route. A saved path accepts only 200, and a login page answers with a redirect.
- **Promotion.** CloudFormation success never means healthy in Deployz. A release is promoted only when the rollout completed, the task counts are full, the load balancer targets are healthy and the HTTP probe succeeds.

## How long can your app take to start?

In Amazon ECS, the service's health check grace period is the time the scheduler ignores unhealthy load balancer and container health checks after a task first starts. Its default is 0. It is a separate setting from the container health check's start period.

Deployz sets a 300-second health check grace period on the web service, so an app that migrates at boot is not stopped before it listens.

Measure your start time, including a boot migration, in your test deployment, and keep it inside the 300 seconds.

## Should migrations run at boot or as a one-shot task?

[The Twelve-Factor App](https://12factor.net/admin-processes) recommends running admin tasks such as migrations as one-off processes, with the same code and config as the release.

### With a migration command

When your application has a migration command, Deployz runs it as a one-shot ECS task during a release deployment: after the infrastructure and the database are ready, and before any service updates. Only exit code 0 from the application container counts as success. If the migration fails, the job fails with `MIGRATION_FAILED`, no service is updated and the previous release keeps serving. An install with a migration step begins with zero tasks, so if the migration fails on the first start, nothing is serving yet and the deployment is marked failed. Fix the migration, then deploy again to recover it.

![Deploy order for a release: inside the customer AWS account, the Deployz connector starts a one-shot migration task, which must exit 0; a non-zero exit updates no service, and a release that is already running keeps serving (on the first start of an install nothing serves yet, and the deployment is marked failed). On exit 0, the connector rolls the ECS services to the new image digest and the load balancer health check runs with a 300-second grace period. The connector heartbeat reports the result to the Deployz control plane, outside the account, which promotes the release only when the rollout is complete, the task counts are full, the targets are healthy and the HTTP probe passed. A dashed, blocked line shows that the connector has no access to the application logs, which stay in the account.](./prepare-app-for-customer-hosted-deployment-deploy-order.svg)

A migration that succeeded with the same command and the same image digest does not run again. It can still run more than once:

- It runs again on each release deployment until a job with the same command and image digest has succeeded.
- Retry update creates a new job, so retrying a failed update can run it again.
- A corrected migration command counts as new, so it runs again even for the same image.

So write the command to be safe to run more than once. Other limits:

- If analysis cannot confirm that your image can run the migration command, it asks you a blocking **Needs input** question. You can't create a deployment until you enter a command or choose **No separate migration**.
- A deployment that was created without a migration step cannot get one later.
- Rollback and restart never run migrations.

The [database migrations](/docs/prepare/migrations) docs page has the exact settings.

### Migrations at boot

If your app runs migrations from its own start path, for example a knex `migrate.latest()` call or a Rails entrypoint that runs `bin/rails db:prepare`, analysis sets the migration mode to startup and keeps no separate migration command. The 300-second grace period is there so that an app that migrates at boot is not stopped before it listens.

## Why does a rollback not undo your schema?

A Deployz rollback to a previous release restores only the image and the service configuration. It never reverses database migrations, and every rollback action carries the warning "Application rollback does not automatically reverse database migrations." So after a rollback, the older release can run against a schema that a newer release migrated.

An install deploys your newest ready release automatically. After that, you choose which release each customer runs, and you start each deploy, rollback and restart. Creating a release never updates a customer. So your customers can run different releases.

[Prisma's documentation describes the expand and contract pattern](https://www.prisma.io/docs/orm/prisma-migrate/workflows/expand-and-contract) for this. You add the new structure next to the old, make your app write to both, migrate the existing data, move reads to the new structure, stop writing to the old one, and then remove it.

A failed update on a deployment that already serves a release keeps that release running. The ECS circuit breaker restores a service whose rollout failed, and the Deployz connector puts workers back on their previous revision. An install that must run configuration or a migration before its first start begins with zero tasks. If its first deploy fails, nothing is serving yet, so the deployment is marked failed, and deploying again recovers it. See [roll back a deployment](/docs/operate/rollback) for the steps.

## Which settings are build-time and which are runtime?

[The Twelve-Factor App](https://12factor.net/config) puts config that varies between deploys, such as database handles and credentials, in environment variables, separate from code. Docker's [build secrets](https://docs.docker.com/build/building/secrets/) page adds that build arguments and environment variables are not suitable for secrets, because they persist in the final image. It recommends secret mounts instead.

In Deployz:

- Build-time values that you set as the vendor are baked into the image. Missing values block release creation. A value reaches Docker only as `--build-arg NAME`, so your Dockerfile must declare `ARG NAME`.
- Build-time secrets are decrypted inside the release build in Deployz's AWS account. If your Dockerfile copies one into an `ENV` instruction or a file, the release image records it.
- Deployz has no per-customer builds, and customer-provided build-time values are not available yet. So a value that differs per customer must be a runtime variable.
- Each detected variable is classified as **Managed by Deployz**, **Set by vendor**, **Set by customer** or **Optional**. Deployz injects the managed values, including the `DATABASE_*` names, the Redis values, the S3 bucket, `AWS_REGION` and `PORT`.
- Deployz-generated secrets, such as `SECRET_KEY_BASE`, are created by the connector inside the customer's account and never stored in the Deployz control plane. The application stack's own secret parameters are different: the Deployz API generates them for each install, and they are masked once the connector claims the install job.

To set these up, see [configure environment variables](/docs/prepare/environment-variables).

## Where can your app keep files?

[Amazon ECS bind mounts](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/bind-mounts.html) are tied to the container lifecycle: when the containers that use one stop, for example when a task stops, the data is removed.

Deployz does not support persistent volumes or local disk state, including a data directory or a configuration file that the image expects to be mounted. Analysis reports local disk writes and persistent volumes as required repository changes.

Deployz always creates one S3 bucket, and provisions PostgreSQL 16 or MySQL 8.0 when your app requires a database. When a deployment is removed, the database and the bucket are retained.

## One process per container and clean shutdowns

The [Amazon ECS container image best practices](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/container-considerations.html) ask you to run one application process per container, to handle `SIGTERM` (ECS sends `SIGTERM`, then `SIGKILL`) and to log to stdout and stderr.

Deployz does not support an image that runs several supervised processes, such as s6-overlay, supervisord or a start script that puts two or more long-running servers in the background. Run background work as declared workers instead: each worker runs as its own ECS service from the same image, with one task and no HTTP health check.

## Pre-flight checklist

| Check | Why it matters | What happens in Deployz |
| --- | --- | --- |
| The Dockerfile builds from repository source | Deployz builds each release from a commit | The readiness check blocks a Dockerfile that copies files the repository lacks |
| The final image contains `sh` | Migration commands run through `sh -c` | An image built `FROM scratch` cannot run the migration |
| The image is not ARM64 | Code in a container must match the host architecture (Docker) | ARM64 containers are not supported |
| The app listens on 0.0.0.0 at the detected or configured port | A server on 127.0.0.1 refuses forwarded traffic (Python Speed) | A wrong port shows up as a failed health check |
| The health path answers 200 without a login | The load balancer default expects 200 (AWS) | A saved path accepts only 200, not a redirect |
| The app listens within the grace period | ECS ignores unhealthy checks during the grace period (AWS) | The grace period is 300 seconds |
| The migration command is safe to run more than once | Retries and corrected commands can run it again | A failed migration stops the update with `MIGRATION_FAILED` |
| Migrations work with the previous release | Rollback does not reverse migrations | The older release can run against the migrated schema |
| Per-customer values are runtime variables, and no secret is copied into the image | Build arguments persist in the image (Docker) | There are no per-customer builds |
| No state on local disk | Bind mount data is removed when a task stops (AWS) | Local disk writes are a required repository change |
| One process per container that handles `SIGTERM` | ECS sends `SIGTERM`, then `SIGKILL` (AWS) | Supervised multi-process images are not supported |

## Confirm with a test deployment

Deployz gives you one free test deployment per application in your own AWS account, through the same install flow that your customers use. Deployz does not charge for it, but AWS bills you for the resources it creates in your account. The readiness verdict is a prediction, not a guarantee, so the test deployment is the proof. If it fails its health check, start with [fix startup and health check failures](/docs/troubleshooting/startup-and-health).

Connect GitHub to get a readiness report for your repository, then [run a test deployment](/docs/share/test-deployment). To see the whole flow, read [how Deployz deploys into a customer's AWS account](/how-it-works/).
