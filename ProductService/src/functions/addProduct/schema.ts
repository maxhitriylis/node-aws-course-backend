export default {
  type: "object",
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    img: { type: 'string' },
    price: { type: 'number' },
    count: { type: 'number' }
  },
  required: ['title', 'description', 'price', 'count']
} as const;
