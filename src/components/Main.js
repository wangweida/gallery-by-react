require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//拿取images文件夹中的json
let imageDatas = require('../data/imageDatas.json');
// let yeomanImage = require('../images/yeoman.png');

//为json文件添加每个图片的url
imageDatas = (function getImageUrl(imageDatas) {
  "use strict";
  imageDatas.forEach(function (item, index) {
    item.url = require('../images/' + item.fileName);
  });

  return imageDatas;

})(imageDatas);


class ImgFigure extends React.Component {
  render() {
    return (
      <figure className="img-figure">
        <img src={this.props.data.url} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}


class AppComponent extends React.Component {
  render() {

    let controllerUnits = [],
        imgFigures = [];

    imageDatas.forEach(function (value, index) {
      imgFigures.push(<ImgFigure data={value} key={index} />);
    });

    return (
      <section className="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
