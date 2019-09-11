const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const gitCmd = 'git';
const pullParam = 'pull';
const remoteParam = 'origin';
let _branch = 'master';
let projectName;

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

type GitCloneParams = {
  gitAddress: string
  onProcess?: OnProcess
  onEnd?: OnEnd
}
function gitClone({ onProcess, onEnd, gitAddress }: GitCloneParams): Promise<void> {
  return new Promise((res, rej) => {
    onProcess && onProcess({
      status: 'padding',
      text: '准备 clone git 项目...'
    });

    const clone = spawn('git', ['clone', gitAddress]);

    clone
      .stdout
      .on('data', () => {
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
        console.log('clone 完成');
        onProcess && onProcess({
          status: 'fulfilled',
          text: 'git clone:完成'
        });
        onEnd && onEnd('fulfilled');
        res();
      })

    clone
      .stdout
      .on('error', err => {
        console.warn('clone 失败，err:', err);
        onProcess && onProcess({
          status: 'padding',
          text: 'git clone:失败'
        });
        onEnd && onEnd('rejected');

        rej(err);
      })
  })
}

type GitPullParams = {
  branch: string
  onProcess?: OnProcess
  onEnd?: OnEnd
}
function gitPull({ onProcess, onEnd, branch }: GitPullParams): Promise<void> {
  return new Promise((res, rej) => {
    onProcess && onProcess({
      status: 'padding',
      text: '准备 pull git 项目...'
    });
    _branch = branch;

    let ls = spawn(gitCmd, [pullParam, remoteParam, _branch])

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
      console.log('拉取代码:完成');

      onProcess && onProcess({
        status: 'fulfilled',
        text: 'git pull:完成'
      });
      onEnd && onEnd('fulfilled');

      res();
    });

    ls.stdout.on('close', () => {
      spawning = false;
      console.log('拉取代码:关闭');
    });

    ls.stdout.on('error', (err) => {
      spawning = false;
      console.log('拉取代码:失败,err:', err);
      onProcess && onProcess({
        status: 'rejected',
        text: 'git pull:失败'
      });
      onEnd && onEnd('rejected');

      rej(err);
    });
  })
}

type PullParams = {
  onProcess?: OnProcess
  onEnd?: OnEnd
  gitAddress: string
  branch: string
}
const pull = ({
  onProcess,
  onEnd,
  gitAddress,
  branch,
}: PullParams): Promise<void> => new Promise((res, rej) => {

  projectName = getProjectName(gitAddress);

  fs.readdir(path.join(__filename, '..', projectName), async (err, data) => {
    try {
      if (err || !data) {
        await gitClone({
          gitAddress,
          onProcess,
          onEnd,
        });
      } else {
        await gitPull({
          branch,
          onProcess,
          onEnd,
        });
      }
      res();
    } catch (error) {
      rej(error)
    }
  });
})

function getProjectName(gitAddress: string) {
  const arr = gitAddress.split('/');
  const names = arr[arr.length - 1].split('.');
  return names[names.length - 1];
}


export {
  pull
}
