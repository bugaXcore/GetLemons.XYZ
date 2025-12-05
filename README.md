# GetLemons.XYZ 🍋

A modern web platform for showcasing and distributing After Effects scripts, 3D assets, and creative tools.

## Features

- 🎨 **Interactive Pulse Canvas Background** - Customizable animated background with real-time controls
- 📦 **Asset Repository** - Browse and download AE scripts, 3D assets, and more
- 🔐 **Admin Panel** - Manage assets and content with Supabase authentication
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast Performance** - Built with React 19, TypeScript, and Vite

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Supabase (Authentication & Database)
- **Styling**: CSS Modules
- **Icons**: Lucide React
- **Canvas**: HTML5 Canvas API

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for admin features)

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/GetLemons.XYZ.git
   cd GetLemons.XYZ
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials:
     ```bash
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`

## Building for Production

```bash
npm run build
npm run preview
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel settings
4. Deploy!

### Netlify
1. Push your code to GitHub
2. Connect repository in Netlify
3. Add environment variables
4. Deploy!

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Create an `assets` table with the following schema:
   ```sql
   create table assets (
     id bigint primary key generated always as identity,
     title text not null,
     category text not null,
     version text,
     license text,
     file_type text,
     short_desc text,
     full_desc text,
     featured boolean default false,
     section text,
     gallery text[],
     created_at timestamp with time zone default now()
   );
   ```
3. Enable Row Level Security (RLS) policies as needed
4. Copy your project URL and anon key to `.env.local`

## Project Structure

```
GetLemons.XYZ/
├── components/          # React components
│   ├── Admin.tsx       # Admin panel
│   ├── AssetCard.tsx   # Asset display cards
│   ├── Header.tsx      # Site header
│   ├── Hero.tsx        # Homepage hero
│   ├── PulseCanvas.tsx # Animated background
│   └── Repository.tsx  # Asset listing
├── App.tsx             # Main app component
├── types.ts            # TypeScript definitions
├── data.ts             # Demo data
├── constants.ts        # App constants
└── supabaseClient.ts   # Supabase configuration
```

## License

MIT

## Contact

For questions or support, visit [GetLemons.XYZ](https://getlemons.xyz)
