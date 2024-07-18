import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

const isDev = process.env.NODE_ENV == 'development'

export default defineManifest({
  name: `low-dopamine-extension${isDev ? ` ➡️ Dev` : ''}`,
  description: 'Make web content less stimulating',
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-34.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  permissions: ['activeTab'],
  host_permissions: [
    "http://localhost:5173/*",
    "http://127.0.0.1:5173/*"
  ],
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/contentScript/index.js'],
    },
  ],
  background: {
    service_worker: 'src/background/index.js',
    type: 'module',
  },
  options_page: 'options.html',
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
})