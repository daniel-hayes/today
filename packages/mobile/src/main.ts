import App from './components/App.svelte';

// import { StatusBar, Style } from '@capacitor/status-bar';

// iOS only
window.addEventListener('statusTap', function () {
  console.log('statusbar tapped');
});

const hideStatusBar = async () => {
  // TODO: determine if background color is light or dark
  // await StatusBar.setStyle({ style: Style.Light });
  // await StatusBar.hide();
};

// https://capacitorjs.com/docs/apis/status-bar
hideStatusBar();

const app = new App({
  target: document.getElementById('app'),
});

export default app;
