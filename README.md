## Pre-commit Setup

This project runs the following tools on each `git commit`:

- **Black** (Python formatter, `line-length = 78` in `pyproject.toml`)
- **isort** (Python import sorter, Black profile in `pyproject.toml`)
- **Flake8** (Python linter, max-line-length = 78 in `backend/.flake8`)
- **Prettier** (JS/TS/CSS/JSON/MD formatter, project defaults)
- **ESLint** (JS/TS linter, project’s ESLint config, `--max-warnings=0`)

### Enable

```bash
pip install pre-commit
pre-commit install
```

### Disable

```bash
pre-commit uninstall
pre-commit clean
```
