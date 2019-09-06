const utils = ((window) => {
  /**
   * 字符串模版引擎
   * @param tpl 模版字符串
   * @param data 注入模版中的数据
   * @author ronffy
   */
  function strTemplate(tpl, data) {
    if (!data) {
      return tpl;
    }
    return tpl.replace(/{(.*?)}/g, (_match, key) => data[key.trim()]);
  }

  return {
    strTemplate
  }
})(window);
