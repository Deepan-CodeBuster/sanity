import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'quoteBlock',
  title: 'Quote Block',
  type: 'object',

  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
    }),

    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
    }),
  ],
})