const redis = require('./redis');
const Rx = require('rxjs/Rx');

function getMembersKey(channelName) {
    return `channel:${channelName.toLowerCase()}:members`;
}

function getMessagesKey(channelName) {
    return `channel:${channelName.toLowerCase()}:log`;
}

async function getMessages (channelName, before) {
    return (await redis.xrevrange(getMessagesKey(channelName), before, null, 10)).map(result => parseChannelMessages(result, channelName));
}

async function getMembers (channelName) {
    return await redis.smembers(getMembersKey(channelName));
}

async function join (channelName, userName) {
    await redis.sadd(getMembersKey(channelName), userName);
    await redis.xadd(getMessagesKey(channelName), {message: `${userName} has joined the channel.`, join: userName});
}

async function part (channelName, userName) {
    await redis.srem(getMembersKey(channelName), userName);
    await redis.xadd(getMessagesKey(channelName), {message: `${userName} has left the channel.`, part: userName});
}

async function send(channelName, userName, message) {
    return await redis.xadd(getMessagesKey(channelName), {userName, message})
}

const pollCache = {}; // storage for a shared cache of polls

function pollNewMessages (channelName) {
    if (pollCache[channelName]) return pollCache[channelName]; // use the cache

    let seenId = null; // variable to hold our position in the stream
    let key = getMessagesKey(channelName); // derive the key (i.e. channel:welcome:log)
    let connection = redis.duplicate(); // create a new connection for polling this stream

    return pollCache[channelName] = Rx.Observable.of(null) // return and cache an Observable
        .expand(() => Rx.Observable.fromPromise(connection.xread(10000, {key, id: seenId})))
        // expand calls the provided function in a loop
        // XREAD will be called on our stream key with the latest ID repeatedly
        .filter(streams => streams) // do not process empty results (i.e. time out was reached)
        .flatMap(streams => streams) // process each stream returned individually
        .flatMap(stream => stream[1]) // process each event in each stream individually
        .map(streamEvent => parseChannelMessages(streamEvent, channelName)) // parse the event
        .do(streamEvent => { // for each event
            if (streamEvent.id > seenId || !seenId) { // if it is latest seen event
                seenId = streamEvent.id; // record it as such
            }
        })
        .finally(() => { // when the stream is cleaned up
            connection.quit(); // close the redis connection
            delete pollCache[channelName]; // remove it from the cache
        })
        .publish() // wrap the observable in a shared one
        .refCount(); // track subscriptions to it so it is cleaned up automatically
}

function parseChannelMessages (streamEvent, channelName) {
    return streamEvent[1].reduce((result, value, index, array) => {
        if (index % 2 === 0) {
            if (array.length > index) {
                result[array[index]] = array[index+1];
            }
        }
        return result;
    }, {channel: channelName, id: streamEvent[0]});
}

exports.pollNewMessages = pollNewMessages;
exports.getMessages = getMessages;
exports.getMembers = getMembers;
exports.send = send;
exports.join = join;
exports.part = part;
