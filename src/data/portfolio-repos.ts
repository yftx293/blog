export type PortfolioLocale = 'zh' | 'en'

const repositories = [
  {
    name: 'tinycode',
    fullName: 'yftx293/tinycode',
    href: 'https://github.com/yftx293/tinycode',
    zh: {
      eyebrow: '轻量级 TypeScript Coding Agent',
      description: '基于 Pi Agent Core，探索 CLI、权限、会话、Context、Skills、MCP 与只读子 Agent。'
    },
    en: {
      eyebrow: 'A lightweight TypeScript coding agent',
      description:
        'Built on Pi Agent Core to explore CLI, permissions, sessions, context, skills, MCP, and read-only sub-agents.'
    }
  },
  {
    name: 'enterprise-customer-service-agentic-rag',
    fullName: 'yftx293/enterprise-customer-service-agentic-rag',
    href: 'https://github.com/yftx293/enterprise-customer-service-agentic-rag',
    zh: {
      eyebrow: '企业客服 Agentic RAG',
      description:
        '探索 RAG、对话、工单、知识库以及 trace / observability 如何组成可追踪的工程流程。'
    },
    en: {
      eyebrow: 'Enterprise customer-service Agentic RAG',
      description:
        'Explores how RAG, conversations, tickets, knowledge bases, and trace / observability form a traceable engineering workflow.'
    }
  },
  {
    name: 'qiniu-xengineer-ai-pr-review',
    fullName: 'yftx293/qiniu-xengineer-ai-pr-review',
    href: 'https://github.com/yftx293/qiniu-xengineer-ai-pr-review',
    zh: {
      eyebrow: 'AI PR Review',
      description: '探索 GitHub PR 获取、diff 风险分析、AI review 与展示流程如何衔接。'
    },
    en: {
      eyebrow: 'AI PR review',
      description:
        'Explores the workflow from GitHub PR retrieval and diff risk analysis to AI review and presentation.'
    }
  }
]

export async function getPortfolioRepos(locale: PortfolioLocale) {
  return Promise.all(
    repositories.map(async ({ zh, en, ...repo }) => {
      let stars: number | null = null
      try {
        const response = await fetch(`https://api.github.com/repos/${repo.fullName}`, {
          headers: { Accept: 'application/vnd.github+json' },
          signal: AbortSignal.timeout(5000)
        })
        if (response.ok) {
          const data = (await response.json()) as { stargazers_count?: number }
          if (
            typeof data.stargazers_count === 'number' &&
            Number.isInteger(data.stargazers_count) &&
            data.stargazers_count >= 0
          ) {
            stars = data.stargazers_count
          }
        }
      } catch {
        // An unavailable count is unknown, not zero or an inherited owner's count.
      }
      return { ...repo, ...(locale === 'en' ? en : zh), stars }
    })
  )
}
