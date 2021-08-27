<p align="center">
  <img src="https://todaylist.io/assets/images/icon.png" width="128" height="128">
</p>

# Today

### A minimal 24 hour todo list

> The list clears every 24 hours which will allow you to focus on your daily tasks without letting them pile up.

#### Built with Svelte + Electron + Typescript

<div style="background: blue;">
  <img src="https://todaylist.io/assets/images/light.png" width="49%">
  <img src="https://todaylist.io/assets/images/settings.png" width="49%">
</div>

## Development

```
npm install
```

Run locally in watch mode:

```
npm run start
```

Build app:

```
npm run build # or `build:prod`
```

#### Custom themes

You can add a new theme to the [themes.json](https://github.com/daniel-hayes/today/blob/main/packages/shared/themes/themes.json) file. Each new theme requires the following fields:

```
  {
    "title": "My Theme",
    "file": "my-theme.css",
    "primary": "#5dbbea",
    "secondary": "#f0f0f0",
    "accent": "#5dbbea"
  }
```

NOTE: These should be added in alphabetical order (A-Z) based on the title of the theme.

After adding your theme to the themes.json config, you can run:

```
npm run generate:css
```

This will create the CSS files associated with your theme. They will then automatically be accessible in the theme menu.

## Download

<a href="https://github.com/daniel-hayes/today/releases">
  Releases
</a>
