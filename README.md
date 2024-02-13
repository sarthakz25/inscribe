# Inscribe

Inscribe is a modern note-taking app for organizing personal and team notes.

## Demo

[https://inscribe-app.vercel.app](https://inscribe-app.vercel.app)

## About

Inscribe allows users to create and share notes with rich text editing, images, expandable sections, and more. Key features include:

- Real-time database
- Recover deleted files
- Stripe Integration
- Subscription plan
- Light and Dark mode
- Blocknote
- Expandable sidebar
- Infinite children documents

## Built with

Technologies used in the project:

### Frontend
- ReactJS
- TypeScript
- NextJS

### Backend
- Convex

### Auth
- Clerk

### Payments
- Stripe

### UI
- Tailwind CSS
- Shadcn UI

## Installation Steps:

1. Install packages

```
npm i & yarn install
```

2. Setup .env file

```
# CLERK AUTHORIZATION ENVIRONMENT VARIABLES
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# CONVEX ENVIRONMENT VARIABLES
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# DOMAIN
NEXT_PUBLIC_DOMAIN=

# EDGE STORE
EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=

# STRIPE
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

3. Setup Convex

```
npx convex dev
```

4. Start the app

```
npm run dev
```

[Check out my other projects on GitHub!](https://github.com/sarthakz25)