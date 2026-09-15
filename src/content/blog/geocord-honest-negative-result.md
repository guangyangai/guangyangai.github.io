---
title: 'I added causal reasoning to my scheduler. It made things worse — and I published that.'
description: 'Why an honest negative result from my multi-agent RL scheduler (GeoCoRD) is more valuable than another SOTA claim.'
pubDate: 'Sep 15 2026'
---

A counterintuitive story: I added a "causal reasoning layer" to my multi-agent
scheduler, expecting it to be the headline of the paper. Then I ran the
experiments — **it made the system worse.** I didn't delete that result. I wrote
it into the paper as-is. Here's why.

## The setup

GeoCoRD is a geo-distributed multi-agent RL scheduler: a MAPPO backbone augmented
with structural causal models (SCMs). The causal layer's design was elegant — use
counterfactuals to predict *"what would have happened if I'd routed differently,"*
and shape decisions accordingly. It sounds like it should make the policy smarter.

It didn't.

## The result

Turning the causal layer on:

| Metric | MACR off | MACR on (unconditional) |
| --- | --- | --- |
| Completion | **100.0%** | 93.0% |
| SLA violations | **1.1%** | 8.1% (~7× worse) |
| Cost | 7222 | **5761** |

The only thing that improved was cost. But here's the catch: **it "saved" cost by
quietly dropping tasks**, not by scheduling more efficiently. That's not
optimization — that's cheating on the objective.

## The root cause

The causal penalty was **unconditional**: punish whenever high latency is
predicted. Under regional outages and a 10× burst, almost *any* routing decision
crosses the latency threshold — so the agent learned the one available escape:
**don't route at all** (conservative local processing → dropped tasks). The
penalty was missing a crucial test: *was there actually a better option available?*

## The (partial) fix

I changed it to a **selective, regret-gated** penalty: only penalize when there
was a genuinely avoidable better choice that the agent ignored, and cap the penalty
so it can never outweigh the task-completion reward. When high latency is
unavoidable — every alternative is comparably bad — no penalty is applied.

Result: completion recovered to 94.8%, SLA violations dropped to 6.3%, and cost
stayed below the causal-free ceiling. A **Pareto improvement** over the original
causal configuration — but I want to be precise: it does **not** fully match the
causal-free policy's perfect reliability. It's a partial fix, and I said exactly
that in the paper.

## Why publish the negative result?

Because 2026 is wall-to-wall "my method is SOTA." Someone who can explain exactly
where their method fails, and why, is more trustworthy than the hundredth
leaderboard-chaser.

An honest negative result beats a fake positive one. If you're building agents you
intend to deploy, the failure modes are the part you actually need to know.
