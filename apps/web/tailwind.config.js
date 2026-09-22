import macosUiPreset from '@sylonikse/macos-ui/tailwind.preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [macosUiPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './node_modules/@sylonikse/macos-ui/dist/**/*.js',
  ],
}
