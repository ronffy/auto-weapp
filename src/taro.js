const taro = ((window) => {
  const { spawn } = require('child_process');
  const fs = require('fs');
  const path = require('path');
  const npmCmd = 'npm';
  const devWeapp = 'dev:weapp';
  const projectName = 'cpa';


  function _install({ onProcess, install } = {}) {
    return new Promise((res, rej) => {
      try {
        if (!install) {
          let data = fs.readdirSync(path.join(__filename, '..', projectName, 'node_modules'));
          if (data) {
            res();
            return;
          }
        }
      } catch (error) {
        console.log('install-本地没有 node_modules 文件');
      }

      onProcess && onProcess({
        status: 'padding',
        text: '准备下载项目依赖包...'
      });

      let installNpm = spawn(npmCmd, ['install'], {
        cwd: path.join(__filename, '..', 'cpa')
      });
      installNpm.stdout.on('data', (chunk) => {
        onProcess && onProcess({
          status: 'padding',
          text: '正在下载项目依赖包...'
        });
      });

      installNpm.stdout.on('end', () => {
        console.log(`install-end`);
        onProcess && onProcess({
          status: 'padding',
          text: '下载项目依赖包:完成'
        });
        res();
      })

      installNpm.stdout.on('error', err => {
        console.warn('install-报错了:', err);
        onProcess && onProcess({
          status: 'padding',
          text: '下载项目依赖包:失败'
        });
        rej(err);
      })
    })
  }

  function _dev({ onProcess } = {}) {
    return new Promise((res, rej) => {
      onProcess && onProcess({
        status: 'padding',
        text: '准备打包...'
      });

      let runDev = spawn(npmCmd, ['run', devWeapp], {
        cwd: path.join(__filename, '..', 'cpa')
      })
      runDev.stdout.on('data', (t) => {
        onProcess && onProcess({
          status: 'padding',
          text: '正在打包...'
        });
      });
      runDev.stdout.on('end', () => {
        console.log(`dev-end`);
        onProcess && onProcess({
          status: 'fulfilled',
          text: '打包:完成'
        });
        res();
      });

      runDev.stdout.on('close', () => {
        console.log(`dev-close`);
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

  async function pack(params) {
    await _install(params);
    await _dev(params);
  }

  return {
    pack,
  }

})(window);
