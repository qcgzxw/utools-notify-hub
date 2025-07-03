const BarkChannel = require('./BarkChannel.js');
const NotifyMeChannel = require('./NotifyMeChannel.js');
const INotifyChannel = require('./INotifyChannel.js');

const createChannels = function(cfg) {
  const channels = {};
  if (! cfg) return channels;

  if (cfg.channels.bark && cfg.channels.bark.enabled) channels.bark = new BarkChannel(cfg.channels.bark);
  if (cfg.channels.notifyme && cfg.channels.notifyme.enabled) channels.notifyme = new NotifyMeChannel(cfg.channels.notifyme);
  if (cfg.channels.inotify && cfg.channels.inotify.enabled) channels.inotify = new INotifyChannel(cfg.channels.inotify);

  return channels;
}
module.exports = {
  createChannels,
  BarkChannel,
  NotifyMeChannel,
  INotifyChannel
}
