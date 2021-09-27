new Vue({
  el: '#app',
  data () {
    return {
      active: '2',
      showBlur: false,
      count: 30,
      height: 30,
      blur: 10,
      mouseStartX: 0,
      mouseStartY: 0,
      boxStartTop: 100,
      boxStartLeft: 100
    }
  },
  computed: {
    style () {
      return {
        top: this.boxStartTop + 'px',
        left: this.boxStartLeft + 'px'
      }
    }
  },
  methods: {
    open () {
      this.$alert('你好👋', '提示')
    },
    onDragstart ({ clientX, clientY, target }) {
      this.mouseStartX = clientX
      this.mouseStartY = clientY
      this.boxStartTop = target.offsetTop
      this.boxStartLeft = target.offsetLeft
    },
    onDrag ({ clientX, clientY, target }) {
      const absX = clientX - this.mouseStartX
      const absY = clientY - this.mouseStartY
      if (clientX > 0) {
        this.boxStartTop = this.boxStartTop + absY
        this.boxStartLeft = this.boxStartLeft + absX
        this.mouseStartX = clientX
        this.mouseStartY = clientY
      }
    },
    onDragend ({ target }) {
      this.boxStartTop = target.offsetTop
      this.boxStartLeft = target.offsetLeft
    }
  }
})
