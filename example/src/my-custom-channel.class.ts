import { BaseChannel, FeatureFlagsChannel, Flags } from "../../dist";

interface MyCustomChannelProps {
  key: string;
  delay: number;
}

export default class MyCustomChannel
  extends BaseChannel
  implements FeatureFlagsChannel
{
  key: string;
  delay: number;
  flags: Flags;

  constructor(props: MyCustomChannelProps) {
    super();
    this.key = props.key;
    this.delay = props.delay;
    this.flags = {};
  }

  init() {
    setTimeout(() => {
      this.flags = {
        ...this.flags,
        [this.key]: true,
      };
      this.update(this.flags);
    }, this.delay);
  }

  getFlags() {
    return this.flags;
  }
}
