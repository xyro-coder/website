import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

export async function serializeMDX(source: string): Promise<MDXRemoteSerializeResult> {
  return await serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['anchor'],
            },
          },
        ],
        [
          rehypePrettyCode,
          {
            theme: 'github-dark',
            onVisitLine(node: any) {
              // Prevent lines from collapsing in `display: grid` mode
              if (node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }]
              }
            },
            onVisitHighlightedLine(node: any) {
              node.properties.className.push('highlighted')
            },
            onVisitHighlightedWord(node: any) {
              node.properties.className = ['word']
            },
          },
        ],
        rehypeKatex,
      ],
    },
  })
}
