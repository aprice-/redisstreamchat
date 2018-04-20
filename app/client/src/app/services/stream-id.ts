export class StreamId {
  constructor (private timestamp = 0, private seq = 0) {
  }

  static parse (id: string) {
    let parts = id.split("-");
    let timestamp = +parts[0];
    let seq = +parts[1];

    return new StreamId(timestamp, seq);
  }

  increment () {
    let timestamp = this.timestamp;
    let seq = this.seq;
    seq++;

    return new StreamId(timestamp, seq);
  }

  decrement () {
    let timestamp = this.timestamp;
    let seq = this.seq;

    if (seq === 0) {
      timestamp--;
      seq = 9999;
    } else {
      seq--;
    }

    return new StreamId(timestamp, seq);
  }

  toString() {
    return `${this.timestamp}-${this.seq}`;
  }
}
