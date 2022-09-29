(function(exports) {
  'use strict';

  window.e = React.createElement;

  const domContainer = document.getElementById('content');
  const root = ReactDOM.createRoot(domContainer);
  root.render(e(Home));
})(window);