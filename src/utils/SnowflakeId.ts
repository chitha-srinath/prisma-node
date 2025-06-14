export class SnowflakeId {
  private static instance: SnowflakeId;
  private sequence: number = 0;
  private lastTimestamp: number = -1;
  private readonly workerId: number;
  private readonly datacenterId: number;

  // Snowflake ID structure (64 bits):
  // 1 bit (unused) | 41 bits (timestamp) | 10 bits (workerId + datacenterId) | 12 bits (sequence)
  private readonly workerIdBits: number = 5;
  private readonly datacenterIdBits: number = 5;
  private readonly sequenceBits: number = 12;

  private readonly maxWorkerId: number = -1 ^ (-1 << this.workerIdBits);
  private readonly maxDatacenterId: number = -1 ^ (-1 << this.datacenterIdBits);
  private readonly maxSequence: number = -1 ^ (-1 << this.sequenceBits);

  private readonly workerIdShift: number = this.sequenceBits;
  private readonly datacenterIdShift: number = this.sequenceBits + this.workerIdBits;
  private readonly timestampLeftShift: number =
    this.sequenceBits + this.workerIdBits + this.datacenterIdBits;

  private readonly epoch: number = 1288834974657; // January 1, 2010

  private constructor(workerId: number = 1, datacenterId: number = 1) {
    if (workerId > this.maxWorkerId || workerId < 0) {
      throw new Error(`Worker ID can't be greater than ${this.maxWorkerId} or less than 0`);
    }
    if (datacenterId > this.maxDatacenterId || datacenterId < 0) {
      throw new Error(`Datacenter ID can't be greater than ${this.maxDatacenterId} or less than 0`);
    }

    this.workerId = workerId;
    this.datacenterId = datacenterId;
  }

  public static getInstance(workerId?: number, datacenterId?: number): SnowflakeId {
    if (!SnowflakeId.instance) {
      SnowflakeId.instance = new SnowflakeId(workerId, datacenterId);
    }
    return SnowflakeId.instance;
  }

  private tilNextMillis(lastTimestamp: number): number {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  }

  private timeGen(): number {
    return Date.now();
  }

  public nextId(): string {
    let timestamp = this.timeGen();

    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock moved backwards. Refusing to generate id');
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & this.maxSequence;
      if (this.sequence === 0) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    const id =
      ((timestamp - this.epoch) << this.timestampLeftShift) |
      (this.datacenterId << this.datacenterIdShift) |
      (this.workerId << this.workerIdShift) |
      this.sequence;

    return id.toString();
  }
}
