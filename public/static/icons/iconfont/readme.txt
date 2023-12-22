F12在控制台上
var span = document.querySelectorAll('.icon-cover');
for (var i = 0, len = span.length; i < len; i++) {
     console.log(span[i].querySelector('span').click());
}

//修改font-family 为icon
@font-face {
  font-family: "icon"; /* Project id  */
  src: url('iconfont.ttf?t=1657956674216') format('truetype');
}
//注意这里样式类名也要修改为icon
.icon {
  font-family: "icon" !important;
  font-size: 12px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}