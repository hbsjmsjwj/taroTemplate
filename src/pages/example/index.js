import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import testServices from '../../services/test'

import './index.less'

@connect(state => ({
  num: state.counter.num
}))
class Index extends Component {

  config = {
    navigationBarTitleText: 'counter 例子'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  add = () => {
    const { dispatch, num } = this.props
    dispatch({ type: 'counter/add', num: num + 1 })
  }

  dec = () => {
    const { dispatch, num } = this.props
    dispatch({ type: 'counter/add', num: num - 1 })
  }

  handleFetch = async () => {
    const data = await testServices.test()
    console.log(data)
  }

  handleClick = () => {
    Taro.navigateTo({
      url: '/pages/index/index'
    })
  }

  render () {
    const { num } = this.props

    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.add}>+</Button>
        <Button className='dec_btn' onClick={this.dec}>-</Button>
        <View><Text>{num}</Text></View>

        <Button onClick={this.handleClick}>view index</Button>
        <Button onClick={this.handleFetch}>fetch data</Button>
      </View>
    )
  }
}

export default Index
