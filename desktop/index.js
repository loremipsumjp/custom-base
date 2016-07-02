'use strict';

const electron = require('electron')
const {app} = electron
const {BrowserWindow} = electron

let win

function createWindow() {
  win = new BrowserWindow({ width: 1200, height: 850 })
  win.loadURL('http://127.0.0.1:3000')
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
