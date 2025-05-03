
import Home from './pages/Home.js';

const main = document.getElementById('main');

const routes = {
    '/': () => Home(),
  };
  
  function render(path) {
    const view = routes[path] || (() => '<h1>404 Not Found</h1>');
    main.appendChild(view());
  }
  
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('a[data-link]')) {
      e.preventDefault();
      const path = e.target.getAttribute('href');
      history.pushState(null, '', path);
      render(path);
    }
  });
  
  window.addEventListener('popstate', () => render(window.location.pathname));
  
  render(window.location.pathname);
  