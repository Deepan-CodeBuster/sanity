import { urlFor } from '../sanity'

export const components = {

    marks: {
        textColor: ({ children, value }) => {
            return (
                <span
                    style={{
                        color: value.color,
                        fontWeight: 'bold',
                    }}
                >
                    {children}
                </span>
            )
        },
    },
    types: {
        image: ({ value }) => (
            <img
                src={urlFor(value).width(1000).url()}
                alt=""
                style={{
                    width: '100%',
                    borderRadius: '12px',
                    margin: '30px 0',
                }}
            />
        ),

        tableBlock: ({ value }) => {
            const rows = value?.rows || []

            return (
                <div style={{ overflowX: 'auto', margin: '40px 0' }}>
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                        }}
                    >
                        <tbody>
                            {rows.map((row, rowIndex) => {
                                const cells = row?.cells || []

                                const isHeader = rowIndex === 0

                                return (
                                    <tr key={rowIndex}>
                                        {cells.map((cell, colIndex) => (
                                            <td
                                                key={colIndex}
                                                style={{
                                                    border: '1px solid #ddd',
                                                    padding: '12px',
                                                    textAlign: 'left',

                                                    // HEADER ROW STYLING
                                                    backgroundColor: isHeader ? '#14C1F4' : 'transparent',
                                                    color: isHeader ? '#ffffff' : '#333',
                                                    fontWeight: isHeader ? 'bold' : 'normal',
                                                }}
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )
        },

        quoteBlock: ({ value }) => (
            <div
                style={{
                    background: '#f5f5f5',
                    padding: '30px',
                    borderRadius: '12px',
                    margin: '40px 0',
                }}
            >
                <p
                    style={{
                        fontSize: '24px',
                        fontStyle: 'italic',
                    }}
                >
                    {value.quote}
                </p>

                <p
                    style={{
                        marginTop: '10px',
                        color: '#666',
                    }}
                >
                    — {value.source}
                </p>
            </div>
        ),

        ctaSection: ({ value }) => (
            <div
                style={{
                    background: '#0ea5e9',
                    color: 'white',
                    padding: '40px',
                    borderRadius: '16px',
                    margin: '40px 0',
                }}
            >
                <h2>{value.title}</h2>

                <a
                    href={value.buttonLink}
                    style={{
                        display: 'inline-block',
                        marginTop: '20px',
                        background: 'white',
                        color: '#0ea5e9',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                    }}
                >
                    {value.buttonText}
                </a>
            </div>
        ),

        keyTakeaways: ({ value }) => {
            return (
                <div
                    id="key-takeaways"
                    style={{
                        backgroundColor: '#EFF6FF',
                        borderLeft: '4px solid #14C1F4',
                        borderRadius: '12px',
                        padding: '24px',
                        margin: '40px 0',
                    }}
                >
                    <h2
                        style={{
                            color: '#14C1F4',
                            fontSize: '14px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '12px',
                        }}
                    >
                        {value.title}
                    </h2>

                    <ul className="space-y-1.5 text-[14px] text-gray-700">
                        {value.items?.map((item, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-2"
                            ><span className="text-[#14C1F4] mt-0.5">•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )
        },
    },

    block: {
        h1: ({ children }) => (
            <h1
                style={{
                    fontSize: '42px',
                    marginTop: '40px',
                }}
            >
                {children}
            </h1>
        ),

        h2: ({ children, value }) => {
            const text = value.children?.map(child => child.text).join('') || ''
            const id = text
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]+/g, '')

            return (
                <h2 id={id} className="text-[#000000] text-[35px] font-bold mb-6">
                    {children}
                </h2>
            )
        },
        h3: ({ children, value }) => {
            const text = value.children?.map(child => child.text).join('') || ''
            const id = text
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]+/g, '')

            return (
                <h3 id={id} className="text-[20px] mb-6">
                    {children}
                </h3>
            )
        },

        normal: ({ children }) => (
            <p className="text-gray-600 text-[20px] leading-relaxed mb-4">
                {children}
            </p>
        ),
    },

    list: {
        bullet: ({ children }) => (
            <ul className="list-disc pl-8 space-y-2 text-gray-900 text-[20px] leading-relaxed mb-4">
                {children}
            </ul>
        ),

        number: ({ children }) => (
            <ol className="list-decimal pl-8 space-y-2 text-gray-900 text-[20px] leading-relaxed mb-4">
                {children}
            </ol>
        ),
    },

    listItem: {
        bullet: ({ children }) => (
            <li className="text-[20px] leading-relaxed">
                {children}
            </li>
        ),

        number: ({ children }) => (
            <li className="text-[20px] leading-relaxed text-[#14C1F4] font-bold">
                {children}
            </li>
        ),
    },
}