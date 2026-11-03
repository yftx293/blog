import { h } from 'hastscript'
import type { ShikiTransformer } from 'shiki'

export {
  transformerNotationDiff,
  transformerNotationHighlight
} from './shiki-official-transformers'

function parseMetaString(str = '') {
  return Object.fromEntries(
    str.split(' ').reduce((acc: [string, string | true][], cur) => {
      const matched = cur.match(/(.+)?=("(.+)"|'(.+)')$/)
      if (matched === null) return acc
      const key = matched[1]
      const value = matched[3] || matched[4] || true
      acc = [...acc, [key, value]]
      return acc
    }, [])
  )
}

// Nest a div in the outer layer
export const updateStyle = (): ShikiTransformer => {
  return {
    name: 'shiki-transformer-update-style',
    pre(node) {
      const container = h('pre', node.children)
      container.properties.tabIndex = 0
      container.properties['aria-label'] = 'Code'
      node.children = [container]
      node.tagName = 'div'
    }
  }
}

// Process meta string, like ```ts title="test.ts"
export const processMeta = (): ShikiTransformer => {
  return {
    name: 'shiki-transformer-process-meta',
    preprocess() {
      if (!this.options.meta) return
      const rawMeta = this.options.meta?.__raw
      if (!rawMeta) return
      const meta = parseMetaString(rawMeta)
      Object.assign(this.options.meta, meta)
    }
  }
}

// Add a title to the code block
export const addTitle = (): ShikiTransformer => {
  return {
    name: 'shiki-transformer-add-title',
    pre(node) {
      const rawMeta = this.options.meta?.__raw
      if (!rawMeta) return
      const meta = parseMetaString(rawMeta)
      // If meta is needed to parse in other transformers
      // if (this.options.meta) {
      //   Object.assign(this.options.meta, meta)
      // }

      if (!meta.title) return

      const div = h(
        'div',
        {
          class:
            'title absolute top-0 left-0 m-2 text-sm text-foreground px-3 py-1 bg-primary-foreground rounded-lg border'
        },
        meta.title.toString()
      )
      node.children.unshift(div)
    }
  }
}

// Add a language tag to the code block
export const addLanguage = (): ShikiTransformer => {
  return {
    name: 'shiki-transformer-add-language',
    pre(node) {
      const span = h(
        'span',
        {
          class: 'language ps-1 pe-3 text-sm bg-muted text-muted-foreground'
        },
        this.options.lang
      )
      node.children.push(span)
    }
  }
}

// Add a copy button to the code block
export const addCopyButton = (timeout?: number): ShikiTransformer => {
  const toggleMs = timeout || 3000

  return {
    name: 'shiki-transformer-copy-button',
    pre(node) {
      const button = h(
        'button',
        {
          class: 'copy text-muted-foreground p-1 box-content border rounded bg-primary-foreground',
          type: 'button',
          'aria-label': 'Copy code',
          title: 'Copy code',
          'data-code': this.source,
          onclick: `return (async () => {
          if (this.disabled) return;
          const attempt = String((Number(this.dataset.copyAttempt) || 0) + 1);
          this.dataset.copyAttempt = attempt;
          const zh = document.documentElement.lang.startsWith('zh');
          const ready = zh ? '复制代码' : 'Copy code';
          this.disabled = true;
          this.dataset.copyState = 'pending';
          try {
            await navigator.clipboard.writeText(this.dataset.code);
            this.classList.add('copied');
            this.dataset.copyState = 'success';
            this.setAttribute('aria-label', zh ? '已复制' : 'Copied');
            this.setAttribute('title', zh ? '已复制' : 'Copied');
          } catch {
            this.dataset.copyState = 'error';
            this.disabled = false;
            this.setAttribute('aria-label', zh ? '复制失败，请手动选择代码' : 'Copy failed. Select the code manually.');
            this.setAttribute('title', zh ? '复制失败，请手动选择代码' : 'Copy failed. Select the code manually.');
          }
          setTimeout(() => {
            if (this.dataset.copyAttempt !== attempt) return;
            this.classList.remove('copied');
            this.dataset.copyState = 'ready';
            this.disabled = false;
            this.setAttribute('aria-label', ready);
            this.setAttribute('title', ready);
          }, ${toggleMs});
        })();
        `
        },
        [
          h('div', { class: 'ready' }, [
            h(
              'svg',
              {
                class: 'size-5'
              },
              [
                h('use', {
                  href: '/icons/code.svg#mingcute-clipboard-line'
                })
              ]
            )
          ]),
          h('div', { class: 'success hidden' }, [
            h(
              'svg',
              {
                class: 'size-5'
              },
              [
                h('use', {
                  href: '/icons/code.svg#mingcute-file-check-line'
                })
              ]
            )
          ])
        ]
      )

      node.children.push(button)
    }
  }
}
