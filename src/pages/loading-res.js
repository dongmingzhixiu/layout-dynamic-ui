export default {
  layout: [{
      prop: 'skin',
      label: '皮肤',
      type: 'select',
      options: [{
        label: '深色',
        value: 'dark'
      }, {
        label: '浅色',
        value: 'light'
      }]
    },
    {
      prop: 'background',
      label: '背景色',
      type: 'text'
    },
    {
      prop: 'color',
      label: '前景色',
      type: 'text'
    },
    {
      prop: 'loadingText',
      label: '提示文字',
      type: 'text',
      value: '加载中'
    }
  ]
}
