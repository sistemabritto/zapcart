---
title: "How to Get Answers About EVO"
description: Use an LLM to quickly answer your own EVO questions
sidebar:
  order: 4
---

## Start Here: EVO-Help

**The fastest way to get answers about EVO is `/evo-help`.** This intelligent guide will answer upwards of 80% of all questions and is available to you directly in your IDE as you work.

EVO-Help is more than a lookup tool — it:
- **Inspects your project** to see what's already been completed
- **Understands natural language** — ask questions in plain English
- **Varies based on your installed modules** — shows relevant options
- **Auto-runs after workflows** — tells you exactly what to do next
- **Recommends the first required task** — no guessing where to start

### How to Use EVO-Help

Run it with just the skill name:

```
/evo-help
```

Or combine it with a natural language query:

```
/evo-help I have a SaaS idea and know all the features. Where do I start?
/evo-help What are my options for UX design?
/evo-help I'm stuck on the PRD workflow
/evo-help Show me what's been done so far
```

EVO-Help responds with:
- What's recommended for your situation
- What the first required task is
- What the rest of the process looks like

---

## When to Use This Guide

Use this section when:
- You want to understand EVO's architecture or internals
- You need answers outside of what EVO-Help provides
- You're researching EVO before installing
- You want to explore the source code directly

## Steps

### 1. Choose Your Source

| Source               | Best For                                  | Examples                     |
| -------------------- | ----------------------------------------- | ---------------------------- |
| **`_evo` folder**   | How EVO works—agents, workflows, prompts | "What does the PM agent do?" |
| **Full GitHub repo** | History, installer, architecture          | "What changed in v6?"        |
| **`llms-full.txt`**  | Quick overview from docs                  | "Explain EVO's four phases" |

The `_evo` folder is created when you install EVO. If you don't have it yet, clone the repo instead.

### 2. Point Your AI at the Source

**If your AI can read files (Claude Code, Cursor, etc.):**

- **EVO installed:** Point at the `_evo` folder and ask directly
- **Want deeper context:** Clone the [full repo](https://github.com/evo-code-org/EVO-METHOD)

**If you use ChatGPT or Claude.ai:**

Fetch `llms-full.txt` into your session:

```text
https://evo-code-org.github.io/EVO-METHOD/llms-full.txt
```


### 3. Ask Your Question

:::note[Example]
**Q:** "Tell me the fastest way to build something with EVO"

**A:** Use Quick Flow: Run `evo-quick-spec` to write a technical specification, then `evo-quick-dev` to implement it—skipping the full planning phases.
:::

## What You Get

Direct answers about EVO—how agents work, what workflows do, why things are structured the way they are—without waiting for someone else to respond.

## Tips

- **Verify surprising answers** — LLMs occasionally get things wrong. Check the source file or ask on Discord.
- **Be specific** — "What does step 3 of the PRD workflow do?" beats "How does PRD work?"

## Still Stuck?

Tried the LLM approach and still need help? You now have a much better question to ask.

| Channel                   | Use For                                     |
| ------------------------- | ------------------------------------------- |
| `#evo-method-help`       | Quick questions (real-time chat)            |
| `help-requests` forum     | Detailed questions (searchable, persistent) |
| `#suggestions-feedback`   | Ideas and feature requests                  |
| `#report-bugs-and-issues` | Bug reports                                 |

**Discord:** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)

**GitHub Issues:** [github.com/evo-code-org/EVO-METHOD/issues](https://github.com/evo-code-org/EVO-METHOD/issues) (for clear bugs)

*You!*
        *Stuck*
             *in the queue—*
                      *waiting*
                              *for who?*

*The source*
        *is there,*
                *plain to see!*

*Point*
     *your machine.*
              *Set it free.*

*It reads.*
        *It speaks.*
                *Ask away—*

*Why wait*
        *for tomorrow*
                *when you have*
                        *today?*

*—Claude*
