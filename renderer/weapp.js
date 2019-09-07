const weapp = ((window) => {
  const { spawn } = require('child_process');
  const fs = require('fs');
  const path = require('path');

  // cmd命令
  const wechatInstallPath = '/Applications/wechatwebdevtools.app';
  const wechatCliPath = `${wechatInstallPath}/Contents/MacOS/cli`;
  // const projectRoot = path.join(__filename, '..', 'cpa', 'dist');
  const projectRoot = '/Users/apple/Desktop/WHR/WEB/Electron/autoWeapp/cpa/dist';
  // const projectRoot = '/Users/apple/Desktop/WHR/JOB/cpaApp/dist';
  const projectVersion = '1.0.15';
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
  const uploadOutputFile = `${staticOutputPath}/${projectVersion}.json`;
  const uploadCmd = `${wechatCliPath} ${uploadCmdParam} ${projectVersion}@${projectRoot} ${uploadDescParam} '${uploadDesc}' ${uploadOutputInfoParam} ${staticOutputPath}/${projectVersion}.json`;

  function preview(callback) {
    let ls = spawn(wechatCliPath, [previewCmdParam, projectRoot, previewOutputCmd, `base64@${staticOutputPath}/${projectVersion}.txt`])

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
      console.log('previewOutputFile', previewOutputFile);
      
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

  return {
    preview,
    upload,
  }

})(window);
