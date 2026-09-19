# SUST Assignment Cover Generator

A responsive Vite + React application that creates a one-page A4 SUST Sociology assignment cover in PDF format.

## Run locally

1. Install Node.js 20.19 or later.
2. Open this project folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev` and open the local URL shown in the terminal.

## Create a production build

Run `npm run build`. Upload the generated `dist` folder to any static host, or import the project into Vercel and use the default Vite build settings.

## What students enter

- Full name
- Registration number
- Course code
- Assignment title
- Submission date

The selected course automatically fills the course title and submitted-to teacher details. The resulting download is a single A4 PDF page, including the submission date in the lower-left footer.
