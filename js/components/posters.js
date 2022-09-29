'use strict';

class Posters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0
    };
  }

  render() {
    var client = new XMLHttpRequest();
    client.open('GET', '/posters.json');
    client.onreadystatechange = function() {
      var result = JSON.parse(client.responseText);
      return e(
        'div',
        { className: 'ws--posters' },
        result.map(function(poster) {
          e(
            'div',
            e('img', { src: poster.image }),
            e('h1', poster.title),
            e('p', poster.description)
          )
        })
      );
    };
    client.send();
  }
}