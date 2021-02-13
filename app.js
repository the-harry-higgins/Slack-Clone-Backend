const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');

const routes = require('./routes');
const { Message } = require('./db/models');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const whitelist = ['http://localhost:3000', 'https://master.d3izqolo2r3a78.amplifyapp.com']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

app.use(cors(corsOptions));
app.use(helmet({ hsts: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.use(function (_req, _res, next) {
  next(createError(404));
});

app.use(function (err, _req, res, _next) {
  res.status(err.status || 500);
  if (err.status === 401) {
    res.set('WWW-Authenticate', 'Bearer');
  }
  res.json({
    message: err.message,
    error: JSON.parse(JSON.stringify(err)),
  });
});


io.on('connection', socket => {

  socket.on('notify user', ({ channel, to }) => {
    socket.to(`user ${to}`).emit('new dm channel', channel);
  });

  socket.on('join personal room', userId => {
    socket.join(`user ${userId}`);
  });

  socket.on('join rooms', channels => {

    channels.forEach(channel => {
      socket.join(channel);

      socket.on(channel, async ({ user, message }) => {
        const newMessage = await Message.create({
          userId: user.id,
          channelId: channel,
          content: message,
          pinned: false
        });

        const response = {
          id: newMessage.id,
          channelId: newMessage.channelId,
          content: newMessage.content,
          pinned: newMessage.pinned,
          createdAt: newMessage.createdAt,
          userId: newMessage.userId,
          displayName: user.displayName,
          profileImage: user.profileImage
        }

        socket.to(channel).emit(channel, response);
        socket.emit(channel, response);
      })
    });
  });

  socket.on('leave room', (channel) => {
    console.log(`${socket.id} left room ${channel}`);
    socket.leave(channel);
  })
});

module.exports = http;
