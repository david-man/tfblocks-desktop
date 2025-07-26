# tfblocks-desktop

This is tfblocks's Desktop companion! While tfBlocks's web version is more for experimentation, tfBlocks' Desktop companion is designed for real world machine learning projects. Feel free to follow the instructions below to use it.

### Note #1

Right now, this version works on Mac, as we've used PyInstaller to bundle all the Python code together. To use on Windows or Linux, change the line 

```javascript
let backend = execFile(path.join(app.getAppPath(), 'src/main/backend'))
```

to 

```javascript
let backend = spawn('python', [path.join(app.getAppPath(), 'tfblocks-backend/main.py')])
```

Once you do that, you will need to install Python 3.12 and run 
```bash
$ pip3 install tfblocks-backend/requirements.txt
```

### Note #2
When you clone this repository, you will notice that it takes an unusually large amount of space. Most of this will be located at
```
src/main/backend
``` 
This file is a packaged version of our backend that runs all the backend logic that can be seen in `tfblocks-backend/main.py`. As our name suggests, that backend includes TensorFlow(which is extremely large)!

If you have Python 3.12 already, feel free to delete this file and perform the steps listed in the first note

## Project Setup

### Install

```bash
$ git clone https://github.com/david-man/tfblocks-desktop
$ npm install
```

### Use

```bash
$ npm run dev
```


