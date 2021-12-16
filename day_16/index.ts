export module Day_16 {
  const fs = require('fs');

  const input: string[] = fs
    .readFileSync('./day_16/input.txt', 'utf8')
    .split('\r\n');

  interface Packet {
    type: PacketType;
    version: number;
    value: number;
    size: number;
    packets: string;
  }

  enum PacketType {
    SUM = 0,
    PRODUCT = 1,
    MIN = 2,
    MAX = 3,
    LITERAL = 4,
    GREATER = 5,
    LESS = 6,
    EQUAL = 7,
  }

  const [hex] = input;

  const binarise = (hex: string) =>
    hex
      .split('')
      .map((c) => parseInt(c, 16).toString(2).padStart(4, '0'))
      .join('');

  const debinarise = (binary: string) => parseInt(binary, 2);

  const processLiteral = (packet: Packet): Packet => {
    let [prefix, literal] = ['', ''];
    for (let i = 0; prefix !== '0'; i += 5, packet.size += 5) {
      prefix = packet.packets[i];
      literal += packet.packets.slice(i + 1, i + 5);
    }

    return { ...packet, value: debinarise(literal) };
  };

  const processSubpackets = (packet: Packet): Packet => {
    const typeId = parseInt(packet.packets.slice(0, 1));
    const bits = (typeId === 0 ? 15 : 11) + 1;
    const subpackets = debinarise(packet.packets.slice(1, bits));

    packet.size += bits;
    packet.packets = packet.packets.slice(
      bits,
      typeId === 0 ? bits + subpackets : undefined
    );
    let remainingSubpackets = typeId === 0 ? Infinity : subpackets;

    while (remainingSubpackets-- && packet.packets) {
      const subpacket = process(packet.packets);
      packet.packets = packet.packets.slice(subpacket.size);
      packet.version += subpacket.version;
      packet.size += subpacket.size;

      if (packet.value === null) {
        packet.value = subpacket.value;
      } else {
        switch (packet.type) {
          case PacketType.SUM:
            packet.value += subpacket.value;
            break;
          case PacketType.PRODUCT:
            packet.value *= subpacket.value;
            break;
          case PacketType.MIN:
            packet.value = Math.min(packet.value, subpacket.value);
            break;
          case PacketType.MAX:
            packet.value = Math.max(packet.value, subpacket.value);
            break;
          case PacketType.GREATER:
            packet.value = packet.value > subpacket.value ? 1 : 0;
            break;
          case PacketType.LESS:
            packet.value = packet.value < subpacket.value ? 1 : 0;
            break;
          case PacketType.EQUAL:
            packet.value = packet.value === subpacket.value ? 1 : 0;
            break;
          default:
            packet.value = 0;
        }
      }
    }

    return packet;
  };

  const process = (binary: string): Packet => {
    const version = debinarise(binary.slice(0, 3));
    const type = debinarise(binary.slice(3, 6));

    const packet = {
      type,
      version,
      value: null,
      size: 6,
      packets: binary.slice(6),
    };

    return type === PacketType.LITERAL
      ? processLiteral(packet)
      : processSubpackets(packet);
  };

  /**
   * PART 1
   */
  const Part1 = () => {
    const packets = process(binarise(hex));
    console.log(
      `The sum of version numbers of all packets is: ${packets.version}`
    );
  };

  Part1();

  /**
   * PART 2
   */
  const Part2 = () => {
    const packets = process(binarise(hex));
    console.log(
      `Evaluating all expressions in the BITS transmission gives: ${packets.value}`
    );
  };

  Part2();
}
