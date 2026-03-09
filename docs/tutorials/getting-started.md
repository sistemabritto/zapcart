---
title: "Getting Started"
description: Install EVO and build your first project
---

Build software faster using AI-powered workflows with specialized agents that guide you through planning, architecture, and implementation.

## What You'll Learn

- Install and initialize EVO Method for a new project
- Use **EVO-Help** — your intelligent guide that knows what to do next
- Choose the right planning track for your project size
- Progress through phases from requirements to working code
- Use agents and workflows effectively

:::note[Prerequisites]
- **Node.js 20+** — Required for the installer
- **Git** — Recommended for version control
- **AI-powered IDE** — Claude Code, Cursor, or similar
- **A project idea** — Even a simple one works for learning
:::

:::tip[The Easiest Path]
**Install** → `npx evo-method install`
**Ask** → `/evo-help what should I do first?`
**Build** → Let EVO-Help guide you workflow by workflow
:::

## Meet EVO-Help: Your Intelligent Guide

**EVO-Help is the fastest way to get started with EVO.** You don't need to memorize workflows or phases — just ask, and EVO-Help will:

- **Inspect your project** to see what's already been done
- **Show your options** based on which modules you have installed
- **Recommend what's next** — including the first required task
- **Answer questions** like "I have a SaaS idea, where do I start?"

### How to Use EVO-Help

Run it in your AI IDE by invoking the skill:

```
evo-help
```

Or combine it with a question for context-aware guidance:

```
evo-help I have an idea for a SaaS product, I already know all the features I want. where do I get started?
```

EVO-Help will respond with:
- What's recommended for your situation
- What the first required task is
- What the rest of the process looks like

### It Powers Workflows Too

EVO-Help doesn't just answer questions — **it automatically runs at the end of every workflow** to tell you exactly what to do next. No guessing, no searching docs — just clear guidance on the next required workflow.

:::tip[Start Here]
After installing EVO, run `/evo-help` immediately. It will detect what modules you have installed and guide you to the right starting point for your project.
:::

## Understanding EVO

EVO helps you build software through guided workflows with specialized AI agents. The process follows four phases:

| Phase | Name           | What Happens                                        |
| ----- | -------------- | --------------------------------------------------- |
| 1     | Analysis       | Brainstorming, research, product brief *(optional)* |
| 2     | Planning       | Create requirements (PRD or tech-spec)              |
| 3     | Solutioning    | Design architecture *(EVO Method/Enterprise only)* |
| 4     | Implementation | Build epic by epic, story by story                  |

**[Open the Workflow Map](../reference/workflow-map.md)** to explore phases, workflows, and context management.

Based on your project's complexity, EVO offers three planning tracks:

| Track           | Best For                                               | Documents Created                      |
| --------------- | ------------------------------------------------------ | -------------------------------------- |
| **Quick Flow**  | Bug fixes, simple features, clear scope (1-15 stories) | Tech-spec only                         |
| **EVO Method** | Products, platforms, complex features (10-50+ stories) | PRD + Architecture + UX                |
| **Enterprise**  | Compliance, multi-tenant systems (30+ stories)         | PRD + Architecture + Security + DevOps |

:::note
Story counts are guidance, not definitions. Choose your track based on planning needs, not story math.
:::

## Installation

Open a terminal in your project directory and run:

```bash
npx evo-method install
```

When prompted to select modules, choose **EVO Method**.

The installer creates two folders:
- `_evo/` — agents, workflows, tasks, and configuration
- `_evo-output/` — empty for now, but this is where your artifacts will be saved

:::tip[Your Next Step]
Open your AI IDE in the project folder and run:

```
/evo-help
```

EVO-Help will detect what you've completed and recommend exactly what to do next. You can also ask it questions like "What are my options?" or "I have a SaaS idea, where should I start?"
:::

:::note[How to Load Agents and Run Workflows]
Each workflow has a **skill** you invoke in your IDE (e.g., `/evo-create-prd`). Running a workflow skill automatically loads the appropriate agent — you don't need to load agents separately. You can also invoke an agent directly for general conversation (e.g., `/evo-pm` for the PM agent).
:::

:::caution[Fresh Chats]
Always start a fresh chat for each workflow. This prevents context limitations from causing issues.
:::

## Step 1: Create Your Plan

Work through phases 1-3. **Use fresh chats for each workflow.**

:::tip[Project Context (Optional)]
Before starting, consider creating `project-context.md` to document your technical preferences and implementation rules. This ensures all AI agents follow your conventions throughout the project.

Create it manually at `_evo-output/project-context.md` or generate it after architecture using `/evo-generate-project-context`. [Learn more](../explanation/project-context.md).
:::

### Phase 1: Analysis (Optional)

All workflows in this phase are optional:
- **brainstorming** (`/evo-brainstorming`) — Guided ideation
- **research** (`/evo-research`) — Market and technical research
- **create-product-brief** (`/evo-create-product-brief`) — Recommended foundation document

### Phase 2: Planning (Required)

**For EVO Method and Enterprise tracks:**
1. Invoke the **PM agent** (`/evo-pm`) in a new chat
2. Run the `evo-create-prd` workflow (`/evo-create-prd`)
3. Output: `PRD.md`

**For Quick Flow track:**
- Use the `evo-quick-spec` workflow (`/evo-quick-spec`) instead of PRD, then skip to implementation

:::note[UX Design (Optional)]
If your project has a user interface, invoke the **UX-Designer agent** (`/evo-ux-designer`) and run the UX design workflow (`/evo-create-ux-design`) after creating your PRD.
:::

