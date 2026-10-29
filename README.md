# Pennywise — React Expense Tracker

A responsive expense tracker dashboard built with React, Vite, Recharts and Lucide icons.

## Features

- Dashboard cards for balance, income, expenses and savings rate
- Cash-flow area chart and spending-by-category donut chart
- Add, edit and delete income/expense transactions
- Category, type and text search filters
- This month, last month and all-time views
- Monthly budget setting and spending progress
- Export visible transactions to CSV
- Responsive desktop, tablet and mobile layout
- Persists transactions and budget in browser `localStorage`
- INR currency formatting

## Requirements

- Node.js 18 or newer
- npm

## Run locally

1. Extract the ZIP.
2. Open a terminal inside the `expense-tracker-react` folder.
3. Install packages:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production output is created in `dist/`.

## Notes

- The app starts with sample October 2026 transactions so the dashboard is populated. Use **Reset demo data** to restore them.
- Data is stored only in the browser's local storage; there is no backend or account sync.
- Google Fonts are loaded from the internet. The app itself does not require API keys.
