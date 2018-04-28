const Redis = require('ioredis');

Redis.prototype.xread = function (block, ...streams) {
    if (streams.length === 0) {
        throw 'streams required';
    }

    let args = ['XREAD', 'BLOCK', block, 'STREAMS'];

    streams.forEach(stream => args.push(stream.key));
    streams.forEach(stream => args.push(stream.id ? stream.id : '$'));

    return this.send_command(...args);
};

Redis.prototype.xadd = function (key, value, id = null, maxlen = null, maxlenApprox = false) {
    let args = ['XADD', key];

    if (maxlen) {
        args.push('MAXLEN');
        if (maxlenApprox) {
            args.push('~')
        }
        args.push(maxlen);
    }

    args.push(id ? id : '*');

    for (let valueKey of Object.keys(value)) {
        args.push(...[valueKey, value[valueKey]])
    }
    return redis.send_command(...args);
};

Redis.prototype.xrange = function (key, start = null, end = null, count = null) {
    let args = ['XRANGE', key, start || '-', end || '+'];

    if (count) {
        args.push(...['COUNT', count]);
    }

    return redis.send_command(...args);
};

Redis.prototype.xrevrange = function (key, end = null, start = null, count = null) {
    let args = ['XREVRANGE', key, end || '+', start || '-'];

    if (count) {
        args.push(...['COUNT', count]);
    }

    return redis.send_command(...args);
};

function splitCommaDelimitedAddresses(addresses) {
    return addresses.split(',').map((address) => ({ host: address.split(':')[0], port: +address.split(':')[1] }));
}

let addresses = splitCommaDelimitedAddresses(process.env.REDIS);

let redis;
if (addresses.length > 1) {
    redis = new Redis.Cluster(addresses);
} else if (addresses.length === 1) {
    redis = new Redis(addresses[0]);
} else {
    throw 'REDIS required.';
}

module.exports = redis;
