import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { client, urlFor } from '../sanity'

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    client
      .fetch(`
        *[_type == "post"] | order(_createdAt desc){
          _id,
          title,
          slug,
          _createdAt,
          excerpt,
          mainImage,
          categories[]->{
            title,
            slug
          }
        }
      `)
      .then(setPosts)
  }, [])

  const getCategorySlug = (post) => {
    if (post.categories?.[0]?.slug?.current) {
      return post.categories[0].slug.current
    }
    if (post.categories?.[0]?.title) {
      return post.categories[0].title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)+/g, '')
    }
    return 'uncategorized'
  }

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px',
      }}
    >
      <h1
        style={{
          fontSize: '48px',
          marginBottom: '50px',
        }}
      >
        My Blog
      </h1>

      {posts.map((post) => (
        <Link
          key={post._id}
          to={`/blog/${getCategorySlug(post)}/${post.slug.current}`}
          style={{
            textDecoration: 'none',
            color: 'black',
          }}
        >
          <article
            style={{
              marginBottom: '80px',
            }}
          >
            {post.mainImage && (
              <img
                src={urlFor(post.mainImage).width(1000).url()}
                alt={post.title}
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  marginBottom: '20px',
                }}
              />
            )}

            <h2
              style={{
                fontSize: '36px',
              }}
            >
              {post.title}
            </h2>

            <p
              style={{
                color: '#666',
                marginTop: '10px',
              }}
            >
              {post.excerpt}
            </p>

            <p
              style={{
                marginTop: '10px',
                color: '#999',
              }}
            >
              {new Date(post._createdAt).toLocaleDateString()}
            </p>
          </article>
        </Link>
      ))}
    </div>
  )
}