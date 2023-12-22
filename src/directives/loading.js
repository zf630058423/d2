/**
 * 自定义指令v-loading
 * 元素或者组件模块加v-loading="true"现在加载提示
 */

import loadingUrl from "@/assets/loading.svg";
import styles from './loading.model.scss';

function createLoadingImg() { 
  const img = document.createElement('img');
  img.dataset.role = 'loading';
  img.src = loadingUrl;  //loading地址
  img.className = styles.loading;  //loading样式
  img.zIndex = 10000;
  return img;
}

function getLoadingImg() {
  return el.querySelector('img[data-role=loading]');
 }

//第一种写法
export default function (el, binding) { 
  //根据binding.value的值，决定创建或删除img元素
  const curImg = getLoadingImg(el);
  if (binding.value) {
    //创建元素
    if (!curImg) {
      const img = createLoadingImg();
      el.appendChild(img);
    }
  } else { 
    //删除img元素
    if (curImg) { 
      curImg.remove();
    }
  }
}

// //导出指令配置对象 第二种写法
// export default {
  
//   bind(el, binding) {
//     //el 绑定元素的真实dom
//     //binding 是一个对象， 描述了指令中提供的信息
    
//     console.log("bind");
//   },
//   inserted() {
      //用于插入元素 只调用一次
//     console.log('inserted');
//   },
//   updated() {
//     console.log('updated');
//   }
// }