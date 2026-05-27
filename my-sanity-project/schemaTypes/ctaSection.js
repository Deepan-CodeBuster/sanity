import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ctaSection',
  title: 'CTA Section',
  type: 'object',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),

    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    }),

    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
    }),
  ],
})