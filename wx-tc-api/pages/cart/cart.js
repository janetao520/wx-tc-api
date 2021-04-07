// pages/cart/cart.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data:{
    scanCodeMsg:"",
    goods:[],
    page:1,
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    total: 0,
    carts: [],
    billno:'t'+new Date().getTime(),
    date: new Date().getFullYear()+'-'+ new Date().getMonth()+1+'-'+ new Date().getDate(),
    time: new Date().getHours()+':'+ new Date().getMinutes()+':'+ new Date().getSeconds(),
    select:false,
    pccustcodeSelect:false,
    pccustcode:'',
    grade_name:'--请选择--',
    zzdm:'',
    grades:['001 中兴店','002 南城店','003 东城店','004 厚街店','005 麻涌店'],
    gradesArr:['001','002','003','004','005'],
    pccustcodeArrs:[
        [110001,110002,110003],
        [120001,120002,120003],
        [130001,130002,130003],
        [140001,140002,140003],
        [150001,150002,150003]
      ],
      pccustcodeStrArrs:[
        ['110001 中兴店客户一','110002 中兴店客户二','110003 中兴店客户三'],
        ['120001 南城店客户一','120002 南城店客户二','120003 南城店客户三'],
        ['130001 东城店客户一','130002 东城店客户二','130003 东城店客户三'],
        ['140001 厚街店客户一','140002 厚街店客户二','140003 厚街店客户三'],
        ['150001 麻涌店客户一','150002 麻涌店客户二','150003 麻涌店客户三']
      ],
      //custom:['一','二','三','四','五','六','七','八','九','十'],
      pccustcodeArr:'',
      pccustcodeStrArr:'',
      isShowConfirm:false,
      money:0,
      cardIndex:'',
      pccustcodeStr:'',
      show:true,
  },
  onShow: function (item) {
    console.log(this.data.carts);
    console.log(app.globalData.cartData);
    if(app.globalData.cartData){
    // 写回经点击修改后的数组
    this.setData({
      carts: app.globalData.cartData
    });
  }
},
bindDel: function() {
  console.log(this.data.carts);
  var carts = this.data.carts;
  // 遍历
  for (var i = 0; i < carts.length; i++) {
    if(carts[i].selected){
      carts.splice(i, 1); 
      i-=1;
    }
  }
  if(carts.length<1){
    this.setData({
      selectedAllStatus:false
    });
  }
  this.setData({
    carts: carts
  });
  this.sum()
},
    //
bindMinus: function(e) {
  var that = this;
  var index = parseInt(e.currentTarget.dataset.index);
  var num = that.data.carts[index].num;
  var carts = that.data.carts;
  // 如果只有1件了，就不允许再减了
  if (num > 1) {
    num --;
  }else{
    carts.splice(index, 1); 
    that.sum();
    that.setData({
      carts:carts
    });
  }
  // 只有大于一件的时候，才能normal状态，否则disable状态
  var minusStatus = num <= 1 ? 'disabled' : 'normal';
  // 购物车数据
  
  carts[index].num = num;
  // 按钮可用状态
  var minusStatuses = that.data.minusStatuses;
  minusStatuses[index] = minusStatus;
  // 将数值与状态写回
  that.setData({
    minusStatuses: minusStatuses
  });
  that.sum();
},

