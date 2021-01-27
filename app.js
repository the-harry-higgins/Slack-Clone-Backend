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

// const whitelist = ['http://localhost:3000']
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }

app.use(cors({origin: true}));
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
  // console.log(`${socket.id} connected`);
  socket.on('join rooms', channels => {
    channels.forEach(channel => {
      socket.join(channel, () => {
        // console.log(`${socket.id} has joined ${channel}`);
      });
      socket.on(channel, async({ user, message}) => {
        // console.log(`${channel} -- ${message} -- ${user.displayName}`);
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

  socket.on('disconnect', () => {
    // console.log(`${socket.id} disconnected`);
  });
});

module.exports = http;
