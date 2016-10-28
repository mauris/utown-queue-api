const child_process = require('child_process');

//child_process.fork('src/daemon/waitingTimeUpdater.js');
//child_process.fork('src/daemon/groupMatcher.js');
//child_process.fork('src/daemon/eventCodeChanger.js');
//child_process.fork('src/daemon/eventQueueReminder.js');
child_process.fork('src/daemon/thankMessageSender.js');
