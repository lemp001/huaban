import React from 'react';
import { Icon } from 'antd';
import { Slider } from 'antd-mobile'
import styles from './styles.css';
import aaa from '../../assets/jian.jpg'

const COLOR_LIST = ['#f04134', '#00a854', '#108ee9', '#f5317f', '#f56a00', '#7265e6', '#333']

const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1436201_pww2zuwnrkb.js'
})

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      canvas: null,
      context: null,
      painting: false,
      lastPoint: { x: undefined, y: undefined },
      pathArr: [
        require("../../assets/jian.jpg"),
        require("../../assets/qian.jpg"),
        require("../../assets/add.jpg"),
      ],
      index: 0,
      canvasHistory: [],
      step: 0,
      shape: 'line',
      redoArr: [],
      visible: false,
      color: '#f04134',
      fontSize: 4,
    }
  }


  componentDidMount() {
    let canvas = document.getElementById('canvas');
    let context = document.getElementById('canvas').getContext('2d');
    let pageWidth = document.documentElement.clientWidth;
    let pageHeight = document.documentElement.clientHeight;
    canvas.width = pageWidth;
    canvas.height = pageHeight;
    const { lastPoint, painting, fontSize, color, pathArr } = this.state
    console.log(canvas.toDataUrl)
    context.lineWidth = fontSize;
    context.strokeStyle = color;
    var img = new Image();
    img.src = pathArr[0]
    img.onload = () => {
      context.drawImage(img, 0, 0, pageWidth, pageHeight);
      this.setState({
        canvasHistory: [this.state.canvas.toDataURL()]
      })
    }
    
    canvas.ontouchstart = (e) => {
      document.body.addEventListener('touchmove', function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      }, { passive: false });
      this.setState({
        painting: true,
        lastPoint: {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        }
      })
      this.drawCircle(lastPoint.x, lastPoint.y, 5);
      
    }
    canvas.ontouchmove = (e) => {
      if (this.state.painting && this.state.shape === 'line' ) {
        let x = e.touches[0].pageX;
        let y = e.touches[0].pageY;
        let newPoint = { 'x': x, 'y': y };
        this.drawLine(this.state.lastPoint.x, this.state.lastPoint.y, newPoint.x, newPoint.y);
        this.setState({
          lastPoint: newPoint
        })
      }
    }
    canvas.ontouchend = (e) => {
      document.body.addEventListener('touchmove', function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      }, { passive: false });
      const { lastPoint, shape, context } = this.state
      this.setState({ painting: false });
      let x = e.changedTouches[0].clientX;
      let y = e.changedTouches[0].clientY;
      this.canvasDraw()
      if(shape === 'rect') {
        context.strokeRect(lastPoint.x, lastPoint.y, x - this.state.lastPoint.x, y - this.state.lastPoint.y, '#f66');
      }
      if(shape === 'arrow') {
        this.drawLineArrow(lastPoint.x, lastPoint.y, x, y)
      }
    }
    this.setState({
      canvas,
      context
    })
  }
  
  drawCircle = (x, y, radius) => {
    const { context } = this.state
    // 新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
    context.beginPath();
    // 画一个以（x,y）为圆心的以radius为半径的圆弧（圆），
    // 从startAngle开始到endAngle结束，按照anticlockwise给定的方向（默认为顺时针）来生成。
    context.arc(x, y, radius, 0, Math.PI * 2);
    // 通过填充路径的内容区域生成实心的图形
    context.fill();
    // 闭合路径之后图形绘制命令又重新指向到上下文中。
    // context.closePath();
  }

  drawLine = (x1, y1, x2, y2) => {
    const { context, color, fontSize } = this.state
    // 设置线条宽度
    context.lineWidth = fontSize;
    // 设置线条末端样式。
    context.strokeStyle = color;
    context.lineCap = "round";
    // 设定线条与线条间接合处的样式
    context.lineJoin = "round";
    // moveTo(x,y)将笔触移动到指定的坐标x以及y上
    context.moveTo(x1, y1);
    // lineTo(x, y) 绘制一条从当前位置到指定x以及y位置的直线
    context.lineTo(x2, y2);
    // 通过线条来绘制图形轮廓
    context.stroke();
    context.closePath();
  }

  setOptions = (key, value) => {
    this.setState({
      [key]: value
    }, () => {
      this.state.context[key === 'color' ? 'strokeStyle' : 'lineWidth'] = value
    })
  }

  drawLineArrow = (fromX, fromY, toX, toY) => {
    const { context, canvas } = this.state
    let headlen = 10;//自定义箭头线的长度
    let theta = 45;//自定义箭头线与直线的夹角，个人觉得45°刚刚好
    let arrowX, arrowY;//箭头线终点坐标
    //计算各角度和对应的箭头终点坐标
    let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI;
    let angle1 = (angle + theta) * Math.PI / 180;
    let angle2 = (angle - theta) * Math.PI / 180;
    let topX = headlen * Math.cos(angle1);
    let topY = headlen * Math.sin(angle1);
    let botX = headlen * Math.cos(angle2);
    let botY = headlen * Math.sin(angle2);
    context.beginPath();
    //画直线
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);

    arrowX = toX + topX;
    arrowY = toY + topY;
    //画上边箭头线
    context.moveTo(arrowX, arrowY);
    context.lineTo(toX, toY);

    arrowX = toX + botX;
    arrowY = toY + botY;
    //画下边箭头线
    context.lineTo(arrowX, arrowY);
    
    // context.strokeStyle = color;
    context.stroke();
}

  //清屏
  canvasClear = () => {
    const { canvas, context } = this.state
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#f5f5f9';
    context.fillRect(0, 0, canvas.width, canvas.height);
    let img = new Image();
    img.src = this.state.canvasHistory[0]
    img.onload = () => {
      context.drawImage(img, 0, 0);
      this.setState({
        canvasHistory: [this.state.canvas.toDataURL()]
      })
    }
  }

  canvasDraw = () => {
    this.setState({
      step: this.state.step + 1,
      canvasHistory: [...this.state.canvasHistory, this.state.canvas.toDataURL()]
    })
  }

  canvasUndo = () => {//撤销
    const { canvas, context } = this.state
    console.log(this.state.canvasHistory.length)
    if(this.state.canvasHistory.length > 1) {
      const arr = JSON.parse(JSON.stringify(this.state.canvasHistory))
      if(this.state.step + 1 === this.state.canvasHistory.length) {
        // arr.pop()
        this.setState({
          redoArr: [arr.pop()]
        })
      }
      context.clearRect(0, 0, canvas.width, canvas.height)
      // const arr = JSON.parse(JSON.stringify(this.state.canvasHistory))
      const url = arr.splice(arr.length-1, 1)[0]
      let pic = new Image()
      pic.src = url
      pic.onload = () => {
        this.state.context.drawImage(pic, 0, 0)
        this.setState({
          canvasHistory: arr,
          redoArr: [url, ...this.state.redoArr],
          step: this.state.step - 1
        })
      }
    }else {
      context.clearRect(0, 0, canvas.width, canvas.height)
      this.setState({
        redoArr: [...this.state.canvasHistory, ...this.state.redoArr],
        canvasHistory: [this.state.canvasHistory[0]],
        step: 0
      })
      let img = new Image();
      img.src = this.state.canvasHistory[0]
      img.onload = () => {
        context.drawImage(img, 0, 0);
        this.setState({
          canvasHistory: [this.state.canvas.toDataURL()]
        })
      }
      console.log('不能再继续撤销了')
    }
  }
  canvasRedo = () => {//重绘
    const { canvas, context } = this.state
    if(this.state.redoArr.length > 0) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      const arr = JSON.parse(JSON.stringify(this.state.redoArr))
      const url = arr.splice(0, 1)[0]
      let pic = new Image()
      pic.src = url
      pic.onload = () => {
        this.state.context.drawImage(pic, 0, 0)
        this.setState({
          redoArr: arr,
          canvasHistory: [...this.state.canvasHistory, url],
          step: this.state.step + 1
        })
      }
    }else {
      this.setState({
        step: this.state.canvasHistory.length
      })
      console.log('已经是最新的记录了')
    }
  }


  shapeActive = (type) => {
    return this.state.shape === type ? styles.shape_border : null
  }
  changeShape = (shape) => {
    this.setState({
      shape,
    })
  }

  render() {
    const {fontSize, color, visible} = this.state
    console.log('this.state', this.state);
    return (
      <div className={styles.box}>
        <canvas
          id='canvas'
        >
        </canvas>
        <div className={styles.button_bar}>
          <div className={styles.button}
            onClick={this.canvasClear}
            >
            <div className={styles.icon}><MyIcon type="icon-Icon_shanchu" /></div>
            清空画布
          </div>
          <div className={styles.button}
            onClick={() => this.setState({visible: !visible})}
            >
            <div className={styles.icon}><MyIcon type="icon-Icon_huabi" /></div>
            画笔
          </div> 
          <div className={styles.button}
            onClick={this.canvasUndo}
            >
            <div className={styles.icon}><MyIcon type="icon-Icon_xiangzuofanzhuan" /></div>
            撤销
          </div>
          <div className={styles.button}
            onClick={this.canvasRedo}
            >
            <div className={styles.icon}><MyIcon type="icon-Icon_xiangyoufanzhuan" /></div>
            前进
          </div>
          <div className={visible ? styles.edit_box_visible : styles.edit_box_hidden} >
            <div className={styles.color_box}>
              {
                COLOR_LIST.map(item => {
                  return (
                    <div 
                      className={item === color ? styles.color_active : styles.color_circle} 
                      style={{background: item}}
                      onClick={() => {this.setOptions('color', item)}}
                      >
                    </div>
                  )
                })
              }
            </div>

            <div style={{display: 'flex', background: '#fff', alignItems: 'center', justifyContent: 'center', margin: '10px 0'}}>
              <div style={{width: 150, marginRight: 20, }}>
                <Slider 
                  range={false}
                  defaultValue={4}
                  max={14}
                  min={2}
                  onChange={(value) => this.setOptions('fontSize', value)}
                  trackStyle={{
                    backgroundColor: '#f66',
                    height: '5px',
                  }}
                  railStyle={{
                    backgroundColor: '#ccc',
                    height: '5px',
                  }}
                  handleStyle={{
                    borderColor: '#f66',
                    height: '14px',
                    width: '14px',
                    marginLeft: '-7px',
                    marginTop: '-4.5px',
                    backgroundColor: '#f66',
                  }}
                />
              </div>
              <div style={{marginRight: 20}}>当前画笔大小 {fontSize}</div>
              <div style={{width: fontSize, height: fontSize, borderRadius: '100%', background: color}}></div>
            </div>

            <div style={{display: 'flex', background: '#fff', alignItems: 'center', justifyContent: 'space-around', fontSize: 30, lineHeight: '30px'}}>
              <div className={this.shapeActive('line')}
                onClick={() => this.changeShape('line')}
                >
                <MyIcon type="icon-Icon_lujinghuizhi" />
              </div>
              <div className={this.shapeActive('rect')}
                onClick={() => this.changeShape('rect')}
                >
                <MyIcon type="icon-juxing" />
              </div>
              <div className={this.shapeActive('arrow')}
                onClick={() => this.changeShape('arrow')}
                >
                <MyIcon type="icon-ai37" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
