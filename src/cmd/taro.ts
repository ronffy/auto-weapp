const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

type Status = 'fulfilled' | 'rejected' | 'pending';

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

type InstallParams = {
  forceInstall?: boolean
  projectName: string
  onProcess?: OnProcess
  onEnd?: OnEnd
}

function _install({ onProcess, forceInstall, projectName }: InstallParams) {
  return new Promise((res, rej) => {
    try {
      if (!forceInstall) {
        let data = fs.readdirSync(path.join(cwd, projectName, 'node_modules'));
        if (data) {
          res();
          return;
        }
      }
    } catch (error) {
      console.log('install-本地没有 node_modules 文件');
    }

    onProcess && onProcess({
      status: 'pending',
      text: '准备下载项目依赖包...'
    });

    let installNpm = spawn('npm', ['i'], {
      cwd: path.join(cwd, projectName)
    });
    
    installNpm.stdout.on('data', () => {
      onProcess && onProcess({
        status: 'pending',
        text: '正在下载项目依赖包...'
      });
    });

    installNpm.stdout.on('end', () => {
      console.log('install-end');
      onProcess && onProcess({
        status: 'pending',
        text: '下载项目依赖包:完成'
      });
      res();
    })

    installNpm.stdout.on('error', err => {
      console.warn('install-报错了:', err);
      onProcess && onProcess({
        status: 'pending',
        text: '下载项目依赖包:失败'
      });
      rej(err);
    })

    installNpm.stderr.on('data', (data) => {
      console.log(`install-stderr: ${data}`);
    });
  })
}

type DevParams = {
  script: string
  projectName: string
  onProcess?: OnProcess
  onEnd?: OnEnd
}
function _dev({ onProcess, script, projectName }: DevParams) {
  return new Promise((res, rej) => {
    onProcess && onProcess({
      status: 'pending',
      text: '准备打包...'
    });
    let runDev;
    try {
      const [cmd, ...cmdParams] = script.split(' ');
      runDev = spawn(cmd, cmdParams, {
        cwd: path.join(cwd, projectName)
      })
    } catch (error) {
      console.warn('dev-spawn-error:', error);
      return;
    }
    runDev.stdout.on('data', () => {
      onProcess && onProcess({
        status: 'pending',
        text: '正在打包...'
      });
    });
    runDev.stdout.on('end', () => {
      console.log('dev-end');
      onProcess && onProcess({
        status: 'fulfilled',
        text: '打包:完成'
      });
      res();
    });

    runDev.stdout.on('close', () => {
      console.log('dev-close');
    })

    runDev.stdout.on('error', err => {
      console.warn('dev-报错了:', err);
      onProcess && onProcess({
        status: 'rejected',
        text: '打包:失败'
      });
      rej(err);
    })

    runDev.stderr.on('data', (data) => {
      console.log(`dev-stderr: ${data}`);
    });
  })
}

type PackParams = {
  onProcess?: OnProcess
  onEnd?: OnEnd
  forceInstall?: boolean
  script: string
  projectName: string
}
async function pack({ onProcess, forceInstall, projectName, script }: PackParams): Promise<void> {
  await _install({
    onProcess,
    forceInstall,
    projectName
  });
  await _dev({
    onProcess,
    script,
    projectName,
  });
}


export {
  pack
}