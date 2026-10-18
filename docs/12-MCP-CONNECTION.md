# 12. MCP connection

The **Model Context Protocol (MCP)** lets AI assistants (Claude Code, Claude Desktop, IDE agents) call
tools and read resources. Kaksha uses MCP in two ways.

## A. MCP servers for developing Kaksha (today)
Add these to your agent's MCP config (Claude Code: `claude mcp add …` or `.mcp.json` in the repo root):

```json
{
  "mcpServers": {
    "github":     { "type": "http", "url": "https://api.githubcopilot.com/mcp/" },
    "playwright": { "command": "npx", "args": ["@playwright/mcp@latest"] },
    "filesystem": { "command": "npx", "args": ["@modelcontextprotocol/server-filesystem", "./src/content"] }
  }
}
```
| Server | Used for |
| --- | --- |
| GitHub | Issues, PRs, CI status, reviews |
| Playwright | Clicking through pages, checking for dead buttons, screenshots at mobile widths |
| Filesystem (scoped to `src/content`) | Letting a content agent read/write lessons only |

Agents must follow [AGENTS](06-AGENTS.md) and run `npm run check:content` after content edits.

## B. Kaksha content MCP server (planned)
A small read-only MCP server so tutors/assistants can ground answers in Kaksha lessons:

| Tool / resource | Input | Output |
| --- | --- | --- |
| `list_subjects` | `grade` | subjects with chapter counts |
| `get_chapter` | `grade, subject, chapter` | title, topics, lesson Markdown |
| `search_chapters` | `query, grade?` | top matches (reuses `src/lib/search.ts`) |
| `get_quiz` | chapter key | questions without answers |
| resource `kaksha://lesson/{grade}/{subject}/{chapter}` | – | lesson Markdown |

Implementation sketch: Node + `@modelcontextprotocol/sdk`, importing `src/lib/curriculum.ts` and reading the
Markdown files; stdio transport for local use, streamable HTTP for hosted use. Read-only, no learner data.
