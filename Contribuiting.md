# 🤝 Contributing to AeroVerse

This document explains the Git workflow and contribution guidelines for the AeroVerse team.

---

## 🌿 Branch Strategy

```
main              ← Stable, reviewed code only (supervisor can always view this)
develop           ← Integration branch — all features merge here first
│
├── feature/US-01-museum-navigation     ← Feature branches (per user story)
├── feature/US-07-ai-tutor
├── feature/US-10-rocket-assembly
├── fix/hotspot-click-bug               ← Bug fix branches
└── chore/update-dependencies           ← Maintenance branches
```

### Branch naming convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/US-XX-short-description` | `feature/US-07-ai-tutor` |
| Bug Fix | `fix/short-description` | `fix/hotspot-click-bug` |
| Unity | `unity/short-description` | `unity/museum-scene-layout` |
| CV | `cv/short-description` | `cv/component-classifier` |
| Chore | `chore/short-description` | `chore/update-dependencies` |

---

## 🔄 Workflow (per User Story)

1. **Pick a user story** from the GitHub Project board
2. **Create a branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/US-XX-your-description
   ```
3. **Develop** and **commit** regularly:
   ```bash
   git add .
   git commit -m "feat(US-XX): implement [what you did]"
   ```
4. **Push** your branch:
   ```bash
   git push origin feature/US-XX-your-description
   ```
5. **Open a Pull Request** from your branch → `develop`
6. Get **code review** from at least one teammate
7. **Merge** after approval

---

## 📝 Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): short description

Types:
  feat      → new feature
  fix       → bug fix
  docs      → documentation only
  style     → formatting, no logic change
  refactor  → code change without bug fix or feature
  test      → adding or fixing tests
  chore     → dependency updates, configs
```

**Examples:**
```
feat(unity): add hotspot interaction system
fix(backend): correct JWT token expiration
docs(cv): update API endpoint documentation
test(backend): add auth route unit tests
```

---

## 📌 Sprint Labels

Use GitHub labels to tag issues by sprint:

- `sprint-1`, `sprint-2`, ..., `sprint-7`
- `frontend`, `backend`, `unity`, `computer-vision`
- `bug`, `user-story`, `documentation`
- `priority: high`, `priority: medium`, `priority: low`

---

## 👀 For the Supervisor

The `main` branch always contains the latest **stable, reviewed** version of the project.  
The `develop` branch reflects the **latest ongoing work**.  
Each sprint's progress can be tracked via:
- GitHub **Issues** (one per user story)
- GitHub **Project Board** (Kanban: Todo / In Progress / Done)
- **Pull Requests** with detailed descriptions
