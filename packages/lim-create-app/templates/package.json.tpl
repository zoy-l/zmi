{
  "private": true,
  "scripts": {
    "start": "lim serve",
    "build": "lim build",
    "prettier": "prettier --write '**/*.{js,jsx,tsx,ts,less,md,json}'",
  },
  "lint-staged": {
    "*.{js,jsx,less,md,json}": [
      "prettier --write"
    ],
    "*.ts?(x)": [
      "prettier --parser=typescript --write"
    ]
  },
  "dependencies": {
    "lint-staged": "^10.0.7",
    "prettier": "^1.19.1",
    "react": "^16.12.0",
    "react-dom": "^16.12.0",
    "lim": "^{{{ version }}}",
    "yorkie": "^2.0.0"
  }
}
