# CSEC 3 - Cloud Computing (Microsoft Azure)

> Verbatim copy of the original final project brief. Kept here for future reference.

**Final Project:** Cloud Web Application Deployment on Azure
**Course:** CSEC 3 - Cloud Computing
**Term:** AY 2025-2026, 2nd Semester
**Total Points:** 100
**Project Type:** Group (2-3 members)
*(Note: If done individually, a point deduction will apply)*
**Submission:** GitHub repository link + live demo + recorded video presentation
**Note:** This project serves as the Final Project for this course.

---

## 1. Overview

For your final project, your group will design and deploy a cloud web application on Microsoft Azure. The goal is to demonstrate your ability to apply basic cloud architecture principles to a real-world web application scenario, and then define your own way to improve or optimize the deployment (e.g., by adding fault-tolerance, scalability, security, or automated deployments).

Your output is a GitHub repository containing:

- An architecture diagram showing your baseline and improved design
- Deployment documentation (Azure CLI, Bicep scripts, or Azure Portal screenshots)
- A cost estimate report using the Azure Pricing Calculator
- A live demo of your deployed application
- A recorded video presentation

Note: Collaboration and individual contributions will both be graded. Each member must be able to explain their design decisions and any part of the architecture during the Q&A.

## 2. Scenarios

Choose one scenario. The application logic can be simple, the focus is on the cloud architecture, not the application itself.

| # | Scenario | Description | Required Azure Services |
|---|---|---|---|
| A | School Portal | A web portal for a school department (e.g., announcements, event calendar, file downloads) | App Service (2+ instances), Azure SQL or Cosmos DB, Azure Storage |
| B | E-Commerce Storefront | A simple product catalog with browsing and cart functionality (no real payment processing needed) | App Service (2+ instances), Azure SQL, Azure Cache for Redis (optional) |
| C | Student Enrollment System | A web-based enrollment form that stores submissions and displays results | App Service (2+ instances), Azure SQL or Table Storage, Azure Functions (optional) |
| D | Community Blog Platform | A multi-user blog with post creation, comments, and media uploads | App Service (2+ instances), Blob Storage (for media), Azure SQL |
| E | Custom Scenario | Propose your own web application scenario (must be approved by instructor) | Must include at least 3 distinct Azure services with fault tolerance |

**Minimum Architecture Requirements:**

- **Baseline Deployment:** Your web app must be successfully deployed and accessible over the internet.
- **Cloud Optimization:** You must implement at least two distinct improvements to your baseline deployment (e.g., fault tolerance, scalability, enhanced security, or CI/CD pipelines). See Section 6 for details.
- **Minimum 3 distinct Azure services** must be used and connected in your final architecture.

## 3. What You Need to Submit

### Deliverable 1 - Architecture Diagram (20 pts)

Draw a professional diagram showing your Azure architecture. You can use draw.io or Azure Architecture Center icons.

Requirements:

- Show all Azure resources used (minimum 3 distinct services)
- Show how resources connect to each other (arrows, labels, protocols)
- Identify the security boundary (what is public vs. private)
- Highlight your chosen cloud optimizations (e.g., Availability Zones, autoscale rules, redundant storage, security components)

### Deliverable 2 - Deployment Documentation (30 pts)

You must document exactly how your infrastructure was deployed. You may choose one of the following methods:

- **Method A (Code):** Write Azure CLI commands or a Bicep template.
- **Method B (GUI):** Provide detailed, step-by-step screenshots of your resource creation in the Azure Portal.

Regardless of the method, your documentation must cover at least:

| # | Resource | Example Requirement |
|---|---|---|
| 1 | Resource Group | The container for all project resources |
| 2 | Core compute resource | App Service Plan + App Service (2+ instances), or VMSS |
| 3 | Data resource | Azure SQL Database, Storage Account, or Cosmos DB |
| 4 | A security control | NSG rule, Managed Identity, Key Vault, or WAF |

Rules:

- If using Method A (Code): Scripts must be runnable and include a README.md explaining how to execute them. **No hardcoded passwords.**
- If using Method B (GUI): Screenshots must be clear, organized sequentially in a document or folder, and include brief explanations of your chosen settings.
- Maintain a CHANGELOG.md tracking all changes throughout development (see Section 7).

Reference:

- Bicep Deployment Scripts: https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deployment-script-develop?tabs=CLI

### Deliverable 3 - Cost Estimate Report (15 pts)

A single Markdown or PDF document (1-2 pages) covering:

