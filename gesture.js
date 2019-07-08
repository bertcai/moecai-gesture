// HGesture = (function () {

//     const map = new Map()
//     map.set(dom1, fn)
//     map.set(dom2, fn2)

//     return {
//         on: on,
//         off: off
//     }
// })



class Gesture {
    constructor(touchNode) {
        this.node = touchNode
        this.handlers = {
            tap: [],
            doubleTap: [],
            longTap: [],
            swipe: [],
            touchstart: [],
            touchend: [],
            touchmove: []
        }
        this.delta = null
        this.last = null
        this.now = null
        this.x1 = null
        this.y1 = null
        this.x2 = null
        this.y2 = null
        this.bind()
        this.preTapPosition = {}
        this.isDoubleTap = null
        this.tapTimeout = null
        this.longTapTimeout = null
    }

    bind() {
        this.node.addEventListener('touchend', evt => {
            this.dispatch('touchend', evt)
            if ((this.x2 && Math.abs(this.x1 - this.x2) > 30) || (this.y2 && Math.abs(this.y1 - this.y2) > 30)) {
                let direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2)
                evt.direction = direction
                this.dispatch('swipe', evt)
                return
            }
            if (!this.isDoubleTap) {
                let _that = this
                this.tapTimeout = setTimeout(function (evt) {
                    _that.dispatch('tap', evt)
                }, 300, evt)
            }
            if (this.isDoubleTap) {
                this.dispatch('doubleTap', evt)
                this.isDoubleTap = false
            }
            if (this.longTapTimeout && Date.now() - this.last < 800) {
                clearTimeout(this.longTapTimeout)
            }
        })
        this.node.ontouchmove = (evt) => {
            this.dispatch('touchmove', evt)
            this.x2 = evt.touches[0].pageX
            this.y2 = evt.touches[0].pageY
            if (this.longTapTimeout) {
                clearTimeout(this.longTapTimeout)
            }
        }
        this.node.addEventListener('touchstart', evt => {
            this.dispatch('touchstart', evt)
            this.x1 = evt.touches[0].pageX
            this.y1 = evt.touches[0].pageY
            this.now = Date.now()
            this.delta = this.last ? this.now - this.last : 0
            if (this.preTapPosition !== null) {
                this.isDoubleTap = (this.delta > 0 && this.delta <= 300 && Math.abs(this.x1 - this.preTapPosition.x) < 30 && Math.abs(this.y1 - this.preTapPosition.y) < 30)
                if (this.isDoubleTap) {
                    clearTimeout(this.tapTimeout)
                }
            }
            this.preTapPosition.x = this.x1
            this.preTapPosition.y = this.y1
            this.last = this.now
            let _that = this
            this.longTapTimeout = setTimeout(function (evt) {
                _that.dispatch('longTap', evt)
            }, 800, evt)
        })
    }

    _swipeDirection(x1, x2, y1, y2) {
        let x = x1 - x2 > 0 ? 'left' : 'right'
        let y = y1 - y2 > 0 ? 'bottom' : 'top'
        let path = `(${x1},${y1})->(${x2},${y2})`
        return {
            hDirection: x,
            vDirection: y,
            path: path
        }
    }

    dispatch(eventType, evt) {
        this.handlers[eventType].forEach(handler => handler.call(this.node, evt))
    }

    on(eventType, handler) {
        this.handlers[eventType].push(handler)
    }
}

// eg
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

gesture.on('longTap', (evt) => {
    console.log('longTap')
})