bindPlus: function(e) {
  var that = this;
  var index = parseInt(e.currentTarget.dataset.index);
  var num = that.data.carts[index].num;
  // 自增
  num ++;
  console.log(num);
 
        // 只有大于一件的时候，才能normal状态，否则disable状态
        var minusStatus = num <= 1 ? 'disabled' : 'normal';
        // 购物车数据
        var carts = that.data.carts;
        carts[index].num = num;
        // 按钮可用状态
        var minusStatuses = that.data.minusStatuses;
        minusStatuses[index] = minusStatus;
        // 将数值与状态写回
        that.setData({
          minusStatuses: minusStatuses
        });
        that.sum();
}, 
bindManual: function(e) {
  var that = this;
  var index = parseInt(e.currentTarget.dataset.index);
  var num = parseInt(e.detail.value);
  var carts = that.data.carts;
  if(num>0){
  console.log(num);
        // 只有大于一件的时候，才能normal状态，否则disable状态
        var minusStatus = num <= 1 ? 'disabled' : 'normal';
        // 购物车数据
        carts[index].num = num;
        // 按钮可用状态
        var minusStatuses = that.data.minusStatuses;
        minusStatuses[index] = minusStatus;
        // 将数值与状态写回
        that.setData({
          minusStatuses: minusStatuses
        });
      }else{
        carts.splice(index, 1); 
      }
      that.sum();
      that.setData({
        carts:carts
      });
}, 
bindCheckbox: function(e) {
/*绑定点击事件，将checkbox样式改变为选中与非选中*/
//拿到下标值，以在carts作遍历指示用
var index = parseInt(e.currentTarget.dataset.index);
//原始的icon状态
var selected = this.data.carts[index].selected;
var carts = this.data.carts;
// 对勾选状态取反
carts[index].selected = !selected;
// 写回经点击修改后的数组
this.setData({
  carts: carts
});
this.sum()
},

bindSelectAll: function() {
 // 环境中目前已选状态
 var selectedAllStatus = this.data.selectedAllStatus;
 // 取反操作
 selectedAllStatus = !selectedAllStatus;
 // 购物车数据，关键是处理selected值
 var carts = this.data.carts;
 // 遍历
 for (var i = 0; i < carts.length; i++) {
   carts[i].selected = selectedAllStatus;
 }
 this.setData({
   selectedAllStatus: selectedAllStatus,
   carts: carts
 });
 this.sum()
},

bindCheckout: function(e) {
 // 初始化toastStr字符串
 var toastStr = [];
 // 遍历取出已勾选的
 for (var i = 0; i < this.data.carts.length; i++) {
   if (this.data.carts[i].selected) {
     toastStr.push(this.data.carts[i]);
   }
 }
 if (toastStr.length<1){
   wx.showToast({
     title: '请选择要结算的商品',
     icon: "none",
     duration: 1000
   });
   return false;
 }
 if(!this.data.zzdm){
  wx.showToast({
    title: '请输入组织编码',
    icon: "none",
    duration: 1000
  });
  return false;
 }
 if(!this.data.pccustcode){
  wx.showToast({
    title: '请输入批发客户编号',
    icon: "none",
    duration: 1000
  });
  return false;
 }
 if(!e.detail.value.depcode){
  wx.showToast({
    title: '请输入部门编码',
    icon: "none",
    duration: 1000
  });
  return false;
 }
 if(!e.detail.value.staffcode){
  wx.showToast({
    title: '输入操作员编号',
    icon: "none",
    duration: 1000
  });
  return false;
 }
 console.log(toastStr);
 //存回data
 var that = this;
 wx.request({
 // url: 'http://zm.superxia.com/apiwx/index.php',
  url: 'http://localhost/test/api/index.php',
  method: 'POST',
  header: { 'content-type': 'application/x-www-form-urlencoded' },
  data: {'goods': JSON.stringify(toastStr),'billno':'t'+new Date().getTime(),'orgcode':this.data.zzdm,'pccustcode':this.data.pccustcode,'depcode':e.detail.value.depcode,'date':e.detail.value.date,'time':e.detail.value.time,'staffcode':e.detail.value.staffcode,'remark':e.detail.value.remark},
  success: function (res) {
    //console.log("返回的数据如下")
    console.log(res.data.RESULT_MSG);
    wx.showToast({
      title: res.data.RESULT_MSG,
      icon: "none",
      duration: 1000
    });
     that.sum();
      that.setData({
        carts:[]
      });
  }
});
},

