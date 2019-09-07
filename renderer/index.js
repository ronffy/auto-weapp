
const strTemplate = utils.strTemplate;
const preBase64 = 'data:image/png;base64,';

window.onload = () => {


  // 拉取代码
  document.getElementById('btn-pullbranch').addEventListener('click', () => {
    git.pull();
  });

  // 打包
  document.getElementById('btn-dev').addEventListener('click', () => {
    taro.pack();
  })


  // 预览事件
  document.getElementById('btn-preview').addEventListener('click', () => {
    weapp.preview(data => setInfoContainer(`<img src="${preBase64 + data}" alt="小程序预览二维码">`));
  });

  // 上传事件
  document.getElementById('btn-upload').addEventListener('click', () => {
    weapp.upload(data => {
      if (!data) {
        return;
      }
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      setInfoContainer(getUploadInfoHtml(data.size))
    });
  });
  

}


const getUploadInfoHtml = (() => {
  const liTempl = `<li><p>{name} 体积: {size}</p></li>`;
  const totalTempl = `<p><span>包体积: </span><span>{total}</span><span>KB</span></p>`;

  return function ({packages, total}) {
    let lisHtml = '';
    let ulHtml = '';
    let totalHtml = '';
    packages.forEach(package => {
      // const { name, size } = package;
      lisHtml += strTemplate(liTempl, package);
    });
    if (!lisHtml) {
      return '';
    }
    ulHtml = `<ul>${lisHtml}</ul>`;
    totalHtml = strTemplate(totalTempl, { total });
    return totalHtml + ulHtml;
  }
})();


function setInfoContainer(html) {
  document.getElementById('info-container').innerHTML = html;
}




