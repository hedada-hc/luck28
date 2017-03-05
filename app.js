const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let win

function createWindow(){
	win = new BrowserWindow({
		width:800,
		height:700
	})
	win.loadURL(`file://${__dirname}/index.html`)
	win.webContents.openDevTools()

}

app.on('ready',createWindow)
app.on('window-all-colsed',()=>{
	app.quit()
})