import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  handleClick = () => {
    Taro.navigateTo({
      url: '/pages/example/index'
    })
  }

  render () {
    return (
      <View>
        <View>Enjoy Taro + Dva !!!</View>
        <Button onClick={this.handleClick}>view example</Button>
      </View>
    )
  }
}

export default Index
