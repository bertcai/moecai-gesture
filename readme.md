# 简介

一个移动端手势库

## 使用方式

直接引入gesture.js

### 使用例子

```javascript
let touchNode = document.querySelector('.touch')
const gesture = new Gesture(touchNode)
gesture.on('tap', () => {
    console.log('tap')
})

gesture.on('doubleTap', () => {
    console.log('doubleTap')
})

gesture.on('swipe', (evt) => {
    console.log('swipe')
    console.log(evt.direction)
})
```

暂时只有三个动作

+ tap
+ doubleTap
+ swipe 新增一个direction属性，返回：

    ```javascript
    {
        hDirection:'left'|'right'
        vDirection:'bottom'|'top'
    }
    ```

## 待开发手势

+ [x] longTap
+ [] pinch/zoom
+ [] rotate
+ [] move/drag

## 已知未解决bug

+ [] 长按选中某个字符串序列后，tap改选中序列会触发swipe事件和longTap事件，而不是tap事件，暂未解决该问题
