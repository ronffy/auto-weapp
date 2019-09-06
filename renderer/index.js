const { spawn } = require('child_process');
const fs = require('fs');
const strTemplate = utils.strTemplate;

// cmd命令
const wechatInstallPath = '/Applications/wechatwebdevtools.app';
const wechatCliPath = `${wechatInstallPath}/Contents/MacOS/cli`;
const projectRoot = '/Users/apple/Desktop/WHR/JOB/cpaApp/dist';
const projectVersion = '1.0.9';
const staticOutputPath = `/Users/apple/Desktop`;

// 预览
const previewCmdParam = '-p';
const previewOutputCmd = '--preview-qr-output';
const previewOutputFile = `${staticOutputPath}/${projectVersion}.txt`;
const previewCmd = `${wechatCliPath} ${previewCmdParam} ${projectRoot} ${previewOutputCmd} base64@${staticOutputPath}/${projectVersion}.txt`;


// 上传
const uploadCmdParam = '-u';
const uploadDescParam = '--upload-desc';
const uploadOutputInfoParam = '--upload-info-output';
const uploadDesc = '测试自动上传功能ii';
const preBase64 = 'data:image/png;base64,';
const uploadOutputFile = `${staticOutputPath}/${projectVersion}.json`;
const uploadCmd = `${wechatCliPath} ${uploadCmdParam} ${projectVersion}@${projectRoot} ${uploadDescParam} '${uploadDesc}' ${uploadOutputInfoParam} ${staticOutputPath}/${projectVersion}.json`;

function preview(callback) {
  let ls = spawn(wechatCliPath, [previewCmdParam, projectRoot, previewOutputCmd, `base64@${previewOutputFile}`])

  let spawning = false;
  ls.stdout.on('data', () => {
    if (!spawning) {
      spawning = true;
      console.log('获取小程序预览文件:获取中...');
    }
  });

  ls.stdout.on('end', () => {
    spawning = false;
    console.log(`获取小程序预览文件:完成.`);

    // 读取生成到本地的txt文件，将内容输出
    if (callback) {
      fs.readFile(previewOutputFile, 'utf8', (err, data) => {
        if (err, !data) {
          return;
        }
        callback(data);
      })
    }
    
  });

  ls.stdout.on('close', () => {
    spawning = false;
    console.log(`获取小程序预览文件:关闭`);
  });

  ls.stdout.on('error', (err) => {
    spawning = false;
    console.log(`获取小程序预览文件:失败,err:`, err);
  });
}


function upload(callback) {
  let ls = spawn(wechatCliPath, [uploadCmdParam, `${projectVersion}@${projectRoot}`, uploadDescParam, `'${uploadDesc}'`, uploadOutputInfoParam, uploadOutputFile])

  let spawning = false;
  ls.stdout.on('data', () => {
    if (!spawning) {
      spawning = true;
      console.log('上传小程序代码:上传中...');
    }
  });

  ls.stdout.on('end', () => {
    spawning = false;
    console.log(`上传小程序代码:完成`);
    fs.readFile(uploadOutputFile, 'utf8', (err, data) => {
      if (err || !data) {
        console.log(`读取小程序信息文件:失败,uploadOutputFile:${uploadOutputFile}`);
        return;
      }
      callback(data);
    })
  });

  ls.stdout.on('close', () => {
    spawning = false;
    console.log(`上传小程序代码:关闭`);
  });

  ls.stdout.on('error', (err) => {
    spawning = false;
    console.log(`上传小程序代码:失败,err:`, err);
  });

}


window.onload = () => {

  // 预览事件
  document.getElementById('btn-preview').addEventListener('click', () => {
    preview(data => setInfoContainer(`<img src="${preBase64 + data}" alt="小程序预览二维码">`));
  });

  // 上传事件
  document.getElementById('btn-upload').addEventListener('click', () => {
    upload(data => {
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
})


function setInfoContainer(html) {
  document.getElementById('info-container').innerHTML = html;
}
