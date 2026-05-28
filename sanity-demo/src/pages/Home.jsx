import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { client, urlFor } from '../sanity'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    client
      .fetch(`
        *[_type == "post"] | order(_createdAt desc){
          _id,
          title,
          slug,
          _createdAt,
          subtitle,
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

  useEffect(() => {
    client
      .fetch(`*[_type == "category"] | order(title asc){ title, slug }`)
      .then(setCategories)
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

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(post =>
        post.categories?.some(cat => cat.title === selectedCategory)
      )

  return (
    <div className="font-sans min-h-screen bg-white overflow-hidden pb-16">
      

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24 flex flex-col-reverse lg:flex-row items-center gap-10">
        <div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Discover Expert Advice and <span className='text-[#14C1F4]'>Latest Trends</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Stay ahead with expert advice and the latest trends. We provide insightful tips and valuable resources to help you navigate the ever‑evolving world of technology.
          </p>
        </div>
        <div>
          <img
            src="https://tekwissen.com/wp-content/uploads/2024/07/library-1.webp"
            alt="Blog hero"
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Type</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#14C1F4] text-white border-[#14C1F4] shadow-sm shadow-[#14C1F4]/20'
                : 'bg-white text-gray-700 hover:bg-[#14C1F4] hover:text-white border-gray-300 hover:border-[#14C1F4]'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.title}
              onClick={() => setSelectedCategory(cat.title)}
              className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.title
                  ? 'bg-[#14C1F4] text-white border-[#14C1F4] shadow-sm shadow-[#14C1F4]/20'
                  : 'bg-white text-gray-700 hover:bg-[#14C1F4] hover:text-white border-gray-300 hover:border-[#14C1F4]'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No posts found in this category.
          </div>
        ) : (
          <div className="space-y-16">
            {filteredPosts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${getCategorySlug(post)}/${post.slug.current}`}
                className="no-underline text-black block group"
              >
                <article className="transition-transform duration-300 hover:-translate-y-1">
                  {post.mainImage && (
                    <div className="overflow-hidden rounded-xl mb-5">
                      <img
                        src={urlFor(post.mainImage).width(1000).url()}
                        alt={post.title}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                      />
                    </div>
                  )}

                  {post.subtitle && (
                    <h2 className="text-3xl font-bold mb-3 transition-colors duration-200 group-hover:text-[#14C1F4]">
                      {post.subtitle}
                    </h2>
                  )}

                  <p className="text-gray-600 mt-2.5">
                    {post.excerpt}
                  </p>

                  <p className="mt-2.5 text-gray-400 text-sm">
                    {new Date(post._createdAt).toLocaleDateString()}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}