### Phase 3: Solutioning (EVO Method/Enterprise)

**Create Architecture**
1. Invoke the **Architect agent** (`/evo-architect`) in a new chat
2. Run `evo-create-architecture` (`/evo-create-architecture`)
3. Output: Architecture document with technical decisions

**Create Epics and Stories**

:::tip[V6 Improvement]
Epics and stories are now created *after* architecture. This produces better quality stories because architecture decisions (database, API patterns, tech stack) directly affect how work should be broken down.
:::

1. Invoke the **PM agent** (`/evo-pm`) in a new chat
2. Run `evo-create-epics-and-stories` (`/evo-create-epics-and-stories`)
3. The workflow uses both PRD and Architecture to create technically-informed stories

**Implementation Readiness Check** *(Highly Recommended)*
1. Invoke the **Architect agent** (`/evo-architect`) in a new chat
2. Run `evo-check-implementation-readiness` (`/evo-check-implementation-readiness`)
3. Validates cohesion across all planning documents

## Step 2: Build Your Project

Once planning is complete, move to implementation. **Each workflow should run in a fresh chat.**

### Initialize Sprint Planning

Invoke the **SM agent** (`/evo-sm`) and run `evo-sprint-planning` (`/evo-sprint-planning`). This creates `sprint-status.yaml` to track all epics and stories.

### The Build Cycle

For each story, repeat this cycle with fresh chats:

| Step | Agent | Workflow       | Command                    | Purpose                            |
| ---- | ----- | -------------- | -------------------------- | ---------------------------------- |
| 1    | SM    | `evo-create-story` | `/evo-create-story`  | Create story file from epic        |
| 2    | DEV   | `evo-dev-story`    | `/evo-dev-story`     | Implement the story                |
| 3    | DEV   | `evo-code-review`  | `/evo-code-review`   | Quality validation *(recommended)* |

After completing all stories in an epic, invoke the **SM agent** (`/evo-sm`) and run `evo-retrospective` (`/evo-retrospective`).

## What You've Accomplished

You've learned the foundation of building with EVO:

- Installed EVO and configured it for your IDE
- Initialized a project with your chosen planning track
- Created planning documents (PRD, Architecture, Epics & Stories)
- Understood the build cycle for implementation

Your project now has:

```text
your-project/
├── _evo/                                   # EVO configuration
├── _evo-output/
│   ├── planning-artifacts/
│   │   ├── PRD.md                           # Your requirements document
│   │   ├── architecture.md                  # Technical decisions
│   │   └── epics/                           # Epic and story files
│   ├── implementation-artifacts/
│   │   └── sprint-status.yaml               # Sprint tracking
│   └── project-context.md                   # Implementation rules (optional)
└── ...
```

## Quick Reference

| Workflow                              | Command                                    | Agent     | Purpose                                         |
| ------------------------------------- | ------------------------------------------ | --------- | ----------------------------------------------- |
| **`evo-help`** ⭐                    | `/evo-help`                               | Any       | **Your intelligent guide — ask anything!**      |
| `evo-create-prd`                | `/evo-create-prd`                     | PM        | Create Product Requirements Document            |
| `evo-create-architecture`            | `/evo-create-architecture`            | Architect | Create architecture document                     |
| `evo-generate-project-context`       | `/evo-generate-project-context`           | Analyst   | Create project context file                     |
| `evo-create-epics-and-stories`       | `/evo-create-epics-and-stories`       | PM        | Break down PRD into epics            |
| `evo-check-implementation-readiness` | `/evo-check-implementation-readiness` | Architect | Validate planning cohesion           |
| `evo-sprint-planning`                | `/evo-sprint-planning`                | SM        | Initialize sprint tracking           |
| `evo-create-story`                   | `/evo-create-story`                   | SM        | Create a story file                  |
| `evo-dev-story`                      | `/evo-dev-story`                      | DEV       | Implement a story                    |
| `evo-code-review`                    | `/evo-code-review`                    | DEV       | Review implemented code              |

## Common Questions

**Do I always need architecture?**
Only for EVO Method and Enterprise tracks. Quick Flow skips from tech-spec to implementation.

**Can I change my plan later?**
Yes. The SM agent has a `evo-correct-course` workflow (`/evo-correct-course`) for handling scope changes.

**What if I want to brainstorm first?**
Invoke the Analyst agent (`/evo-analyst`) and run `evo-brainstorming` (`/evo-brainstorming`) before starting your PRD.

**Do I need to follow a strict order?**
Not strictly. Once you learn the flow, you can run workflows directly using the Quick Reference above.

## Getting Help

:::tip[First Stop: EVO-Help]
**Run `/evo-help` anytime** — it's the fastest way to get unstuck. Ask it anything:
- "What should I do after installing?"
- "I'm stuck on workflow X"
- "What are my options for Y?"
- "Show me what's been done so far"

EVO-Help inspects your project, detects what you've completed, and tells you exactly what to do next.
:::

- **During workflows** — Agents guide you with questions and explanations
- **Community** — [Discord](https://discord.gg/gk8jAdXWmj) (#evo-method-help, #report-bugs-and-issues)

## Key Takeaways

:::tip[Remember These]
- **Start with `/evo-help`** — Your intelligent guide that knows your project and options
- **Always use fresh chats** — Start a new chat for each workflow
- **Track matters** — Quick Flow uses quick-spec; Method/Enterprise need PRD and architecture
- **EVO-Help runs automatically** — Every workflow ends with guidance on what's next
:::

Ready to start? Install EVO, run `/evo-help`, and let your intelligent guide lead the way.
