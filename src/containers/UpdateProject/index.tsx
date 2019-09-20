
import React from 'react';
import classNames from 'classnames';
import Button from '../../components/Button';
import Label from '../../components/Label';
import Checkbox from '../../components/Checkbox';
import Input from '../../components/Input';
import { pull } from '../../cmd/git';
import { pack } from '../../cmd/taro';
import styles from './UpdateProject.less';

type State = Readonly<{
  gitAddress: string
  branch: string
  enableTaro: boolean
  taroScript: string
}>

export default class UpdateProject extends React.PureComponent<any, State> {
  state: State = {
    gitAddress: localStorage.getItem('gitAddress') || '',
    branch: localStorage.getItem('branch') || 'master',
    enableTaro: localStorage.getItem('enableTaro') === 'true',
    taroScript: localStorage.getItem('taroScript') || 'npm run dev:weapp',
  }
  handleChangeProject = (e) => {
    const value = e.target.value;
    this.setState({
      gitAddress: value
    })
  }

  handleChangeTaroScript = (e) => {
    const value = e.target.value;
    this.setState({
      taroScript: value
    })
  }

  handleChangeBranch = (e) => {
    const value = e.target.value;
    this.setState({
      branch: value
    })
  }

  handleChangeEnableTaro = (e) => {
    const checked = e.target.checked;
    this.setState({
      enableTaro: checked,
    })
  }

  handleTaroBuild = () => {

  }

  handleUpdateProject = () => {
    const { gitAddress, branch, enableTaro, taroScript } = this.state;

    if (!gitAddress || !branch) {
      return;
    }

    if (enableTaro && !taroScript) {
      return;
    }



    pull({
      gitAddress,
      branch,
      onProcess({ text, status }) {
        if (status === 'padding') {

        } else {

        }
      },
      onEnd(status) {
          // 将项目地址、分支名称、是否使用taro，都存入缓存
        localStorage.setItem('gitAddress', gitAddress);
        localStorage.setItem('branch', branch);

        if (status === 'fulfilled' && enableTaro) {

          localStorage.setItem('taroScript', taroScript);
          localStorage.setItem('enableTaro', `${enableTaro}`);

          // taro 压缩
          console.log('taro 压缩', taroScript);
          const projectName = getProjectName(gitAddress);





          // runtime 
          // polyfill 
          // 区别？？？？？？？？？




          pack({
            projectName,
            script: taroScript,
            onProcess({ text, status }) {
              if (status === 'padding') {

              } else {

              }
            },
          });
        }
      }

    })
  }

  render() {
    const { gitAddress, branch, enableTaro, taroScript } = this.state;
    return (
      <div>
        <Label placeholder="请输入项目地址">
          项目地址:
          <Input
            className={classNames(styles['input-item'], styles['ml-15'])}
            value={gitAddress}
            onChange={this.handleChangeProject}
          />
        </Label>
        <Label placeholder="请输入分支名称">
          分支名称:
          <Input
            className={classNames(styles['input-item'], styles['ml-15'])}
            value={branch}
            onChange={this.handleChangeBranch}
          />
        </Label>
        <Label>
          使用Taro:
          <Checkbox
            className={classNames(styles['ml-15'])}
            checked={enableTaro}
            onChange={this.handleChangeEnableTaro}
          />
          {
            enableTaro
              ? (
                <Input
                  className={classNames(styles['ml-15'])}
                  style={{ width: '50%' }}
                  value={taroScript}
                  onChange={this.handleChangeTaroScript}
                />
              )
              : null
          }
        </Label>
        <Label >
          <Button
            theme="primary"
            onClick={this.handleUpdateProject}
          >
            更新小程序
            </Button>
        </Label>

      </div>
    )
  }
}


function getProjectName(gitAddress: string) {
  const arr = gitAddress.split('/');
  const names = arr[arr.length - 1].split('.');
  return names[0];
}
