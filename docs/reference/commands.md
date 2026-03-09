---
title: Skills
description: Reference for EVO skills — what they are, how they work, and where to find them.
sidebar:
  order: 3
---

Skills are pre-built prompts that load agents, run workflows, or execute tasks inside your IDE. The EVO installer generates them from your installed modules at install time. If you later add, remove, or change modules, re-run the installer to keep skills in sync (see [Troubleshooting](#troubleshooting)).

## Skills vs. Agent Menu Triggers

EVO offers two ways to start work, and they serve different purposes.

| Mechanism | How you invoke it | What happens |
| --- | --- | --- |
| **Skill** | Type the skill name (e.g. `evo-help`) in your IDE | Directly loads an agent, runs a workflow, or executes a task |
| **Agent menu trigger** | Load an agent first, then type a short code (e.g. `DS`) | The agent interprets the code and starts the matching workflow while staying in character |

Agent menu triggers require an active agent session. Use skills when you know which workflow you want. Use triggers when you are already working with an agent and want to switch tasks without leaving the conversation.

## How Skills Are Generated

When you run `npx evo-method install`, the installer reads the manifests for every selected module and writes one skill per agent, workflow, task, and tool. Each skill is a directory containing a `SKILL.md` file that instructs the AI to load the corresponding source file and follow its instructions.

The installer uses templates for each skill type:

| Skill type | What the generated file does |
| --- | --- |
| **Agent launcher** | Loads the agent persona file, activates its menu, and stays in character |
| **Workflow skill** | Loads the workflow config and follows its steps |
| **Task skill** | Loads a standalone task file and follows its instructions |
| **Tool skill** | Loads a standalone tool file and follows its instructions |

:::note[Re-running the installer]
If you add or remove modules, run the installer again. It regenerates all skill files to match your current module selection.
:::

## Where Skill Files Live

The installer writes skill files into an IDE-specific directory inside your project. The exact path depends on which IDE you selected during installation.

| IDE / CLI | Skills directory |
| --- | --- |
| Claude Code | `.claude/skills/` |
| Cursor | `.cursor/skills/` |
| Windsurf | `.windsurf/skills/` |
| Other IDEs | See the installer output for the target path |

Each skill is a directory containing a `SKILL.md` file. For example, a Claude Code installation looks like:

```text
.claude/skills/
├── evo-help/
│   └── SKILL.md
├── evo-create-prd/
│   └── SKILL.md
├── evo-dev/
│   └── SKILL.md
└── ...
```

The directory name determines the skill name in your IDE. For example, the directory `evo-dev/` registers the skill `evo-dev`.

## How to Discover Your Skills

Type the skill name in your IDE to invoke it. Some platforms require you to enable skills in settings before they appear.

Run `evo-help` for context-aware guidance on your next step.

:::tip[Quick discovery]
The generated skill directories in your project are the canonical list. Open them in your file explorer to see every skill with its description.
:::

## Skill Categories

### Agent Skills

Agent skills load a specialized AI persona with a defined role, communication style, and menu of workflows. Once loaded, the agent stays in character and responds to menu triggers.

| Example skill | Agent | Role |
| --- | --- | --- |
| `evo-dev` | Amelia (Developer) | Implements stories with strict adherence to specs |
| `evo-pm` | John (Product Manager) | Creates and validates PRDs |
| `evo-architect` | Winston (Architect) | Designs system architecture |
| `evo-sm` | Bob (Scrum Master) | Manages sprints and stories |

See [Agents](./agents.md) for the full list of default agents and their triggers.

### Workflow Skills

Workflow skills run a structured, multi-step process without loading an agent persona first. They load a workflow configuration and follow its steps.

| Example skill | Purpose |
| --- | --- |
| `evo-create-prd` | Create a Product Requirements Document |
| `evo-create-architecture` | Design system architecture |
| `evo-create-epics-and-stories` | Create epics and stories |
| `evo-dev-story` | Implement a story |
| `evo-code-review` | Run a code review |
| `evo-quick-spec` | Define an ad-hoc change (Quick Flow) |

See [Workflow Map](./workflow-map.md) for the complete workflow reference organized by phase.

### Task and Tool Skills

Tasks and tools are standalone operations that do not require an agent or workflow context.

#### EVO-Help: Your Intelligent Guide

**`evo-help`** is your primary interface for discovering what to do next. It's not just a lookup tool — it's an intelligent assistant that:

- **Inspects your project** to see what's already been done
- **Understands natural language queries** — ask questions in plain English
- **Varies by installed modules** — shows options based on what you have
- **Auto-invokes after workflows** — every workflow ends with clear next steps
- **Recommends the first required task** — no guessing where to start

**Examples:**

```
evo-help
evo-help I have a SaaS idea and know all the features. Where do I start?
evo-help What are my options for UX design?
evo-help I'm stuck on the PRD workflow
```

#### Other Tasks and Tools

| Example skill | Purpose |
| --- | --- |
| `evo-shard-doc` | Split a large markdown file into smaller sections |
| `evo-index-docs` | Index project documentation |
| `evo-editorial-review-prose` | Review document prose quality |

## Naming Convention

All skills use the `evo-` prefix followed by a descriptive name (e.g., `evo-dev`, `evo-create-prd`, `evo-help`). See [Modules](./modules.md) for available modules.

## Troubleshooting

**Skills not appearing after install.** Some platforms require skills to be explicitly enabled in settings. Check your IDE's documentation or ask your AI assistant how to enable skills. You may also need to restart your IDE or reload the window.

**Expected skills are missing.** The installer only generates skills for modules you selected. Run `npx evo-method install` again and verify your module selection. Check that the skill files exist in the expected directory.

**Skills from a removed module still appear.** The installer does not delete old skill files automatically. Remove the stale directories from your IDE's skills directory, or delete the entire skills directory and re-run the installer for a clean set.
