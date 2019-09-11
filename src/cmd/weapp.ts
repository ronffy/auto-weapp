const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

type Status = 'fulfilled' | 'rejected' | 'padding';

type ProcessParams = {
  status: Status
  text: string
}
type OnProcess = {
  (params: ProcessParams): void
}
type OnEnd = {
  (status: Status): void
}

// cmd命令
const wechatInstallPath = '/Applications/wechatwebdevtools.app';
const wechatCliPath = `${wechatInstallPath}/Contents/MacOS/cli`;

type PreviewParams = {
  projectName: string
  version: string
  onProcess?: OnProcess
  onEnd?: OnEnd
}
function preview({ onProcess, onEnd, projectName, version }: PreviewParams): void {
  onProcess && onProcess({
    status: 'padding',
    text: '准备获取微信小程序预览文件...'
  });

  const projectRoot = path.join(cwd, projectName, 'dist');
  const staticOutputPath = path.join(cwd, projectName);

  // 预览
  const previewCmdParam = '-p';
  const previewOutputCmd = '--preview-qr-output';
  const previewOutputFile = `${staticOutputPath}/${version}.txt`;

  let ls = spawn(wechatCliPath, [previewCmdParam, projectRoot, previewOutputCmd, `base64@${staticOutputPath}/${version}.txt`])

  let spawning = false;
  ls.stdout.on('data', () => {
    if (!spawning) {
      spawning = true;
      console.log('获取小程序预览文件:获取中...');
      onProcess && onProcess({
        status: 'padding',
        text: '正在获取微信小程序预览文件...'
      });
    }
  });

  ls.stdout.on('end', () => {
    spawning = false;
    console.log('获取小程序预览文件:完成');
    onProcess && onProcess({
      status: 'fulfilled',
      text: '获取小程序预览文件:完成'
    });

    // 读取生成到本地的txt文件，将内容输出
    console.log('previewOutputFile', previewOutputFile);

    if (onEnd) {
      fs.readFile(previewOutputFile, 'utf8', (err, data) => {
        if (err || !data) {
          return;
        }
        onEnd(data);
      })
    }

  });

  ls.stdout.on('close', () => {
    spawning = false;
    console.log('获取小程序预览文件:关闭');
  });

  ls.stdout.on('error', (err) => {
    spawning = false;
    console.log('获取小程序预览文件:失败,err:', err);
    onProcess && onProcess({
      status: 'rejected',
      text: '获取小程序预览文件:失败'
    });
  });
}

type UploadParams = {
  projectName: string
  desc: string
  version: string
  onProcess?: OnProcess
  onEnd?: OnEnd
}
function upload({ onProcess, onEnd, projectName, desc, version }: UploadParams): void {
  onProcess && onProcess({
    status: 'padding',
    text: '准备上传小程序代码...'
  });

  const projectRoot = path.join(cwd, projectName, 'dist');
  const staticOutputPath = path.join(cwd, projectName);

  // 上传
  const uploadCmdParam = '-u';
  const uploadDescParam = '--upload-desc';
  const uploadOutputInfoParam = '--upload-info-output';
  const uploadOutputFile = `${staticOutputPath}/${version}.json`;

  let ls = spawn(wechatCliPath, [uploadCmdParam, `${version}@${projectRoot}`, uploadDescParam, `'${desc}'`, uploadOutputInfoParam, uploadOutputFile])

  let spawning = false;
  ls.stdout.on('data', () => {
    if (!spawning) {
      spawning = true;
      console.log('上传小程序代码:上传中...');
      onProcess && onProcess({
        status: 'padding',
        text: '正在上传小程序代码...'
      });
    }
  });

  ls.stdout.on('end', () => {
    spawning = false;
    console.log('上传小程序代码:完成');
    onProcess && onProcess({
      status: 'padding',
      text: '上传小程序代码:完成'
    });

    if (onEnd) {
      fs.readFile(uploadOutputFile, 'utf8', (err, data) => {
        onProcess && onProcess({
          status: 'fulfilled',
          text: '获取小程序包信息:完成'
        });

        if (err || !data) {
          console.log(`读取小程序信息文件:失败,uploadOutputFile:${uploadOutputFile}`);
          return;
        }
        onEnd(data);
      })
    }
  });

  ls.stdout.on('close', () => {
    spawning = false;
    console.log('上传小程序代码:关闭');
  });

  ls.stdout.on('error', (err) => {
    spawning = false;
    console.log('上传小程序代码:失败,err:', err);
    onProcess && onProcess({
      status: 'rejected',
      text: '上传小程序代码:失败'
    });
  });

}


export {
  preview,
  upload,
}
