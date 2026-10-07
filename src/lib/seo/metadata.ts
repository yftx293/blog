/** SEO-only copy. Visible headings and article metadata remain owned by their pages. */
const sections: Record<string, [string, string, string, string]> = {
  '/': [
    '首页',
    'Yu 的个人博客，记录 AI Agent、Coding Agent、软件工程与学习实践。',
    'Home',
    "Yu's blog about AI agents, coding agents, software engineering, and learning in public."
  ],
  '/about': [
    '关于我',
    '了解 Yu 的学习背景、当前关注的技术方向，以及这个博客的写作计划。',
    'About',
    'Meet Yu, learn about current interests in AI agents and software engineering, and why this blog exists.'
  ],
  '/contact': [
    '联系我',
    '通过 GitHub 联系 Yu，交流 AI Agent、Coding Agent、工程实践或博客内容。',
    'Contact',
    'Contact Yu on GitHub to discuss AI agents, coding agents, engineering practice, or the blog.'
  ],
  '/projects': [
    '项目',
    '浏览 Yu 的开源项目与工程实践，包括 Coding Agent、Agentic RAG 和 AI PR Review。',
    'Projects',
    "Explore Yu's projects in coding agents, agentic RAG, and AI assisted code review."
  ],
  '/links': [
    '友情链接',
    '记录朋友的网站，以及值得长期关注的项目和文章。',
    'Links',
    'A place for friends, independent blogs, and projects worth revisiting.'
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
  '/archives': [
    '文章归档',
    '按年份回顾 Yu 发布的博客文章，查找技术学习与工程实践记录。',
    'Archives',
    "Browse Yu's published articles by year and revisit technical notes and projects."
  ]
}

export function sectionMetadata(pathname: string) {
  const en = /^\/en(?:\/|$)/.test(pathname)
  const bare = (en ? pathname.slice(3) : pathname).replace(/\/$/, '') || '/'
  const copy = sections[bare]
  return copy ? { title: copy[en ? 2 : 0], description: copy[en ? 3 : 1] } : undefined
}

export function listingMetadata(
  kind: 'blog' | 'notes',
  en: boolean,
  page: number,
  titles: string[],
  tag?: string | number
) {
  const name = en ? { blog: 'Blog', notes: 'Notes' }[kind] : { blog: '博客', notes: '笔记' }[kind]
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
