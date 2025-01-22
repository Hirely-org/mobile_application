FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files and directories
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Config files from your tree
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/next-env.d.ts ./
COPY --from=builder /app/middleware.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/postcss.config.mjs ./
COPY --from=builder /app/tailwind.config.ts ./
COPY --from=builder /app/config.js ./
COPY --from=builder /app/components.json ./
COPY --from=builder /app/eslint.config.mjs ./

# Source directories
COPY --from=builder /app/components ./components
COPY --from=builder /app/hooks ./hooks
COPY --from=builder /app/lib ./lib

# Create and use non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]