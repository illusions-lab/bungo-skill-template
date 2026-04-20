// vite-ssg エントリポイント
// 静的サイトとしてビルド時にプリレンダリングされる

import { ViteSSG } from 'vite-ssg/single-page'
import App from './App.vue'
import './assets/styles.css'

export const createApp = ViteSSG(App)
