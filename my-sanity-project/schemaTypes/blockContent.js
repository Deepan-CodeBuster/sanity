import { defineArrayMember, defineType } from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',

  of: [
    defineArrayMember({
      type: 'block',

      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],

        annotations: [
          {
            name: 'textColor',
            title: 'Text Color',
            type: 'object',

            fields: [
              {
                name: 'color',
                title: 'Color',
                type: 'string',
                options: {
                  list: [
                    { title: 'Blue', value: '#14C1F4' },
                    { title: 'Red', value: '#ff0000' },
                    { title: 'Green', value: '#22c55e' },
                    { title: 'Orange', value: '#f97316' },
                  ],
                },
              },
            ],
          },
        ],
      },
    }),

    defineArrayMember({
      type: 'tableBlock',
    }),

    defineArrayMember({
      type: 'keyTakeaways',
    }),

    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
    }),

    defineArrayMember({
      type: 'quoteBlock',
    }),

    defineArrayMember({
      type: 'ctaSection',
    }),
  ],
})