- Architecture summary: brief description of your deployed resources
- Itemized cost breakdown: use the Azure Pricing Calculator to estimate monthly cost for each resource
- Screenshot: include a screenshot of your completed Azure Pricing Calculator estimate
- Cost optimization notes: explain at least one way you could reduce costs (e.g., reserved instances, scaling down during off-hours, using free tier services)

### Deliverable 4 - Live Demo & Video Presentation (35 pts)

A recorded video presentation (minimum 10 minutes, maximum 15 minutes) that includes a live demo of your deployed application:

| Segment | Time | What to Show |
|---|---|---|
| Architecture walkthrough | 3 min | Walk through your diagram and explain your baseline deployment and chosen cloud optimizations |
| Live demo | 5 min | Show your deployed web application running in the browser. Demonstrate it working end-to-end. Show the Azure Portal with your deployed resources. Display your code scripts or portal screenshots. |
| Cost review | 2 min | Present your cost estimate and explain your cost optimization choices |
| Conclusion | 2 min | Wrap up, challenges faced, and key learnings |

All group members must speak during the presentation. You must clearly explain your work and demonstration.

Submission: Upload your video to YouTube as an unlisted video and include the link in your README.md.

## 4. Grading Rubric Matrix

| # | Deliverable | Excellent | Proficient | Developing | Needs Improvement |
|---|---|---|---|---|---|
| 1 | Architecture Diagram (20 pts) | All Azure resources clearly shown and labeled. Connections explicit with arrows and protocols. Security boundary clearly marked. Chosen cloud optimizations highlighted and explained. 20 pts | All resources shown with minor labeling gaps. Connections present but protocol unclear. Security boundary marked. Cloud optimizations shown but loosely explained. 15 pts | Missing 1 resource or labels incomplete. Connections shown but unlabeled. Security boundary partially identified. Cloud optimizations not clearly shown. 10 pts | Resources incomplete or missing. No connections shown. Security boundary missing. No cloud optimizations demonstrated. 5 pts |
| 2 | Deployment Documentation (30 pts) | Code: Scripts deploy flawlessly. Zero secrets. Clear README. GUI: High-quality, organized screenshots covering every step with clear explanations. CHANGELOG.md has detailed, dated entries from all members. GitHub commit history shows equal, regular contributions. 30 pts | Code: Scripts deploy with minor errors. One credential exposed. README fine. GUI: Good screenshots but missing a few steps. CHANGELOG.md has entries from all members but some lack dates. Uneven commits. 20 pts | Code: Scripts have major errors. Credential visible. README vague. GUI: Disorganized or partial screenshots. Not all members contributed to CHANGELOG.md. One member has significantly fewer commits. 10 pts | Documentation unusable. CHANGELOG.md missing or fewer than 3 entries. One or two members did all the work. 5 pts |
| 3 | Cost Estimate Report (15 pts) | Clear architecture summary. Itemized cost breakdown for every resource with accurate Azure Pricing Calculator screenshot. At least one realistic cost optimization strategy explained with estimated savings. 15 pts | Architecture summary present. Cost breakdown included but missing 1-2 resources. Screenshot present. Cost optimization mentioned but not detailed or savings not estimated. 10 pts | Summary vague. Cost breakdown incomplete or unrealistic. Screenshot present but does not match deployed resources. Cost optimization missing or irrelevant. 5 pts | Report missing or incomprehensible. No cost breakdown. No screenshot. 0 pts |
| 4 | Live Demo & Video Presentation (35 pts) | Architecture explained confidently with clear focus on chosen cloud optimizations. Live demo works flawlessly. Application runs end-to-end in browser, Azure Portal resources shown, IaC command demonstrated. Cost review presented clearly. All group members speak equally and meaningfully. 35 pts | Architecture explained adequately but rushed on cloud optimizations. Live demo works with minor issues. Azure Portal shown. All group members speak but one member's contribution is noticeably shorter. 25 pts | Architecture explanation disorganized or read from slides. Demo partially works. Significant stumbling. Dominated by one member while others barely speak. 15 pts | Architecture not explained. Demo fails or not attempted. One or more members do not speak. 5 pts |
| TOTAL | | | | | / 100 |

## 5. Repository Structure

```
/
├── diagram/
│   └── architecture.png        # Your architecture diagram
├── deployment/
│   ├── deploy.azcli            # Code: Azure CLI script or Bicep (optional)
│   ├── screenshots/            # GUI: Folder for Azure Portal screenshots if using GUI
│   └── README.md               # Clear step-by-step deployment instructions
├── report/
│   ├── cost-estimate.md        # Cost estimate report with screenshot
│   └── report.md               # Optional: additional written report
├── CHANGELOG.md                # Detailed log of all changes and contributions
└── README.md                   # Project overview, team members, video link, and demo URL
```

