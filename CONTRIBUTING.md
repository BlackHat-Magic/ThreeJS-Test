# Contributing Guidelines

First off, just don't . There's no point. I might review your PR or look at your issue, but this repo is basically only maintained so I don't have broken links on my portfolio.

### Semantic Commit Messages

Format:
```
<type>/<optional scope>: <imperative summary in present tense>
```

Allowed types:

| Type      | Purpose                                       |
|-----------|-----------------------------------------------|
| `feat`    | new feature or functionality                  |
| `fix`     | bug fix (issue # as scope if applicable       |
| `docs`    | documentation only                            |
| `refactor`| code restructuring without behavior change    |
| `test`    | add or modify tests only                      |
| `chore`   | ecosystem, formatting/linting, ci, build      |
| `perf`    | performance improvement                       |

Examples:
```
feat/scheduler: add round-robin dispatch loop
fix/memory: correct frame table bounds check
test/locks: add high-contention scenario
refactor: extract pcb init helper
```

Body (optional) should explain rationale, constraints, trade-offs. Reference issues:
```
Closes #12
```

