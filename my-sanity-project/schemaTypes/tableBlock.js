import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'tableBlock',
  title: 'Table',
  type: 'object',

  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',

      of: [
        {
          type: 'object',
          name: 'row',

          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',

              of: [
                {
                  type: 'string',
                },
              ],
            }),
          ],

          preview: {
            select: {
              cells: 'cells',
            },
            prepare({ cells }) {
              return {
                title: cells?.join(' | ') || 'Empty row',
              }
            },
          },
        },
      ],
    }),
  ],
})