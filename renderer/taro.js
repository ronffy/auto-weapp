const taro = ((window) => {
  const { spawn } = require('child_process');
  const fs = require('fs');
  const path = require('path');
  const taroCmd = 'taro';
  const npmCmd = 'npm';
  const devWeapp = 'dev:weapp';


  function install(params) {
    return new Promise((res, rej) => {
      try {
        console.log('s');
        
        let data = fs.readdirSync('../cpa/node_modules');
        console.log('s', data);
        
        if (data) {
          res();
          return;
        }
      } catch (error) {
        
      }
      
      let installNpm = spawn(npmCmd, ['install'], {
        cwd: path.join(__filename, '..', 'cpa')
      });
      installNpm
        .stdout
        .on('data', (chunk) => {
          // console.log('install-chunk', chunk);
        });

      installNpm
        .stderr
        .on('data', (data) => {
          console.log(`install-stderr: ${data}`);
        });

      installNpm
        .stdout
        .on('end', () => {
          console.log(`install-end`);
          res();
        })

      installNpm
        .stdout
        .on('error', err => {
          rej(err);
          console.warn('install-报错了:', err);
        })
    })
  }

  function dev(params) {
    return new Promise((res, rej) => {
      let runDev = spawn('npm', ['run', devWeapp], {
        cwd: path.join(__filename, '..', 'cpa')
      })
      runDev
        .stdout
        .on('data', (chunk) => {
          // console.log('dev-chunk', chunk);
        });

      runDev
        .stderr
        .on('data', (data) => {
          console.log(`dev-stderr: ${data}`);
        });

      runDev
        .stdout
        .on('end', () => {
          console.log(`dev-end`);
          res();
        })

      runDev
        .stdout
        .on('error', err => {
          rej(err);
          console.warn('dev-报错了:', err);
        })
    })
  }

  async function pack(params) {
    await install();
    await dev();
  }

  return {
    pack,
  }

})(window);
