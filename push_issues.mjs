import { execSync } from 'child_process';

const issues = [
    { title: "Epic 1: Extract and customize the openai/codex harness as the core agent (Rust)", body: "Issue #0: Extract and customize the `openai/codex` harness as the core agent orchestration (Rust/Tokio layer).", project: "Agent (Mob)", closed: true },
    { title: "Epic 1: Implement Dual-Environment routing via MCP", body: "Issue #1: Implement Dual-Environment routing supporting Google Cloud Run and the Local Harness node via MCP server logic.", project: "Agent (Mob)", closed: false },
    { title: "Epic 1: Build the TUI Dashboard", body: "Issue #3: Build the TUI Dashboard for state visibility and real-time validation monitoring. (Initialized via Ratatui)", project: "Agent (Mob)", closed: false },
    { title: "Epic 2: Deploy Playwright on Cloud Run", body: "Issue #4: Deploy Playwright on Cloud Run as an active physics node.", project: "Agent (Mob)", closed: false },
    { title: "Epic 2: Build the validate_layout Boundary Checker", body: "Issue #5: Build the validate_layout 'Boundary Checker' tool mathematically parsing DOM boundaries against viewport rects.", project: "Agent (Mob)", closed: false },
    { title: "Epic 2: Build the verify_aesthetics tool", body: "Issue #6: Build the verify_aesthetics tool mapping WCAG contrast and strict 8pt grid snapping.", project: "Agent (Mob)", closed: false },

    { title: "Epic 5: Build High-Fidelity Chromium PDF printer service", body: "Issue #12: Build the High-Fidelity Chromium PDF printer service (@page boundaries matched perfectly to HTML scale via Playwright).", project: "Backend (Node.js API)", closed: true },
    { title: "Epic 5: Develop HTML-to-OpenXML PPTX parser", body: "Issue #13: Develop HTML-to-OpenXML parser structure mapped to PPTX natively (pptxgenjs).", project: "Backend (Node.js API)", closed: true },
    { title: "Epic 5: Implement strict OpenXML chart injection", body: "Issue #14: Implement the strict OpenXML chart injection parsing dynamically from HTML chart boundaries.", project: "Backend (Node.js API)", closed: false },

    { title: "Epic 6: Design the Unified Schema (Prisma/SQLite)", body: "Issue #2: Design the Unified Schema (Prisma/SQLite) securely storing Project, Slide, and DesignSystem models.", project: "Backend (Node.js API)", closed: true },
    { title: "Epic 6: Build the Model Context Protocol (MCP) Server endpoints", body: "Issue #15: Build the Model Context Protocol (MCP) Server endpoints (/api/mcp/tools, /api/mcp/execute) to decouple UX from Agent.", project: "Backend (Node.js API)", closed: true },
    { title: "Epic 6: Build UI/DB endpoints for Components", body: "Issue #11: Build UI/DB endpoints for retrieving and mutating saved Components natively.", project: "Backend (Node.js API)", closed: false },

    { title: "Epic 3: Build React Canvas integrating strict A4/16:9 viewports", body: "Issue #7: Build React Canvas integrating strict A4 and 16:9 viewport iframes scaling precisely to screen size.", project: "Frontend (React Canvas)", closed: false },
    { title: "Epic 3: Implement DOM selection bounding box logic", body: "Issue #8: Implement DOM selection bounding box logic to isolate nested semantic HTML components dynamically.", project: "Frontend (React Canvas)", closed: false },
    { title: "Epic 3: Wire the localized Steering Protocol capturing mutated DOM", body: "Issue #9: Wire the localized Steering Protocol capturing the mutated DOM subsets and pushing them via the MCP endpoints.", project: "Frontend (React Canvas)", closed: false },

    { title: "Epic 4: Implement intelligent DOM-to-Component parser", body: "Issue #10: Implement intelligent DOM-to-Component parser abstracting localized classes into parameterized generic UI tokens.", project: "Frontend (React Canvas)", closed: false },
];

for (const issue of issues) {
    try {
        const cmd = `gh issue create --title "${issue.title}" --body "${issue.body}\n\n**Component/Scope**: ${issue.project}"`;
        console.log(`Pushing REST to GH: ${issue.title}`);
        const output = execSync(cmd, { stdio: 'pipe' }).toString().trim();
        console.log(`✅ Issue Live: ${output}`);

        if (issue.closed) {
            console.log(`    -> Marked as completed. Closing out issue...`);
            execSync(`gh issue close ${output}`, { stdio: 'inherit' });
        }
    } catch (e) {
        console.error(`Failed on issue: ${issue.title}`, e.message);
    }
}