## 6. Cloud Optimization Requirements

Your architecture must demonstrate at least two of the following cloud optimizations to improve upon a basic deployment:

### Fault Tolerance

| Approach | Example |
|---|---|
| Availability Zones | Deploy App Service or VMs across 2+ zones |
| Zone-Redundant Services | Use ZRS storage, zone-redundant Azure SQL |
| Load Balancing | Azure Load Balancer or Application Gateway with health probes |

### Scalability

| Approach | Example |
|---|---|
| Autoscale Rules | App Service Plan autoscale based on CPU > 70% |
| Virtual Machine Scale Sets (VMSS) | Automatically add/remove VM instances based on load |

### Security & DevOps

| Approach | Example |
|---|---|
| Advanced Security Controls | Implement Azure WAF, restrict access via advanced NSGs, or use Managed Identities |
| CI/CD Automation | Automate your deployment using GitHub Actions or Azure DevOps |

### Performance & Caching

| Approach | Example |
|---|---|
| Content Delivery | Use Azure Front Door or Azure CDN to cache static assets globally |
| Data Caching | Implement Azure Cache for Redis to improve database query speeds |

### Monitoring & Operations

| Approach | Example |
|---|---|
| Advanced Telemetry | Integrate Application Insights for deep application performance monitoring |
| Alerting System | Configure Azure Monitor Alerts based on custom metrics or log queries |

### Cost Optimization

| Approach | Example |
|---|---|
| Serverless Architecture | Refactor application to use Azure Functions (Consumption Plan) to scale-to-zero |
| Spot Instances | Use Azure Spot Virtual Machines for non-critical background processing workloads |

## 7. CHANGELOG.md Requirements

Every group must maintain a CHANGELOG.md file in the root of their GitHub repository. This file serves as a detailed, chronological log of all changes made throughout the project lifecycle. It is a professional software engineering practice and will be graded as part of Deliverable 2.

### Format

Use the Keep a Changelog format. Your CHANGELOG.md must include:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- New features or resources added

### Changed
- Modifications to existing resources or configurations

### Fixed
- Bug fixes or corrections

### Removed
- Deleted resources or deprecated code

---

## [YYYY-MM-DD] - Version or Milestone Description

### Added
- `[Author Name]` - Description of what was added (e.g., "Created Resource Group 'rg-student-project' in Southeast Asia region")
- `[Author Name]` - Description of what was added

### Changed
- `[Author Name]` - Description of what was modified (e.g., "Updated NSG rules to restrict SSH access to specific admin IP only")

### Fixed
- `[Author Name]` - Description of what was fixed (e.g., "Fixed Bicep template error: corrected storage account name to meet lowercase-only requirement")

### Removed
- `[Author Name]` - Description of what was removed (e.g., "Deleted unused test VM to reduce costs")
```

### Requirements

| Requirement | Description |
|---|---|
| Every member must contribute entries | Each group member must have logged entries under their name in the changelog. |
| Dated entries | Every entry must include the date (YYYY-MM-DD) when the change was made. |
| Specific descriptions | Entries must be specific and descriptive. Avoid vague entries like "fixed stuff" or "updated code." Instead write: "Fixed Bicep parameter error: changed storageAccountType from Standard_LRS to Standard_GRS for geo-redundancy." |
| Minimum entries | Each member must have at least 5 distinct changelog entries across the project timeline. |
| Covers all deliverables | Entries should span all project areas: architecture diagram updates, IaC scripts, cost report, and presentation preparation. |
| Updated regularly | The changelog should be updated throughout development, not filled in at the last minute. Commit history should reflect regular updates. |

### Why This Matters

In professional software engineering, a changelog:

- Provides an audit trail of who changed what and when
- Helps team members understand the project's evolution
- Makes debugging easier by tracking when changes were introduced
- Demonstrates accountability and professional documentation practices
- Serves as evidence of individual contribution for group project grading

## 8. Reminders

- Use your Azure for Students account. Stay within the free tier where possible.
- Delete your resources after the project is graded to avoid unwanted charges.
- Each member should be able to explain any part of your deployment and architecture. You may be asked individually detailed questions during Q&A.
- When in doubt, keep it simple and make it work.
- This is your Final Project. Treat it with professional seriousness.
