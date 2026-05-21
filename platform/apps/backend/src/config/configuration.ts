export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.BACKEND_PORT || process.env.PORT || '3001', 10),
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',
  },
  database: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'loraloop-jwt-secret-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'loraloop-refresh-secret-change-in-production',
    expiry: process.env.JWT_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '30d',
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || '0000000000000000000000000000000000000000000000000000000000000000',
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback',
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID || '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
      callbackUrl: process.env.TWITTER_CALLBACK_URL || 'http://localhost:3001/api/oauth/twitter/callback',
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
      callbackUrl: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3001/api/oauth/linkedin/callback',
    },
    meta: {
      appId: process.env.META_APP_ID || '',
      appSecret: process.env.META_APP_SECRET || '',
      callbackUrl: process.env.META_CALLBACK_URL || 'http://localhost:3001/api/oauth/meta/callback',
    },
    tiktok: {
      clientId: process.env.TIKTOK_CLIENT_ID || '',
      clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
      callbackUrl: process.env.TIKTOK_CALLBACK_URL || 'http://localhost:3001/api/oauth/tiktok/callback',
    },
    reddit: {
      clientId: process.env.REDDIT_CLIENT_ID || '',
      clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
      callbackUrl: process.env.REDDIT_CALLBACK_URL || 'http://localhost:3001/api/oauth/reddit/callback',
    },
    pinterest: {
      clientId: process.env.PINTEREST_CLIENT_ID || '',
      clientSecret: process.env.PINTEREST_CLIENT_SECRET || '',
      callbackUrl: process.env.PINTEREST_CALLBACK_URL || 'http://localhost:3001/api/oauth/pinterest/callback',
    },
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'r2',
    r2: {
      accountId: process.env.R2_ACCOUNT_ID || '',
      accessKey: process.env.R2_ACCESS_KEY || '',
      secretKey: process.env.R2_SECRET_KEY || '',
      bucket: process.env.R2_BUCKET || 'loraloop-media',
      publicUrl: process.env.R2_PUBLIC_URL || 'https://media.loraloop.com',
      endpoint: `https://${process.env.R2_ACCOUNT_ID || 'placeholder'}.r2.cloudflarestorage.com`,
    },
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    prices: {
      starterMonthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || '',
      starterAnnual: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID || '',
      proMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
      proAnnual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || '',
      businessMonthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || '',
      businessAnnual: process.env.STRIPE_BUSINESS_ANNUAL_PRICE_ID || '',
    },
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    from: process.env.EMAIL_FROM || 'noreply@loraloop.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Loraloop',
  },
});
