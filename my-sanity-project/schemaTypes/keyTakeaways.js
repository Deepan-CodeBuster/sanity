import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'keyTakeaways',
  title: 'Key Takeaways',
  type: 'object',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Key Takeaways',
    }),

    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',

      of: [
        {
          type: 'string',
        },
      ],
    }),
  ],
})