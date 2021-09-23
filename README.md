# sdotco - Google Sheets alternative for [dotco](https://github.com/someshkar/dotco)-[@someshkar](https://github.com/someshkar) and [ndotco](https://github.com/kavin25/ndotco)-[@kavin25](https://github.com/kavin25)

A URL shortener using Google Sheets and Vercel

## Setup

1. Clone the repository and install dependencies

```sh
git clone https://github.com/hashsaksham/sdotco
cd sdotco
yarn
```

2. Get your credentials from [Google Developer Console](https://console.cloud.google.com/apis/dashboard). You can refer to instructions on https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account (Service Account Method)

3. Create a Google Sheet and share it with your service account using the email noted from Google Developer Console.

4. Add `.env` variables

```sh
cp .env.example .env
vim .env
```

> Note: The `GITHUB_USERNAME` environment variable is optional.

5. Deploy to Vercel

> Note: In production (Vercel), you'll have to enter the env variables manually.