sum: function() {
  var carts = this.data.carts;
  // 计算总金额
  var total = 0;
  for (var i = 0; i < carts.length; i++) {
    if (carts[i].selected) {
      total += carts[i].num * carts[i].goodsPfprice*1;
    }
  }
  // 写回经点击修改后的数组
  this.setData({
    carts: carts,
    total: '¥ ' + total
  });
  app.globalData.cartData = carts;
},
  // 扫描方法
  hanleSweep: function(){
    var that = this;
    wx.scanCode({ //扫描API
      success(res) {  //扫描成功
        onlyFromCamera: true,
        console.log(res.result); //输出回调信息
        that.check(res.result)
        that.setData({
          scanCodeMsg: res.result
        });
        wx.showToast({
          title: '添加成功',
          duration: 1000
        })

      }
    })
  },
  //向后台发送数据
  check: function(data){
    var that = this;
    console.log("方法被调用");
    wx.request({
    ///url: 'http://zm.superxia.com/apiwx/check.php',
      url: 'https://tc.superxia.com/WxApi/check.php',
    //url:'http://localhost:8080/check.php',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {plucode: data},
      
      success: function (res) {
        //console.log("返回的数据如下")
        console.log(res.data);
        var stringResult = res.data.split('+');
        //console.log(stringResult);
        var goods = new Object();
        goods.goodscode = stringResult[0];
        goods.goodsName = stringResult[1];
        goods.goodsBarcode = stringResult[2];
        goods.goodsSpec = stringResult[3];
        goods.goodsUnit = stringResult[4];
        goods.goodsPfprice = stringResult[5];
        goods.scanCodeMsg = stringResult[2];
        goods.num = 1;
        var scanCodeMsg = stringResult[2];
        if(!scanCodeMsg){
          return false;
        }
        var result = that.data.carts.some(item=>{
            if(item.scanCodeMsg==scanCodeMsg){
                return true
            }
        });
       if(result){ // 如果存在
         that.data.carts.forEach((item,index)=>{
             if(item.scanCodeMsg==scanCodeMsg){
                 item.num++;
                 return true;
             }
         });
       }else{
         goods.num=1;
         that.data.carts.push(goods);
       }
       that.setData({
         carts:that.data.carts
       });
       app.globalData.cartData = that.data.carts;
       console.log(that.data.carts)
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '添加失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
// 接收前台传来的用户名称


// 数据案例
loadProductData:function(){
  var that = this;
},
bindShowMsg() {
  this.setData({
    select: !this.data.select
  })
},
/**
* 已选下拉框
*/
mySelect(e) {
  console.log(e)
  var index = e.detail.value;
  this.setData({
    grade_name: this.data.grades[index],
    zzdm:this.data.gradesArr[index],
    pccustcodeSelect:true,
    pccustcodeStrArr:this.data.pccustcodeStrArrs[index],
    pccustcodeArr:this.data.pccustcodeArrs[index],
    pccustcode:this.data.pccustcodeArrs[index][0],
    pccustcodeStr:this.data.pccustcodeStrArrs[index][0]
  })
},
bindPickerChange(e) {
  console.log(e);
  this.setData({
    pccustcode:this.data.pccustcodeArr[e.detail.value]
  })
},
setMoney:function(e){
  console.log(this.data.carts)
    console.log(e.target.dataset.index)
    this.setData({
      isShowConfirm:true,
      cardIndex:e.target.dataset.index,
      money:e.target.dataset.item.goodsPfprice
    });
},
setValue: function (e) {
  console.log(e.detail.value)
  if(e.detail.value>0){
    console.log(e.detail.value)
    this.setData({
      money: e.detail.value
    });
  }
},
cancel: function () {
  this.setData({
    isShowConfirm: false,
  })
},
confirmAcceptance:function(){
  console.log(this.data)
  var carts2 = this.data.carts;
  carts2[this.data.cardIndex].goodsPfprice=this.data.money;
  this.setData({
    carts: carts2,
    isShowConfirm: false,
  });
},
onTapUnfold:function(){
  this.setData({
    show: true
  })
},  
onTapFolding:function(){
  this.setData({
    show: false
  })
},
goOrderInput:function(){
  wx.navigateTo({
    url: '../order_input/order_input',
    success: function(res) {

    },
    fail: function(res) {
  
    },
    complete: function(res) {
  
    },
   })
},
handleSlideDelete(e) {
  console.log(e)
   var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var carts = that.data.carts;
        carts.splice(index, 1); 
        that.sum();
        that.setData({
          carts:carts
        });
}
})