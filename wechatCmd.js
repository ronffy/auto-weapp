const { spawn } = require('child_process');
const fs = require('fs');

// cmd命令
const wechatInstallPath = '/Applications/wechatwebdevtools.app';
const wechatCliPath = `${wechatInstallPath}/Contents/MacOS/cli`;
const projectRoot = '/Users/apple/Desktop/WHR/JOB/cpaApp/dist';
const projectVersion = '1.0.7';


// 预览
const previewCmdParam = '-p';
const previewOutputCmd = '--preview-qr-output';
const previewOutputFile = `${__dirname}/txt/${projectVersion}.txt`;
const previewCmd = `${wechatCliPath} ${previewCmdParam} ${projectRoot} ${previewOutputCmd} base64@${previewOutputFile}`;


// 上传
const uploadCmdParam = '-u';
const uploadDescParam = '--upload-desc';
const uploadDesc = '测试自动上传功能';
const preBase64 = 'data:image/png;base64,';
const uploadCmd = `${wechatCliPath} ${uploadCmdParam} ${projectVersion}@${projectRoot} ${uploadDescParam} '${uploadDesc}'`;


console.log('previewCmd', previewCmd);


module.exports = function run(callback) {
	// exec(previewCmd, (err, stdout, stderr) => {
	// 	if (err) {
	// 		console.error('err:', err);
	// 		return;
	// 	}
	// 	console.log('stdout:', stdout);
	// });

	let ls = spawn(wechatCliPath, [previewCmdParam, projectRoot, projectRoot, previewOutputCmd, `base64@${previewOutputFile}`])
	ls.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
		fs.readFile(previewOutputFile, 'utf8', (err, data) => {
			console.log(data);
			callback(data);
		})
	});
}

