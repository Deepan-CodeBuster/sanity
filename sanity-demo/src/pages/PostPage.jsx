import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'

import { client, urlFor } from '../sanity'
import { components } from '../components/PortableTextComponents'

function PostPage() {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [headings, setHeadings] = useState([])
    const [activeSection, setActiveSection] = useState('')

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (!slug) return

        client
            .fetch(
                `
        *[_type == "post" && slug.current == $slug][0]{
          _id,
          _createdAt,
          _updatedAt,
          title,
          subtitle,
          excerpt,
          body,
          mainImage,
          seo{
            metaTitle,
            metaDescription,
            canonicalUrl,
            ogImage
          },
          categories[]->{
            title,
            slug
          }
        }
        `,
                { slug }
            )
            .then(setPost)
    }, [slug])

    // Update SEO Meta Tags
    useEffect(() => {
        if (!post) return

        // Set Title
        const metaTitle = post.seo?.metaTitle || `${post.title} - TekWissen.com`
        document.title = metaTitle

        // Helper to set/update meta tag
        const setMetaTag = (selector, attributeName, attributeValue, content) => {
            let el = document.querySelector(selector)
            if (!el) {
                el = document.createElement('meta')
                el.setAttribute(attributeName, attributeValue)
                document.head.appendChild(el)
            }
            el.setAttribute('content', content)
        }

        // Description
        const metaDescription = post.seo?.metaDescription || post.excerpt || ''
        if (metaDescription) {
            setMetaTag('meta[name="description"]', 'name', 'description', metaDescription)
            setMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDescription)
            setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', metaDescription)
        }

        // Robots
        setMetaTag('meta[name="robots"]', 'name', 'robots', 'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large')

        // Canonical URL
        const categorySlug = post.categories?.[0]?.slug?.current || 'uncategorized'
        const canonicalUrl = post.seo?.canonicalUrl || `https://tekwissen.com/blog/${categorySlug}/${post.slug?.current || ''}`
        let canonicalEl = document.querySelector('link[rel="canonical"]')
        if (!canonicalEl) {
            canonicalEl = document.createElement('link')
            canonicalEl.setAttribute('rel', 'canonical')
            document.head.appendChild(canonicalEl)
        }
        canonicalEl.setAttribute('href', canonicalUrl)

        // Open Graph locale and type
        setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_US')
        setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'article')
        setMetaTag('meta[property="og:title"]', 'property', 'og:title', metaTitle)
        setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
        setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'TekWissen.com')

        // Article updated/published time
        if (post._createdAt) {
            setMetaTag('meta[property="article:published_time"]', 'property', 'article:published_time', post._createdAt)
        }
        if (post._updatedAt) {
            setMetaTag('meta[property="og:updated_time"]', 'property', 'og:updated_time', post._updatedAt)
            setMetaTag('meta[property="article:modified_time"]', 'property', 'article:modified_time', post._updatedAt)
        }

        // Image
        let imageUrl = ''
        if (post.seo?.ogImage) {
            imageUrl = urlFor(post.seo.ogImage).width(1200).url()
        } else if (post.mainImage) {
            imageUrl = urlFor(post.mainImage).width(1200).url()
        }
        if (imageUrl) {
            setMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl)
            setMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', imageUrl)
            setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', post.title)
            setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl)
        }

        // Twitter
        setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
        setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', metaTitle)

        // Twitter reading time / extra details if available
        setMetaTag('meta[name="twitter:label1"]', 'name', 'twitter:label1', 'Time to read')
        setMetaTag('meta[name="twitter:data1"]', 'name', 'twitter:data1', '8 minutes')
    }, [post])

    // Extract headings from post.body whenever post changes
    useEffect(() => {
        if (!post?.body || !Array.isArray(post.body)) return

        const extracted = []
        post.body.forEach((block) => {
            if (block._type === 'keyTakeaways') {
                extracted.push({
                    title: block.title || 'Key Takeaways',
                    id: 'key-takeaways',
                    style: 'h2'
                })
            } else if (block._type === 'block' && (block.style === 'h2' || block.style === 'h3')) {
                const text = block.children?.map(child => child.text).join('') || ''
                if (text.trim()) {
                    const id = text
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]+/g, '')
                    extracted.push({
                        title: text,
                        id: id,
                        style: block.style
                    })
                }
            }
        })
        setHeadings(extracted)
    }, [post])

    // Scroll spy logic to highlight current section
    useEffect(() => {
        if (headings.length === 0) return

        const handleScroll = () => {
            const sectionIds = headings.map(h => h.id)

            // Check if user has scrolled to the bottom of the page
            const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50
            if (isBottom && sectionIds.includes('conclusion')) {
                setActiveSection('conclusion')
                return
            }

            let currentActive = headings[0]?.id || ''
            const offset = 150 // offset for sticky header/navbar

            for (const id of sectionIds) {
                const el = document.getElementById(id)
                if (el) {
                    const rect = el.getBoundingClientRect()
                    if (rect.top <= offset) {
                        currentActive = id
                    } else {
                        break
                    }
                }
            }
            setActiveSection(currentActive)
        }

        window.addEventListener('scroll', handleScroll)
        // Run once on mount / update to set correct state
        handleScroll()

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [headings])

    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            const yOffset = -100
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
            setActiveSection(id)
        }
    }

    if (!post) {
        return (
            <div
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '40px',
                }}
            >
                <p style={{ color: '#999' }}>Loading...</p>
            </div>
        )
    }

    return (
        <div className="pt-32 pb-20 px-4 sm:px-8 lg:px-20 bg-white min-h-screen font-sans">
            <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">

                {/* Main Content Column */}
                <div className="lg:w-[65%]">

                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
                        <Link
                            to="/"
                            className="hover:text-[#14C1F4] transition-colors"
                        >
                            Home
                        </Link>

                        <span>&gt;</span>

                        <Link
                            to="/insights"
                            className="hover:text-[#14C1F4] transition-colors"
                        >
                            Blog
                        </Link>

                        {post.categories?.length > 0 && (
                            <>
                                <span>&gt;</span>

                                <span className="hover:text-[#14C1F4] transition-colors cursor-pointer">
                                    {post.categories.map((category, index) => (
                                        <span key={category.title}>
                                            {category.title}
                                            {index !== post.categories.length - 1 && ', '}
                                        </span>
                                    ))}
                                </span>
                            </>
                        )}

                        <span>&gt;</span>

                        <span className="text-gray-900 font-medium">
                            {post.subtitle}
                        </span>
                    </div>

                    {/* Categories Badge */}
                    {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.categories.map((category) => (
                                <span
                                    key={category.title}
                                    className="text-xs font-bold text-[#14C1F4] uppercase tracking-widest bg-sky-50 px-3 py-1.5 rounded-md"
                                >
                                    {category.title}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-[2.5rem] leading-[1.1] md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 mb-4">
                        {post.title}
                    </h1>

                    {/* Subtitle */}
                    {post.subtitle && (
                        <p className="text-xl md:text-2xl text-gray-500 font-medium mb-8">
                            {post.subtitle}
                        </p>
                    )}

                    {/* Intro Text */}
                    <p className="text-gray-700 text-[20px] leading-relaxed mb-6">
                        {post.excerpt}
                    </p>

                    {/* Author and Share */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#14C1F4] to-blue-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                TW
                            </div>

                            <span className="text-[13px] font-semibold text-gray-700">
                                By TekWissen Editorial Team
                            </span>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="mb-12 rounded-2xl overflow-hidden">
                        {post.mainImage && (
                            <img
                                src={urlFor(post.mainImage).width(1200).url()}
                                alt={post.title}
                                className="w-full h-auto object-cover"
                            />
                        )}
                    </div>

                    {/* Content Body */}
                    <div className="prose max-w-none prose-lg text-gray-700">
                        {post.body && (
                            <PortableText
                                value={post.body}
                                components={components}
                            />
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:w-[35%] flex flex-col gap-8 lg:sticky lg:top-32 self-start">

                    {/* ON THIS PAGE */}
                    {headings.length > 0 && (
                        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm relative">
                            <h3 className="text-sm font-bold text-gray-900 tracking-wider mb-6">ON THIS PAGE</h3>

                            <div className="relative pl-6">
                                {/* Vertical Line */}
                                <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                                <ul className="space-y-6 text-xl relative">
                                    {headings.map((item, idx) => {
                                        const isActive = activeSection === item.id
                                        const isSubHeading = item.style === 'h3'
                                        return (
                                            <li
                                                key={idx}
                                                onClick={() => scrollToSection(item.id)}
                                                className="relative group cursor-pointer"
                                            >
                                                <div
                                                    className={`absolute -left-[1.35rem] top-1.5 w-3 h-3 rounded-full transition-all duration-300 ${isActive
                                                            ? 'bg-[#14C1F4] ring-4 ring-blue-50'
                                                            : 'bg-gray-200 group-hover:bg-[#14C1F4]'
                                                        }`}
                                                ></div>
                                                <span
                                                    className={`block leading-tight transition-colors duration-300 ${isSubHeading
                                                            ? 'text-xs font-normal pl-4'
                                                            : 'font-semibold text-sm'
                                                        } ${isActive
                                                            ? 'text-[#14C1F4]'
                                                            : 'text-gray-500 group-hover:text-gray-900'
                                                        }`}
                                                >
                                                    {item.title}
                                                </span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}


                    {/* Call to Action Box */}
                    <div className="bg-gradient-to-br from-[#0c1d5e] to-[#14C1F4] rounded-2xl p-6 text-white">
                        <p className="text-[11px] font-black uppercase tracking-widest text-blue-200 mb-2">Expert Guidance</p>
                        <h3 className="font-bold text-[20px] leading-snug mb-3">Build a Future - Ready GCC with TekWissen</h3>
                        <p className="text-blue-100 text-[12px] leading-relaxed mb-4">Get Expert Guidance to drive transformation and innovation</p>
                        <Link to="/about/global-presence" className="inline-flex items-center gap-2 bg-white text-[#14C1F4] font-bold text-[12px] px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
                            Book a Consultation →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostPage