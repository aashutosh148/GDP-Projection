# GDP Projections: Interactive Global Economic Forecast Tool

## Description

GDP Projections is a web-based interactive tool that allows users to explore and visualize future economic scenarios for countries worldwide. By leveraging real GDP data and user-adjustable growth rates, this application provides a unique platform for comparing potential economic trajectories across different nations.


## Features

- **Multi-Country Selection**: Choose from a comprehensive list of countries to analyze.
- **Interactive Chart**: Visualize GDP projections from 2024 to 2050 with a responsive, color-coded line chart.
- **Customizable Growth Rates**: Adjust individual growth rates for each selected country to see how it affects long-term GDP projections.
- **Real-Time Updates**: See immediate changes in projections as you adjust growth rates.
- **AI-Assisted Projections (Gemini)**: Fetch latest IMF nominal GDP for the selected country and generate AI projections to 2050, including a concise rationale, risks, and recommendations.

## Technologies Used

- React.js
- ApexCharts for data visualization
- Tailwind CSS for styling
- Axios for API requests
- Google Generative Language Model (Gemini) for AI projections and narrative summaries

# Disclaimer

While this tool uses data primarily sourced from the International Monetary Fund (IMF), please note the following:

- The data may not always be the most up-to-date or consistent across all countries.
- Some countries may have data only up to 2022 or 2023, rather than 2024.
- The projections are based on historical data and user-defined growth rates, and should not be considered as official forecasts.
- Economic projections are subject to numerous uncertainties and external factors not accounted for in this simplified model.

This tool is intended for educational and illustrative purposes only. For the most accurate and up-to-date economic data and projections, please refer to official sources such as the IMF, World Bank, or relevant national statistical offices.

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure proxy-only AI (recommended)

This app only calls Gemini through a serverless proxy, so your API key never reaches the browser.

- Deploy the provided Vercel Function at `serverless/vercel/api/gemini.js`.
- In your Vercel project settings, set an environment variable:
  - `GEMINI_API_KEY = <your_gemini_key>`
- Deploy and copy your function URL, e.g. `https://your-vercel-app.vercel.app/api/gemini`.

3. Create `.env`

Copy `.env.example` to `.env` and set:

```bash
VITE_GEMINI_PROXY_URL=https://your-vercel-app.vercel.app/api/gemini
VITE_GEMINI_MODEL=gemini-2.5-flash
```

4. Run the dev server

```bash
npm run dev
```

Open the shown local URL in your browser.

## How AI integration works

- The app fetches the latest nominal GDP for the selected country from the IMF Datamapper API via `src/utils/api.js`.
- It then calls Gemini (see `src/utils/ai.js`) with the current GDP and country name to produce:
  - A year-by-year projection array from 2024 to 2050
  - A short rationale, risks, and recommendations
- The chart overlays the AI series alongside a simple baseline (constant growth slider) and displays the narrative under "AI Summary".
- The Gemini call is made via your proxy only (configured by `VITE_GEMINI_PROXY_URL`). No frontend fallback exists.

## Deploy to Vercel

1. Create a new Vercel project.
2. Link your GitHub repository.
3. Configure environment variables:
  - `GEMINI_API_KEY = <your_gemini_key>`
4. Deploy your project.

Note: Make sure to replace `<your_gemini_key>` with your actual Gemini API key.