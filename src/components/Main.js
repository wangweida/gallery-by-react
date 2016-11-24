require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom'

//拿取images文件夹中的json
let imageDatas = require('../data/imageDatas.json');

//为json文件添加每个图片的url
imageDatas = (function getImageUrl(imageDatas) {
  "use strict";
  imageDatas.forEach(function (item, index) {
    item.url = require(`../images/${item.fileName}`);
  });

  return imageDatas;

})(imageDatas);


class ImgFigureComponent extends React.Component {

  constructor(props) {
    super(props);
    this.clickHandle = this.clickHandle.bind(this);
  }

  clickHandle(event) {
    if(!this.props.css.isCenter) {
      this.props.range(this.props.index);
    }
    else {
      if(this.reversal.style.transform !== 'rotateY(180deg)') {
        this.reversal.style.transform = 'rotateY(180deg)';
      }
      else {
        this.reversal.style.transform = 'rotateY(0deg)';
      }
    }

    event.stopPropagation();
    event.preventDefault();
  }

  render() {

    let styleObj = this.props.css.pos;

    // console.log(this.props.css.pos);
    if(!this.props.css.isCenter) {
      styleObj.transform += this.props.css.rotate.transform;
    }
    else {
      styleObj.zIndex = 999;
    }

    return (
      <figure className="img-figure" style={styleObj} onClick={this.clickHandle}>
        <div className="img-wrap" ref={(div) => {this.reversal = div}}>
          <div className="side front">
            <img src={this.props.data.url} alt={this.props.data.title}/>
            <figcaption>
              <h2 className="img-title">{this.props.data.title}</h2>
            </figcaption>
          </div>
          <div className="side back">
            <p>{this.props.data.desc}</p>
          </div>
        </div>
      </figure>
    );
  }
}


class AppComponent extends React.Component {

  constructor(props) {
    super(props);

    this.tools = {

      //随机数生成工具
      randomNumTool : function (NumArr) {
        let min = Math.min(...NumArr);
        let max = Math.max(...NumArr);

        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      //范围取值工具
      rangeTool : function (json) {
        let leftRange = {
          x: [0 - 0.5 * json.figureWidth, 0.5 * json.imgSecWidth - 0.5 * 3 * json.figureWidth],
          y: [0 - 0.5 * json.figureHeight, json.imgSecHeight - 0.5 * json.figureHeight]
        };

        let rightRange = {
          x: [0.5 * json.imgSecWidth + 0.5 * json.figureWidth, json.imgSecWidth - 0.5 * json.figureWidth],
          y: [0 - 0.5 * json.figureHeight, json.imgSecHeight - 0.5 * json.figureHeight]
        };

        return [leftRange, rightRange];

      }
    };

    //获取坐标位置
    this.constPos = {
      centerPos : {},
      leftRange : {},
      rightRange : {}
    };

    //每个figure的状态
    this.state = {
      imgRangeArr : []
    }
  }

  reRange(centerIndex) {

    let imgRangeArr = this.state.imgRangeArr;

    //随机生成中间figure，并返回其index
     centerIndex = centerIndex || (() => {
      let centerIndex = this.tools.randomNumTool([0, imageDatas.length - 1]);

      imgRangeArr.splice(centerIndex, 1);

      return centerIndex;

    })();


    //随机生成左右两侧figure，并返回左侧index，imgRangeArr中剩余的即为右侧区域figure
    let [leftFigure, rightFigure] = findOtherFigure();

    function findOtherFigure() {

      let leftFigure = [];

      imgRangeArr.forEach((item, index) => {
        if (Math.floor(Math.random() * 10) >= 4) {
          leftFigure.push(index);
          imgRangeArr.splice(index, 1);
        }
      });

      return [leftFigure, imgRangeArr];

    }

    rightFigure.forEach((item) => {
      item.pos = {
        transform : `translate3d(${this.tools.randomNumTool(this.constPos.rightRange.x)}px,${this.tools.randomNumTool(this.constPos.rightRange.y)}px,0)`
      };

      item.rotate = {
        transform : `rotate(${this.tools.randomNumTool([-30, 30])}deg)`
      };

      item.isCenter = false;
    });

    leftFigure.forEach((item) => {
      imgRangeArr.splice(item, 0, {
        pos : {
          transform: `translate3d(${this.tools.randomNumTool(this.constPos.leftRange.x)}px,${this.tools.randomNumTool(this.constPos.leftRange.y)}px,0)`
        },
        rotate : {
          transform : `rotate(${this.tools.randomNumTool([-30, 30])}deg)`
        },
        isCenter : false
      })
    });



    imgRangeArr.splice(centerIndex, 0, {
      pos : this.constPos.centerPos,
      isCenter : true,
      rotate : {
        transform : `rotate(${this.tools.randomNumTool([-30, 30])}deg)`
      }
    });

    this.setState({
      imgRangeArr : imgRangeArr
    });



  }

  componentDidMount() {

    //获取figure宽度与img-sec宽度
    let figureWidth = ReactDOM.findDOMNode(this.img0).offsetWidth,
        figureHeight = ReactDOM.findDOMNode(this.img0).offsetHeight,
        imgSecWidth = ReactDOM.findDOMNode(this['img-sec']).offsetWidth,
        imgSecHeight = ReactDOM.findDOMNode(this['img-sec']).offsetHeight,

        //获取居中位置
        centerPos = {
          transform : `translate3d(${0.5 * imgSecWidth - 0.5 * figureWidth}px,${0.5 * imgSecHeight - 0.5 * figureHeight}px,0)`
        },

        //获取左右两侧坐标范围
        [leftRange, rightRange] = this.tools.rangeTool({
          figureWidth : figureWidth,
          figureHeight : figureHeight,
          imgSecWidth : imgSecWidth,
          imgSecHeight : imgSecHeight
        });

    this.constPos.centerPos = centerPos;
    this.constPos.leftRange = leftRange;
    this.constPos.rightRange = rightRange;

    this.reRange();


  }



  render() {

    let controllerUnits = [],
        imgFigures = [];

    imageDatas.forEach(function (value, index) {
      if(!this.state.imgRangeArr[index]) {
        this.state.imgRangeArr[index] = {
          pos : {
            x : 0,
            y : 0
          },
          rotate : {
            transform : '0deg'
          },
          isCenter : false
        }
      }

      imgFigures.push(<ImgFigureComponent data={value} index={index} key={index} range={this.reRange.bind(this)} ref={(figure) => {this['img' + index] = figure;}} css={this.state.imgRangeArr[index]} />);
    }.bind(this));

    return (
      <section className="stage">
        <section className="img-sec" ref={(section) => {this['img-sec'] = section;}}>
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
