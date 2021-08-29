import { SplashScreen } from '@capacitor/splash-screen';
import App from './components/App.svelte';
import '@today/shared/styles/global.css';

// Hide the splash (you should do this on app launch)
SplashScreen.hide();
// import { StatusBar, Style } from '@capacitor/status-bar';

// iOS only
// window.addEventListener('statusTap', function () {
//   console.log('statusbar tapped');
// });

const app = new App({
  target: document.getElementById('app'),
});

export default app;
