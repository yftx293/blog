import type { Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const theme: ThemeUserConfig = {
  // === Basic configuration ===

  /** Title for your website. Will be used in metadata and as browser tab title. */
  title: "Yu's Blog",

  /** Will be used in index page & copyright declaration */
  author: 'Yu',

  /** Description metadata for your website. Can be used in page metadata. */
  description: 'Learning, building, and thinking in public',

  /** The default favicon for your site which should be a path to an image in the `public/` directory. */
  favicon: '/favicon/favicon.ico',

  /** Specify the default language for this site. */
  locale: {
    lang: 'zh-CN',
    attrs: 'zh_CN',

    // Date locale
    dateLocale: 'zh-CN',

    dateOptions: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },

  /** Set a logo image to show in the homepage. */
  logo: {
    src: 'src/assets/avatar.png',
    alt: 'Avatar'
  },

  // === Global configuration ===

  titleDelimiter: '•',

  prerender: true,

  npmCDN: 'https://cdn.jsdelivr.net/npm',

  // Still in test
  head: [
    /* Telegram channel */
    // {
    //   tag: 'meta',
    //   attrs: {
    //     name: 'telegram:channel',
    //     content: '@your_channel'
    //   },
    //   content: ''
    // }
  ],

  customCss: [],

  /** Configure the header of your site. */
  header: {
    menu: [
      {
        title: 'Blog',
        link: '/blog'
      },
      {
        title: 'Notes',
        link: '/notes'
      },
      {
        title: 'Lab',
        link: '/lab'
      },
      {
        title: 'Talks',
        link: '/talks'
      },
      {
        title: 'Projects',
        link: '/projects'
      },
      {
        title: 'Links',
        link: '/links'
      },
      {
        title: 'About',
        link: '/about'
      },
      {
        title: 'Contact',
        link: '/contact'
      }
    ]
  },

  /** Configure the footer of your site. */
  footer: {
    links: [],

    /** Enable displaying a “Astro & Pure theme powered” link in your site’s footer. */
    credits: true,

    /** Optional details about the social media accounts for this site. */
    social: {
      github: 'https://github.com/yftx293'
    }
  },

  content: {
    externalLinksContent: ' ↗',

    /** Blog page size for pagination (optional) */
    blogPageSize: 8,

    externalLinkArrow: true,

    // Currently support weibo, x, bluesky
    share: ['weibo', 'x', 'bluesky']
  }
}

export const integ: IntegrationUserConfig = {
  // Links management
  // See: https://astro-pure.js.org/docs/integrations/links
  links: {
    // Friend logbook
    // Joye 原来的友链记录已经清空，
    // 以后这里记录你自己的友链变化。
    logbook: [],

    // Yourself link info
    applyTip: [
      {
        name: 'Name',
        val: theme.title
      },
      {
        name: 'Desc',
        val: theme.description || 'Null'
      },
      {
        name: 'Link',
        val: 'https://github.com/yftx293'
      },
      {
        name: 'Avatar',
        val: 'https://github.com/yftx293.png'
      }
    ]
  },

  // Page search runs on /api/search.json
  pagefind: false,

  // Add a random quote to the footer
  quote: {
    server: 'https://api.quotable.io/quotes/random?maxLength=60',
    target: `(data) => data[0].content || 'Error'`
  },

  // UnoCSS typography
  typography: {
    class: 'prose text-base text-muted-foreground'
  },

  // A lightbox library that can add zoom effect
  mediumZoom: {
    enable: true,

    selector: '.prose .zoomable',

    options: {
      className: 'zoomable'
    }
  },

  // Waline comments
  // 暂时关闭，之后我们再部署你自己的评论服务。
  waline: {
    enable: false,

    // 这里暂时保留原字段结构，关闭后不会加载评论。
    server: '',

    additionalConfigs: {
      pageview: false,
      comment: false
    }
  }
}

const config = {
  ...theme,
  integ
} as Config

export default config
