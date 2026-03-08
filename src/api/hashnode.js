/**
 * src/api/hashnode.js
 *
 * Hashnode GraphQL API client for Neurospark Corporation blog.
 *
 * STATUS: Scaffolded in v2.7 — wired into BlogPage.jsx in v2.8.
 *
 * Setup:
 *   1. Create your publication at hashnode.com
 *   2. Set HASHNODE_HOST below to your Hashnode subdomain or custom domain
 *      e.g. 'oprobandi.hashnode.dev'  OR  'blog.neurosparkcorporation.ai'
 *
 * Usage (v2.8 BlogPage.jsx):
 *   import { fetchPosts, fetchPost } from '../api/hashnode'
 *
 *   // list view
 *   const { posts, pageInfo } = await fetchPosts({ first: 12 })
 *
 *   // single post
 *   const post = await fetchPost('my-post-slug')
 */

// ─── Config ───────────────────────────────────────────────────────────────────
const HASHNODE_GQL  = 'https://gql.hashnode.com'
const HASHNODE_HOST = 'blog.neurosparkcorporation.ai' // e.g. 'oprobandi.hashnode.dev'

// ─── GQL helper ───────────────────────────────────────────────────────────────
async function gql(query, variables = {}) {
  const res = await fetch(HASHNODE_GQL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`Hashnode API error: ${res.status}`)
  const { data, errors } = await res.json()
  if (errors?.length) throw new Error(errors[0].message)
  return data
}

// ─── fetchPosts ───────────────────────────────────────────────────────────────
// Returns up to `first` posts from the publication.
// Each post includes: id, title, slug, brief, publishedAt, readTimeInMinutes,
//                     coverImage.url, tags[].name, author.name, author.profilePicture
export async function fetchPosts({ first = 12, after = null } = {}) {
  const data = await gql(
    `query Posts($host: String!, $first: Int!, $after: String) {
       publication(host: $host) {
         posts(first: $first, after: $after) {
           pageInfo { hasNextPage endCursor }
           edges {
             node {
               id
               title
               slug
               brief
               publishedAt
               readTimeInMinutes
               coverImage { url }
               tags { name }
               author { name profilePicture }
             }
           }
         }
       }
     }`,
    { host: HASHNODE_HOST, first, after }
  )

  const pub = data?.publication
  if (!pub) throw new Error('Publication not found. Check HASHNODE_HOST.')

  return {
    posts:    pub.posts.edges.map(e => e.node),
    pageInfo: pub.posts.pageInfo,
  }
}

// ─── fetchPost ────────────────────────────────────────────────────────────────
// Returns a single post by slug, including full HTML content.
export async function fetchPost(slug) {
  const data = await gql(
    `query Post($host: String!, $slug: String!) {
       publication(host: $host) {
         post(slug: $slug) {
           id
           title
           slug
           publishedAt
           readTimeInMinutes
           coverImage { url }
           tags { name }
           author { name profilePicture }
           content { html }
           seo { title description }
         }
       }
     }`,
    { host: HASHNODE_HOST, slug }
  )

  const post = data?.publication?.post
  if (!post) throw new Error(`Post not found: ${slug}`)
  return post
}
