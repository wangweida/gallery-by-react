require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//拿取images文件夹中的json
let imageDatas = require('../data/imageDatas.json');
let yeomanImage = require('../images/yeoman.png');

//为json文件添加每个图片的url
imageDatas = (function getImageUrl(imageDatas) {
  "use strict";
  imageDatas.forEach(function (item, index) {
    item.url = require('../images/' + item.fileName);
  });

  return imageDatas;

})(imageDatas);


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
