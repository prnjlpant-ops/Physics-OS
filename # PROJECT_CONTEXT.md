# PROJECT_CONTEXT.md

# Development Strategy

Every sprint should satisfy the following:

- Produce a working application.
- Build one complete subsystem.
- Avoid placeholder implementations where practical.
- Prefer reusable architecture over duplicated code.
- Preserve backwards compatibility.
- Every sprint must end in a buildable project.
- Minimize technical debt.

# Physics OS

Version: Vision Document v1.0

---

# Mission

Physics OS is a desktop-first, offline-first study operating system built specifically for my personal preparation for

- JEST
- IIT JAM Physics
- GATE Physics
- TIFR GS
- CSIR NET (future)

This is NOT a generic study planner.

It is intended to become my complete physics study environment.

The application should reduce every possible friction between deciding to study and actually studying.

---

# Core Philosophy

Everything should exist for one purpose:

> Help me study physics more effectively.

If a feature does not improve learning, organization, revision, or productivity, it should not be added.

Avoid unnecessary complexity.

---

# Design Philosophy

The application should feel like

VS Code

+

Obsidian

+

A personal physics research notebook

+

A study operating system

It should never feel like a social app or a gamified productivity tool.

---

# Principles

- Offline First
- Local First
- Fast
- Keyboard Friendly
- Modular
- Minimal
- Stable
- Professional
- Reusable
- Maintainable

No mandatory cloud.

No mandatory login.

No advertisements.

No unnecessary animations.

No XP.

No badges.

No streaks.

No social features.

---

# Current Technology

Frontend

- React
- Vite

Target Architecture

Desktop Application

Preferred Desktop Runtime

Electron

The codebase should always be written so future Electron migration is easy.

Avoid browser-only assumptions whenever practical.

---

# Knowledge Base

The Knowledge Base is the heart of Physics OS.

Every resource should ultimately be connected to it.

Folder Structure

Knowledge Base/

- Mathematical Physics
- Classical Mechanics
- Oscillations & Waves
- Electrodynamics
- Quantum Mechanics
- Thermodynamics
- Statistical Mechanics
- Optics
- Solid State Physics
- Electronics
- Experimental Physics

Each subject contains

- Assets
- Books
- Solution Manuals
- Notes
- Formula Sheets
- Memory Sheets
- Videos
- PYQs
- Research Papers
- Conceptual Resources

Physics OS should never duplicate these resources.

Instead it should reference them.

---

# Master Index

The long-term architecture should use a Master Index.

Example

knowledge_base.json

Every resource should be represented by metadata instead of hardcoded paths.

Example metadata

- title
- author
- subject
- category
- edition
- tags
- status
- localPath
- notes

The UI should consume the Master Index rather than scanning folders directly.

---

# Primary Workflow

Today's Mission

↓

Study Session

↓

Read Book

↓

Take Notes

↓

Formula Sheet

↓

Memory Sheet

↓

Solve PYQs

↓

Active Recall

↓

Revision

↓

Reflection

↓

Analytics

Every module should integrate naturally into this workflow.

---

# Existing Modules

Current modules include

- Home Dashboard
- Subjects
- Today's Mission
- Planner
- Calendar
- Study Sessions
- Notes
- Formula Sheets
- Memory Sheets
- Knowledge Base
- PYQs
- Mock Tests
- Active Recall
- Analytics
- Roadmap
- Blueprint Integration

These should be extended rather than replaced.

---

# Resource Philosophy

Resources should include

Books

Solution Manuals

Lecture Notes

Videos

Research Papers

Formula Sheets

Memory Sheets

PYQs

Blueprints

Conceptual Resources

Everything should be searchable.

Everything should be categorized.

Everything should eventually become clickable inside the desktop application.

---

# PYQ Philosophy

PYQs are among the highest priority resources.

Support

JEST

IIT JAM

GATE

TIFR GS

CSIR NET

Store

Year-wise

Topic-wise

Difficulty

Status

Bookmarks

Future versions should allow filtering by

Subject

Chapter

Topic

Difficulty

Year

---

# Study Philosophy

Understanding is more important than memorization.

Concepts are more important than equations.

Reasoning is more important than remembering formulas.

The application should encourage

Deep Work

Active Recall

Spaced Revision

Conceptual Understanding

Error Analysis

Reflection

---

# Concept Mastery

Every topic should eventually support

Formula Sheet

Memory Sheet

One Sentence Summary

Physical Intuition

Common Misconceptions

Important Derivations

Common Tricks

Active Recall Questions

Related PYQs

Mock Questions

Personal Notes

---

# Analytics

Analytics should measure

Study Hours

Topic Completion

Revision Status

Weak Areas

Strong Areas

Subject Progress

PYQ Progress

Session Statistics

Analytics should never exist purely for decoration.

Every chart should help make better study decisions.

---

# Recommendation Engine

Recommendations should initially be rule-based.

Example

Completed Topic

↓

Recommend

Revision

Formula Sheet

Memory Sheet

Related PYQs

Related Chapters

AI may be integrated in the future but should not become the primary feature.

---

# Desktop Features

When Electron is integrated,

Physics OS should support

Open PDF

Open Folder

Reveal in Explorer

Open Notes

Open Websites

Choose Knowledge Base Folder

Local Settings

Local Database

Remember Last Session

All desktop functionality should use secure Electron APIs.

---

# Performance

Keep startup fast.

Avoid unnecessary dependencies.

Avoid duplicated code.

Prefer reusable services.

Prefer reusable components.

Maintain clean architecture.

---

# Code Quality

Small reusable components.

Strong typing.

Meaningful names.

Consistent folder structure.

Centralized services.

Minimal side effects.

No dead code.

Document non-obvious logic.

---

# Engineering Rules

Never remove existing functionality unless requested.

Never redesign pages without a clear reason.

Prefer extending existing modules.

Maintain backward compatibility.

Explain significant architectural changes.

Verify builds before considering work complete.

---

# Long-Term Vision

Physics OS should become a complete personal Physics Study Operating System capable of managing

- Knowledge Base
- Books
- Notes
- Formula Sheets
- Memory Sheets
- PYQs
- Research Papers
- Videos
- Study Sessions
- Planner
- Calendar
- Revision
- Analytics
- Recommendations
- Mock Tests
- Concept Mastery

Everything should feel like one integrated application instead of separate tools.

Whenever implementing a feature, ask:

"Does this reduce friction between deciding to study and actually studying?"

If yes,

implement it.

If not,

do not.