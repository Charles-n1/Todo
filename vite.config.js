import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 🔒 Security: the CSP = the "guest list" of the page.
// The browser refuses everything that is not on it (a script from another site, a form that sends your data...).
// So even if someone manages to inject HTML, their code can't run.
const CSP = [
  "default-src 'self'", // by default: only our own files
  "img-src 'self' data:", // + the paper texture of the "Old paper" theme (data:)
  "media-src 'self' blob:", // + the music (blob:)
  "style-src 'self'", // only our CSS file (React's style={...} is set from JavaScript: allowed anyway)
  "object-src 'none'", // no old plugins (Flash...)
  "base-uri 'self'", // nobody can change where our links point to
  "form-action 'none'", // no form can send data anywhere
].join('; ');

// Adds the CSP to index.html, ONLY in the built site (npm run build).
// In dev (npm run dev), Vite needs its own little scripts for the live reload: the CSP would block them.
function addCsp() {
  return {
    name: 'add-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace('<head>', '<head>\n    <meta http-equiv="Content-Security-Policy" content="' + CSP + '" />');
    },
  };
}

// base: the site lives at https://charles-n1.github.io/Todo/
export default defineConfig({
  plugins: [react(), addCsp()],
  base: '/Todo/',
});
