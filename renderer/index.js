
const strTemplate = utils.strTemplate;
const preBase64 = 'data:image/png;base64,';

window.onload = () => {
  const $loading = document.getElementById('loading');

  // 拉取代码
  document.getElementById('btn-pullbranch').addEventListener('click', () => {
    $loading.style = 'z-index: 1';
    $loading.innerHTML = '准备开始拉取代码...';
    git.pull({
      onProcess({ text, status }) {
        if (status === 'padding') {
          $loading.style = 'z-index: 1';
          $loading.innerHTML = text;
        } else {
          $loading.style = 'z-index: -1';
          $loading.innerHTML = '';
        }
      }
    });
  });

  // 打包
  document.getElementById('btn-dev').addEventListener('click', () => {
    $loading.style = 'z-index: 1';
    $loading.innerHTML = '准备开始打包...';
    taro.pack({
      onProcess({ text, status }) {
        if (status === 'padding') {
          $loading.style = 'z-index: 1';
          $loading.innerHTML = text;
        } else {
          $loading.style = 'z-index: -1';
          $loading.innerHTML = '';
        }
      }
    });
  })


  // 预览事件
  document.getElementById('btn-preview').addEventListener('click', () => {
    weapp.preview({
      onProcess({ text, status }) {
        if (status === 'padding') {
          $loading.style = 'z-index: 1';
          $loading.innerHTML = text;
        } else {
          $loading.style = 'z-index: -1';
          $loading.innerHTML = '';
        }
      },
      onEnd(data) {
        setInfoContainer(`<img src="${preBase64 + data}" alt="小程序预览二维码">`)
      }
    });
  });

  // 上传事件
  document.getElementById('btn-upload').addEventListener('click', () => {
    weapp.upload({
      onProcess({ text, status }) {
        if (status === 'padding') {
          $loading.style = 'z-index: 1';
          $loading.innerHTML = text;
        } else {
          $loading.style = 'z-index: -1';
          $loading.innerHTML = '';
        }
      },
      onEnd(data) {
        if (!data) {
          return;
        }
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        setInfoContainer(getUploadInfoHtml(data.size))
      }
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




