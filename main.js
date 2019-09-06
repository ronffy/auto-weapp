const electron = require('electron')
// const run = require('./wechatCmd');

// electron.app负责管理Electron 应用程序的生命周期， electron.BrowserWindow类负责创建窗口
const { app, BrowserWindow } = electron;

function createWindow(params) {
	// 创建浏览器窗口
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		center: true,
		title: '自动预览、提交小程序',
		webPreferences: {
			nodeIntegrationInWorker: true,
			nodeIntegration: true,
		},
		type: 'textured',
		
	});

	// 加载应用的 html
	win.loadFile('index.html');

	// 打开开发者工具
	win.webContents.openDevTools();


	win.on('close', () => {
		win = null;
	})

	win.webContents.on('did-finish-load', () => {

		// setTimeout(() => {
		// 	run(data => {

		// 	});
		// }, 2000);

		
		win.webContents.send('ping', 'whoooooooh!')
	});

	

}


// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	// if (mainWindow === null) createWindow()
})


app.on('ready', createWindow)
