# Solo Standoff legal copy

Drop the legal documents here as markdown. Each file renders as written at its route:

| File                | Route                          |
| ------------------- | ------------------------------ |
| `privacy.md`        | `/solo-standoff/privacy`        |
| `terms.md`          | `/solo-standoff/terms`          |
| `delete-account.md` | `/solo-standoff/delete-account` |

A route returns 404 until its file exists. The site must be rebuilt after a file is added or changed.

The page header takes:

- **Title:** a leading `# Heading`, or `title:` in frontmatter. Falls back to the page name.
- **Last updated:** a line such as `Last updated: 22 October 2026` (bold is fine), or
  `lastUpdated:` in frontmatter. That line moves into the header and is not repeated in the body.

Everything else is rendered unchanged (GitHub-flavoured markdown, so tables work).
