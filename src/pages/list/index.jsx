import React from 'react';
import { Tag, ListView, PullToRefresh } from 'antd-mobile'
import styles from './index.css'

const MyBody = (props) => {
  return (
    <div style={{position:'relative', background: '#e9e9e9', fontSize: '16px', color: '#f66'}}>
      {props.children}
    </div>
  )
}


const initialListSize = 20

class List extends React.Component {
  constructor (props) {
    super(props)
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      list: this.getList(initialListSize),
      dataSource: ds.cloneWithRows(this.getList(initialListSize)),
      length: 20,
    }
  }


  getList = (length) => {
    return (
      new Array(length).fill(1).map((item, index) => {
        return {
          id: index,
          name: 'xiaohuihui' + (index + 1),
          age: '1',
          adr: 'beijing',
          type: 'keai'
        }
      })
    )
  }

  renderRow = (item, id, idx) => {
    return (
      <div
        key={item.id} 
        style={{display: 'flex', alignItems: 'center', padding: 8, border: '2px solid #d9d9d9', borderRadius: 10, margin: 10}}>
        <div style={{paddingRight: 10}}>{item.name}</div>
        <Tag>{item.type}</Tag>
      </div>
    )
  }

  

  onEndReached = () => {
    const { dataSource, length } = this.state
    // alert('onEndReached');
    if(this.state.length < 100)
    this.setState({
      length: this.state.length + initialListSize,
      dataSource: dataSource.cloneWithRows(this.getList(length + initialListSize))
    })
  }

  render () {
    const { dataSource, list } = this.state
    return (
      <div>
        {/* {
          this.state.list.map(item => {
            return (
              <div
                key={item.id} 
                style={{display: 'flex', alignItems: 'center', padding: 8, border: '2px solid #d9d9d9', borderRadius: 10, margin: 10}}>
                <div style={{paddingRight: 10}}>{item.name}</div>
                <Tag>{item.type}</Tag>
              </div>
            )
          })
        } */}
        <div>这是top</div>
        <div>
          <ListView 
            dataSource={dataSource}
            renderRow={this.renderRow}
            style={{
              height: '500px',
              width: '100vw',
              background: '#f66'
            }}
            initialListSize={initialListSize}
            pageSize={10}
            renderHeader={() => <div>这是长列表~</div>}
            renderFooter={() => <div>没有更多了~</div>}
            onEndReached={() => this.onEndReached()}
            renderBodyComponent={() => <MyBody />}
            // pullToRefresh={<PullToRefresh 
            //   direction={'up'}
            //   onRefresh={() => this.onEndReached()}
            //   damping={50}
            // />}
            // useBodyScroll={true}
          />
        </div>
        <div>这是bottom</div>
        <div className={styles.box}></div>
      </div>
    )
  }
}

export default List