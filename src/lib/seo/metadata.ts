/** SEO-only copy. Visible headings and article metadata remain owned by their pages. */
const sections: Record<string, [string, string, string, string]> = {
  '/': [
    '首页',
    'Yu 的个人博客：记录 AI Agent、软件工程与学习实践，汇集技术文章、笔记和开源项目。',
    'Home',
    'Yu’s personal blog on AI agents, software engineering, and learning, with technical articles, notes, and open-source projects.'
  ],
  '/about': [
    '关于我',
    'Yu，信息与计算科学本科生。关注 AI Agent、Coding Agent、LLM 应用与工程系统，记录技术学习与实践。',
    'About',
    'Yu, an Information and Computing Science undergraduate exploring AI agents, coding agents, LLM applications, and engineering systems.'
  ],
  '/contact': [
    '联系我',
    '通过 GitHub 与 Yu 交流 AI Agent、Coding Agent、LLM 应用、工程实践和博客内容。',
    'Contact',
    'Find Yu on GitHub to discuss AI agents, coding agents, LLM applications, engineering practice, and blog content.'
  ],
  '/projects': [
    '项目',
    'Yu 的 Coding Agent、Agentic RAG 与 AI PR Review 项目，以及 Agent 工程、LLM 和开发工具的参考资料。',
    'Projects',
    'Yu’s coding agent, Agentic RAG, and AI PR review projects, alongside references on agent engineering, LLMs, and developer tools.'
  ],
  '/links': [
    '链接',
    '个人网站、长期关注的项目，以及值得反复访问的技术资源。',
    'Links',
    'Independent websites, projects, and technical resources worth revisiting.'
  ],
  '/curated': [
    '精选阅读',
    '筛选值得阅读的技术博客、论文、报告和开源项目，附来源链接与推荐理由。',
    'Curated',
    'Selected technical blogs, papers, reports, and repositories, with source links and notes on why they are worth reading.'
  ],
  '/tags': [
    '博客标签',
    '按主题浏览博客文章，从标签进入相关技术实践、原理解析与学习记录。',
    'Blog tags',
    'Browse blog topics and find related engineering practice, technical explanations, and learning records through their tags.'
  ],
  '/notes/tags': [
    '笔记标签',
    '按标签查找学习笔记、代码片段、研究记录与尚在完善的想法。',
    'Note tags',
    'Find learning notes, code snippets, research records, and developing ideas by tag.'
  ],
  '/v2': [
    'Yu · AI Agent & Full-Stack Developer · V2',
    'Yu 的 V2 主页：技术项目、产品参考、开源仓库与学习记录。',
    'Yu — AI Agent & Full-Stack Developer · V2',
    'Yu’s V2 space for technical projects, product references, open-source repositories, and learning records.'
  ],
  '/archives': [
    '文章归档',
    '按年份回顾 Yu 已发布的博客文章，查找不同阶段的技术探索与学习记录。',
    'Archives',
    'Browse Yu’s published articles by year and revisit technical explorations and learning records.'
  ]
}

export function sectionMetadata(pathname: string) {
  const en = /^\/en(?:\/|$)/.test(pathname)
  const bare = (en ? pathname.slice(3) : pathname).replace(/\/$/, '') || '/'
  const copy = sections[bare]
  return copy ? { title: copy[en ? 2 : 0], description: copy[en ? 3 : 1] } : undefined
}

export function listingMetadata(
  kind: 'blog' | 'notes' | 'lab',
  en: boolean,
  page: number,
  titles: string[],
  tag?: string | number
) {
  const name = en
    ? { blog: 'Blog', notes: 'Notes', lab: 'Lab' }[kind]
    : { blog: '博客', notes: '笔记', lab: '实验室' }[kind]
  const subject = tag ? (en ? `${name} tagged “${tag}”` : `${name} · ${tag} 标签`) : name
  const suffix = en ? `Page ${page}` : `第 ${page} 页`
  const examples = titles.slice(0, 3).join(en ? '; ' : '；')
  return {
    title: `${subject} · ${suffix}`,
    description: en
      ? `${subject}, page ${page}. ${examples ? `On this page: ${examples}.` : 'Browse published entries.'}`
      : `${subject}，第 ${page} 页。${examples ? `本页收录：${examples}。` : '浏览已发布的记录。'}`
  }
}
