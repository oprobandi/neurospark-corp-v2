# v2.7.1 Hotfix Log

## What failed in v2.7, and why

### Bug: Build crash — `Github` and `Facebook` icons not found in lucide-react

**Severity:** Critical (build fails, site does not deploy)
**Affected files:** `Footer.jsx`, `ContactPage.jsx`
**Error from Vercel:** `Command "npm run build" exited with 1`

**Root cause:**
`Footer.jsx` and `ContactPage.jsx` imported `Github` and `Facebook` from `lucide-react`.
These icon names do not exist in the pinned version `lucide-react@0.263.1`.
This is the same class of error that caused the v2.4 emergency patch (`Tractor` icon).
ADR-005 documented the rule: all new icons must be verified against v0.263.1 before use.
The rule was not applied when adding the social icon set in v2.7.

**Fix:**
Replaced both `Github` and `Facebook` with inline SVG elements.
All five social icons (Instagram, LinkedIn, X, GitHub, Facebook) now use either
a lucide component that is confirmed to exist in v0.263.1, or an inline SVG.

---

### Deployment failures: `git push` rejected (non-fast-forward)

**Occurred:** Every push attempt during v2.6, v2.7, and v2.7.1 patch sessions.
**Error:** `! [rejected] main -> main (non-fast-forward)`

**Root cause:**
Vercel creates a deployment commit on the remote after each `vercel --prod` run.
The local repo does not have that commit, so the remote is always one commit ahead.
Pushing without pulling first is always rejected.

**Fix:**
Always run `git pull origin main` before `git push`. See corrected deploy sequence below.

---

### Patch attempt failures: Python not installed in Termux

**Occurred:** During v2.7 icon fix session.
**Error:** `The program python3 is not installed`

**Root cause:**
Patch scripts were written as Python. Termux does not ship Python by default.

**Fix:**
All patch scripts rewritten as Node.js one-liners using `require('fs')`.
Node.js is always available in Termux because npm/vercel require it.

---

### Patch attempt failures: Wrong home directory path

**Occurred:** During v2.7 icon fix session.
**Error:** `ENOENT: no such file or directory, open '/root/neurospark-v2/...'`

**Root cause:**
Scripts hardcoded `/root/` as the home directory.
Termux home is not `/root/` — it is a Termux-specific path like
`/data/data/com.termux/files/home/`.

**Fix:**
All scripts now use `process.env.HOME` (Node) or `$HOME` (bash) to resolve the path
at runtime, regardless of environment.

---

## Correct deploy sequence (use every time)

```bash
cd ~/neurospark-v2
git pull origin main
git add .
git commit -m "your message"
git push origin main
vercel --prod
```

## ADR update

This hotfix reinforces **ADR-005** with an explicit checklist:

Before using any lucide icon, verify it exists in v0.263.1:
  https://unpkg.com/lucide-react@0.263.1/dist/esm/icons/

Confirmed available in v0.263.1: MapPin, Linkedin, Instagram, Twitter, Mail,
Phone, Clock, Menu, X (the close icon), ArrowRight, ChevronDown, Sun, Moon,
CheckCircle, Shield, Zap, Bot, Globe, TrendingUp, Package, ChevronRight,
MessageCircle, Leaf.

NOT available: Github, Facebook, Tractor — use inline SVG for these.

---

## v2.7.2 — Additional git failure: unrelated histories

**Error:** `fatal: refusing to merge unrelated histories`

**When it occurred:** `git pull origin main` after `git config --global pull.rebase false`

**Root cause:**
The GitHub repository was initialised independently from the local Termux repo —
likely because GitHub auto-created a README or Vercel added an initial commit
before the local history existed. Git sees two repos with no common ancestor
and refuses to merge them by default.

**Fix:**
Pass `--allow-unrelated-histories` to the pull command once.
After this succeeds, all future pulls are normal.

```bash
git pull origin main --allow-unrelated-histories
```

If a merge commit editor opens (vim/nano), type `:q` (vim) or Ctrl+X (nano) to save and close.

**Permanent prevention:**
This only needs to be done once per repo. After the histories are joined,
normal `git pull origin main` works forever.
