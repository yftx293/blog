/**
 * Static text content for the pseudo-FS. Inlined directly into the
 * manifest (small, ships once with the page). Long-form content like
 * blog posts is fetched lazily through `endpoint`.
 */

/**
 * Hostname-style label for the FS root. Surfaced in the prompt host
 * segment and as the prefix of `pwd` output (so the tree visibly
 * "lives" on this machine). Change here, propagates everywhere.
 */
export const ROOT_LABEL = 'yu.devserver'

export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: 'github', href: 'https://github.com/yftx293' }
]

export const README_TEXT = `yu.devserver — a small pseudo-FS for this blog.

If you're poking around:
  ls               — see what's here
  whoami           — a short introduction
  about            — read the about file
  blog             — open the blog
  notes            — open the notes
  github           — open GitHub
`

export const ABOUT_TEXT = `Yu
信息与计算科学本科生

关注 AI Agent、Coding Agent、LLM 应用与相关工程系统。
同时学习后端与 AI Infra。

这个博客记录技术学习、项目实践、源码阅读和思考。
`

export const NOW_TEXT = `Now:

- 学习 AI Agent、Coding Agent 与 LLM 应用
- 学习后端与 AI Infra
- 记录技术学习、项目实践与源码阅读
`

export const PERSONALITY_TEXT = `# personality.conf
# terminal flavor only

style:     terminal-native, concise
voice:     calm, technical, still learning
focus:     agents, engineering systems, source reading
`

export const MOTD_TEXT = `Welcome to Yu's terminal.

This is a pseudo-FS exposing my site's content as a directory tree.
Type \`help\` for commands. \`exit\` or Esc to leave.
`
