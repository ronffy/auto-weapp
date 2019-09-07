const git = ((window) => {
  const { spawn } = require('child_process');
  const fs = require('fs');

  const gitCmd = 'git';
  const pullParam = 'pull';
  const remoteParam = 'origin';
  const branch = 'master';
  const prejectPath = `/Users/apple/Desktop`;
  let hasGitProject = false;


  // const gitConfigUNSpawn = spawn('git', ['config', 'user.name', 'wanghairong-i']);
  // const gitConfigUESpawn = spawn('git', ['config', 'user.email', '3189578410@qq.com']);


  const gitLogin = function () {
    return new Promise(res => {
      let i = 0;
      const gitConfigUNSpawn = spawn('git', ['config', 'user.name', 'wanghairong']);
      gitConfigUNSpawn
        .stdout
        .on('end', () => {
          console.log('配置 name 完成');
          
          if (++i === 2) {
            res();
          }
        })

      const gitConfigUESpawn = spawn('git', ['config', 'user.email', 'wanghairong@sunlands.com'])
      gitConfigUESpawn
        .stdout
        .on('end', () => {
          console.log('配置 email 完成');
          if (++i === 2) {
            res();
          }
        })

    })
  }

  function gitClone(params) {
    return new Promise((res, rej) => {
      const clone = spawn('git', ['clone', 'https://git.sunlands.wang/fe-team/cpa.git'])

      clone
        .stdout
        .on('data', (chunk) => {
          console.log('chunk', chunk);
        });

      clone
        .stderr
        .on('data', (data) => {
          res();
          console.log(`stderr: ${data}`);
        });

      clone
        .stdout
        .on('end', () => {
          res();
        })

      clone
        .stdout
        .on('error', err => {
          rej(err);
          console.warn('报错了:', err);
        })
    })
  }

  function gitPull(params) {
    return new Promise((res, rej) => {
      let ls = spawn(gitCmd, [pullParam, remoteParam, branch])

      let spawning = false;
      ls.stdout.on('data', () => {
        if (!spawning) {
          spawning = true;
          console.log('拉取代码:拉取中...');
        }
      });

      ls.stdout.on('end', () => {
        spawning = false;
        console.log(`拉取代码:完成`);
        res();
        // fs.readFile(uploadOutputFile, 'utf8', (err, data) => {
        //   if (err || !data) {
        //     console.log(`读取小程序信息文件:失败,uploadOutputFile:${uploadOutputFile}`);
        //     return;
        //   }
        //   callback(data);
        // })
      });

      ls.stdout.on('close', () => {
        spawning = false;
        console.log(`拉取代码:关闭`);
      });

      ls.stdout.on('error', (err) => {
        spawning = false;
        console.log(`拉取代码:失败,err:`, err);
        rej(err);
      });
    })
  }

  async function pull() {
    try {
      let data = fs.readdirSync('../cpa');
      if (!data) {
        await gitLogin();
        await gitClone();
      }
    } catch (error) {
      await gitClone();
    }
    await gitPull();
  }

  return {
    pull,
  }

})(window);
