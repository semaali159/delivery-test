export default () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    mongo: {
      uri: process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/delivery',
    },
    partner: {
      apiKey: process.env.PARTNER_API_KEY ?? '',
    },
  });