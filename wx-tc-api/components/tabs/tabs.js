// components/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handletabs(e){
      const {index} = e.currentTarget.dataset
      // 触发父组件中的事件, 并且携带索引值
      this.triggerEvent("tabsItemChange",{index})
    }
  }
})
