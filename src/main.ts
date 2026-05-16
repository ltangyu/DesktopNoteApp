import './styles/global.css';

function showError(prefix: string, e: unknown) {
  const err = e as Error;
  const msg = err?.message ?? String(e);
  const stack = err?.stack ?? '';
  document.body.innerHTML =
    '<pre style="padding:20px;color:#900;font:12px monospace;white-space:pre-wrap;background:#fff;height:100vh;margin:0;overflow:auto">' +
    `${prefix}: ${msg}\n\n${stack}` +
    '</pre>';
}

window.addEventListener('error', (e) => showError('WINDOW', e.error ?? e.message));
window.addEventListener('unhandledrejection', (e) => showError('REJECT', e.reason));

(async () => {
  try {
    const { createApp } = await import('vue');
    const { createPinia } = await import('pinia');
    const App = (await import('./App.vue')).default;
    const { i18n } = await import('./i18n');

    const app = createApp(App);
    app.use(createPinia());
    app.use(i18n);
    app.mount('#app');
  } catch (e) {
    showError('MOUNT', e);
  }
})();
