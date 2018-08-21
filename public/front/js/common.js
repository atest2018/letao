// 对页面中所有的区域滚动进行初始化
mui('.mui-scroll-wrapper').scroll({
  indicators: false, // 是否显示滚动条
  deceleration: 0.0005 // 阻尼系数, 系数越小, 越灵敏
});


// 配置轮播图自动轮播
// 获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
  interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
});
