# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9f1aeb1a-373c-45e6-a26b-889c9cc3e156

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9f1aeb1a-373c-45e6-a26b-889c9cc3e156) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Environment Variables

The following environment variables are required for full functionality:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase / PostgreSQL connection string |
| `DIRECT_URL` | Direct connection string for Prisma migrations |
| `JWT_SECRET` | Secret key for JWT signing |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port (usually 587 or 465) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `CRON_SECRET` | Secret key for Vercel Cron jobs |
| `APP_URL` | The public URL of the application (e.g., https://leadrockets.vercel.app) |
| `VITE_APP_URL` | Same as APP_URL, prefixed for frontend access |
| `GEMINI_API_KEY` | Google Gemini API key for AI features |

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9f1aeb1a-373c-45e6-a26b-889c9cc3e156) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
