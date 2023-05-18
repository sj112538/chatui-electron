#!/usr/bin/env node
const express = require('express');
const app = express();
const pty = require("node-pty");
const path = require('path');
const fs = require('fs').promises;
require('express-ws')(app);
const diskUsage = require('diskUsage')
const cors = require('cors');
const os = require('os')
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // 解析 JSON 格式的请求体
app.use(cors());
app.get('/getDisk', (req, res) => {
  const disk_info = [];
  const partitions = getPartitions();
  partitions.forEach(partition => {
    const partition_info = {
      '类型': '磁盘',
      '路径': partition + '\\'
    };
    try {
      const partition_usage = diskUsage.checkSync(partition);
      partition_info['总容量'] = (partition_usage.total / (1024 ** 3)).toFixed(2) + ' GB';
      partition_info['已使用容量'] = ((partition_usage.total - partition_usage.free) / (1024 ** 3)).toFixed(2) + ' GB';
      partition_info['可用容量'] = (partition_usage.free / (1024 ** 3)).toFixed(2) + ' GB';
      partition_info['使用率'] = ((1 - partition_usage.free / partition_usage.total) * 100).toFixed(2) + '%';
    } catch (err) {
      // Ignore
    }
    if (partition_info['总容量']) {
      disk_info.push(partition_info);
    }
  });
  res.json({ data: disk_info, status: 200, msg: '获取成功' });
});

function getPartitions() {
  const partitions = [];
  if (os.platform() === 'win32') {
    for (let i = 67; i < 91; i++) {
      const partition = String.fromCharCode(i) + ':';
      partitions.push(partition);
    }
  } else {
    partitions.push('/');
  }
  return partitions;
}
// 实现 getFiles 方法
app.post('/getfiles', async (req, res) => {
  const result = { 'data': [], 'status': 200, 'msg': '' };
  try {
    const folder_path = path.normalize(req.body.path);
    const files = await fs.readdir(folder_path);
    for (const file of files) {
      const file_path = path.join(folder_path, file);
      const stat = await fs.stat(file_path);
      const dir_info = {
        '名称': file,
        '路径': file_path,
        '大小': stat.size,
        '创建时间': stat.birthtime.toLocaleString(),
        '修改时间': stat.mtime.toLocaleString(),
        '类型': stat.isDirectory() ? '文件夹' : '文件'
      };
      const file_ext = path.extname(file).toLowerCase();
      if (file_ext === '.jpg' || file_ext === '.png' || file_ext === '.gif') { // 如果是图片文件
        const data = await fs.readFile(file_path, { encoding: 'base64' }); // 读取图片数据并转换为base64格式
        dir_info['data'] = data; // 将base64格式的图片数据保存到dir_info中
      }
      result['data'].push(dir_info);
    }
    result['msg'] = '获取成功';
    result['status'] = 200
    res.json(result);
  } catch (err) {
    result['status'] = 200;
    result['msg'] = err.message;
    res.status(200).json(result);
  }
});

app.ws("/cmd", (ws, req) => {
  const term = pty.spawn('cmd.exe', [], {
    name: "xterm",
    cols: 50,
    rows: 24,
    cwd: process.env.HOME,
    env: process.env,
  });
  term.on("data", function (data) {
    ws.send(data);
  });
  ws.on("message", (data) => {
    const json = JSON.parse(data)
    if (json.Op === 'resize') {
      term.resize(json.Cols, json.Rows)
      return
    }
    term.write(json.Data);
  });
});

const { WebClient } = require('@slack/web-api');
app.post('/getChannel', async (req, res) => {
  let result;
  try {
    const web = new WebClient(req.body.token);
    result = await web.conversations.list();
  } catch (err) {
    return res.json({ err })
  }
  return res.json({ result: result })
})
app.post('/getMembers', async (req, res) => {
  let result;
  try {
    const web = new WebClient(req.body.token);
    result = await web.conversations.members({
      channel: req.body.channel
    });
  } catch (err) {
    return res.json({ err })
  }
  return res.json({ result: result })
})
app.post('/postMessage', async (req, res) => {
  let result;
  try {
    const web = new WebClient(req.body.token);
    result = await web.chat.postMessage({
      text: req.body.message,
      channel: req.body.channel
    })
  } catch (err) {
    return res.json({ err })
  }
  return res.json({ result: result })
})

let token
app.post('/history', async (req, res) => {
  let result
  token = req.body.token
  const channel = req.body.channel
  try {
    const web = new WebClient(token);
    result = await web.conversations.history({ channel: channel });
  } catch (err) {
    return res.json({ err })
  }
  return res.json({ result: result })
})

app.post('/test', async (req, res) => {
  let result
  const token = req.body.token
  try {
    const web = new WebClient(token);
    result = await web.api.test()
  } catch (err) {
    return res.json({ err })
  }
  return res.json({ result: result })
})


app.ws("/slackWs", async (ws, req) => {
  try {
    const { App, LogLevel } = require("@slack/bolt");
    const app = new App({
      token: token,
      signingSecret: "e9a3b764ffda573205ca55e41c1ef482",
      logLevel: LogLevel.DEBUG
    });
    app.message(':wave', async ({ message, say }) => {
      ws.send(JSON.stringify(message));
    })
    const result = await app.client.rtm.start()
    ws.send(JSON.stringify(result));
  } catch (err) {
    ws.send(JSON.stringify(err));
  }
});

const args = process.argv.slice(2);
app.listen(args[0]);
