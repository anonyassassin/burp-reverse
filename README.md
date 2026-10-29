# ReqLab (Burp Reverse)

A lightweight, modern HTTP inspector built with Next.js, inspired by the workflow of Burp Suite's Repeater.

## The Challenge
This project was built for the ACE Club Reverse Engineering Challenge. The goal was to take a closed-source application (Burp Suite), reverse-engineer one of its core features, rebuild it from scratch, and add a unique improvement.

## The Problem
Burp Suite's Repeater is an industry standard for manual HTTP inspection. However, it requires users to manually eyeball responses for security misconfigurations and changes. Advanced diffing and automated security hints are locked behind Pro versions or third-party extensions.

## The Solution
ReqLab recreates the core Repeater workflow (modifying HTTP requests and inspecting raw responses) and improves it with:
1. Automated Security Hints: Instantly flags missing security headers (CSP, HSTS, X-Frame-Options).
2. Built-in Response Diffing: Automatically compares the current response against the previous one and highlights exact line-by-line changes.
3. Reflection Check: Alerts the user if input payloads are reflected directly in the response body (a potential XSS surface).

## Tech Stack
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Vanilla CSS (Dark mode / Terminal aesthetic)
- Backend Proxy: Next.js Server Routes (to bypass CORS and handle external API requests)

## How to Run Locally

1. Clone the repository:
   git clone https://github.com/anonyassassin/burp-reverse.git

2. Navigate into the directory:
   cd burp-reverse

3. Install dependencies:
   npm install

4. Start the development server:
   npm run dev

5. Open http://localhost:3000 in your browser.

## How to Test
1. Send a GET request to https://jsonplaceholder.typicode.com/posts/1 (or any site)
2. Change the method to POST and add a JSON payload: {"title":"reqLab","body":"hello"} (you can also add your custom payload)
3. Click Send.
4. Watch the Hints panel flag missing security headers.
5. Watch the Diff vs Previous panel automatically highlight the differences between your GET and POST requests.
