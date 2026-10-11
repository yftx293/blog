export type PortfolioLocale = 'zh' | 'en'

const repositories = [
  {
    name: 'AiNativeCrm',
    fullName: 'yftx293/AiNativeCrm',
    href: 'https://github.com/yftx293/AiNativeCrm',
    zh: {
      eyebrow: 'Agent 原生 CRM 工作台',
      description:
        '以 CRM 为 Agent 的工作环境，探索受控工具执行、知识与记忆，以及可回放、可评测的业务流程。'
    },
    en: {
      eyebrow: 'An agent-native CRM workbench',
      description:
        'Uses CRM as an agent environment to explore controlled tool execution, knowledge, memory, and replayable, evaluable business workflows.'
    }
  },
  {
    name: 'miniclaw',
    fullName: 'yftx293/miniclaw',
    href: 'https://github.com/yftx293/miniclaw',
    zh: {
      eyebrow: '自托管多渠道 Agent 工作台',
      description:
        '基于 Pi Agent Runtime，探索工作区、持久会话、记忆与能力边界如何支撑多渠道接入和后台任务。'
    },
    en: {
      eyebrow: 'A self-hosted, multi-channel agent workbench',
      description:
        'Built on Pi Agent Runtime to explore how workspaces, persistent sessions, memory, and capability boundaries support channels and background tasks.'
    }
  },
  {
    name: 'folio',
    fullName: 'yftx293/folio',
    href: 'https://github.com/yftx293/folio',
    zh: {
      eyebrow: '本地优先的 AI 投资研究工作台',
      description:
        '将行情、Agent 与证据关联起来，探索研究报告、论点变化和评测如何组成持续研究流程；不提供交易能力。'
    },
    en: {
      eyebrow: 'A local-first AI investment research workbench',
      description:
        'Connects market data, agents, and evidence to explore research reports, thesis changes, and evaluation in a continuing research workflow; no trading functionality.'
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
