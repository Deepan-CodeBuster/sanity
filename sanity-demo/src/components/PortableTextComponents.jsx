import { urlFor } from '../sanity'

export const components = {
  marks: {
    textColor: ({ children, value }) => {
      return (
        <span
          className="font-bold"
          style={{ color: value.color }}
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
        className="w-full rounded-xl my-[30px]"
      />
    ),

    tableBlock: ({ value }) => {
      const rows = value?.rows || []

      return (
        <div className="overflow-x-auto my-10">
          <table className="w-full border-collapse">
            <tbody>
              {rows.map((row, rowIndex) => {
                const cells = row?.cells || []

                const isHeader = rowIndex === 0

                return (
                  <tr key={rowIndex}>
                    {cells.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className={`
                          border border-[#ddd]
                          p-3
                          text-left
                          ${
                            isHeader
                              ? 'bg-[#14C1F4] text-white font-bold'
                              : 'text-[#333]'
                          }
                        `}
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
      <div className="bg-[#f5f5f5] p-[30px] rounded-xl my-10">
        <p className="text-2xl italic">
          {value.quote}
        </p>

        <p className="mt-2.5 text-[#666]">
          — {value.source}
        </p>
      </div>
    ),

    ctaSection: ({ value }) => (
      <div className="bg-sky-500 text-white p-10 rounded-2xl my-10">
        <h2>{value.title}</h2>

        <a
          href={value.buttonLink}
          className="inline-block mt-5 bg-white text-sky-500 px-5 py-3 rounded-lg no-underline font-bold"
        >
          {value.buttonText}
        </a>
      </div>
    ),

    keyTakeaways: ({ value }) => {
      return (
        <div
          id="key-takeaways"
          className="bg-blue-50 border-l-4 border-[#14C1F4] rounded-xl p-6 my-10"
        >
          <h2 className="text-[#14C1F4] text-[14px] font-black uppercase tracking-[1px] mb-3">
            {value.title}
          </h2>

          <ul className="space-y-1.5 text-[14px] text-gray-700">
            {value.items?.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2"
              >
                <span className="text-[#14C1F4] mt-0.5">•</span>
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
      <h1 className="text-[42px] mt-10">
        {children}
      </h1>
    ),

    h2: ({ children, value }) => {
      const text =
        value.children?.map((child) => child.text).join('') || ''

      const id = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')

      return (
        <h2
          id={id}
          className="text-black text-[35px] font-bold mb-6"
        >
          {children}
        </h2>
      )
    },

    h3: ({ children, value }) => {
      const text =
        value.children?.map((child) => child.text).join('') || ''

      const id = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')

      return (
        <h3
          id={id}
          className="text-[20px] mb-6"
        >
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