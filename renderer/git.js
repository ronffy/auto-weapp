const git = ((window) => {
  const { spawn } = require('child_process');
  const fs = require('fs');
  const path = require('path');

  const gitCmd = 'git';
  const pullParam = 'pull';
  const remoteParam = 'origin';
  const branch = 'master';
  const projectName = 'cpa';

  const gitLogin = function ({ onProcess } = {}) {
    return new Promise(res => {
      let i = 0;
      onProcess && onProcess({
        status: 'padding',
        text: '准备配置git...'
      });

      const gitConfigUNSpawn = spawn('git', ['config', 'user.name', 'wanghairong']);
      
      gitConfigUNSpawn
        .stdout
        .on('end', () => {
          console.log('配置 name 完成');
          onProcess && onProcess({
            status: 'padding',
            text: 'git配置name完成'
          });
          if (++i === 2) {
            res();
          }
        })

      const gitConfigUESpawn = spawn('git', ['config', 'user.email', 'wanghairong@sunlands.com'])
      gitConfigUESpawn
        .stdout
        .on('end', () => {
          console.log('配置 email 完成');
          onProcess && onProcess({
            status: 'padding',
            text: 'git配置email完成'
          });
          if (++i === 2) {
            res();
          }
        })

    })
  }

  function gitClone({ onProcess } = {}) {
    return new Promise((res, rej) => {
      onProcess && onProcess({
        status: 'padding',
        text: '准备 clone git 项目...'
      });

      const clone = spawn('git', ['clone', 'https://git.sunlands.wang/fe-team/cpa.git'])

      clone
        .stdout
        .on('data', (chunk) => {
          // console.log('chunk', chunk);
          onProcess && onProcess({
            status: 'padding',
            text: '正在 clone git 项目...'
          });
        });

      clone
        .stderr
        .on('data', (data) => {
          console.log(`stderr: ${data}`);
        });

      clone
        .stdout
        .on('end', () => {
          onProcess && onProcess({
            status: 'padding',
            text: 'git clone:完成'
          });
          console.log(`clone 完成`);
          res();
        })

      clone
        .stdout
        .on('error', err => {
          onProcess && onProcess({
            status: 'padding',
            text: 'git clone:失败'
          });
          rej(err);
          console.warn('clone 失败，err:', err);
        })
    })
  }

  function gitPull({ onProcess } = {}) {
    return new Promise((res, rej) => {
      onProcess && onProcess({
        status: 'padding',
        text: '准备 pull git 项目...'
      });

      let ls = spawn(gitCmd, [pullParam, remoteParam, branch])

      let spawning = false;
      ls.stdout.on('data', () => {
        onProcess && onProcess({
          status: 'padding',
          text: '正在 pull git 项目...'
        });

        if (!spawning) {
          spawning = true;
          console.log('拉取代码:拉取中...');
        }
      });

      ls.stdout.on('end', () => {
        spawning = false;
        console.log(`拉取代码:完成`);

        onProcess && onProcess({
          status: 'fulfilled',
          text: 'git pull:完成'
        });

        res();
      });

      ls.stdout.on('close', () => {
        spawning = false;
        console.log(`拉取代码:关闭`);
      });

      ls.stdout.on('error', (err) => {
        spawning = false;
        console.log(`拉取代码:失败,err:`, err);
        onProcess && onProcess({
          status: 'rejected',
          text: 'git pull:失败'
        });
        rej(err);
      });
    })
  }

  function pull(params) {
    return new Promise((res, rej) => {
      fs.readdir(path.join(__filename, '..', projectName), async (err, data) => {
        try {
          if (err || !data) {
            await gitLogin(params);
            await gitClone(params);
          } else {
            await gitPull(params);
          }
          res();
        } catch (error) {
          rej(error)
        }
      });
    })
  }

  return {
    pull,
  }

})(window);
