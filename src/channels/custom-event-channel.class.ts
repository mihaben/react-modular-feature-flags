import BaseChannel from "./base-channel.class";

import { FeatureFlagsChannel, Flags } from "../types";

interface CustomEventChannelProps {
  root?: Window;
  options?: EventOptions;
}

type CallBackFn = () => void;

interface EventOptions {
  eventName?: string;
  onChange?: CallBackFn;
}

interface CustomEvent extends Event {
  detail: Flags;
}

export default class CustomEventSource
  extends BaseChannel
  implements FeatureFlagsChannel
{
  root: Window;
  flags: Flags;
  eventName: string;
  onChange?: CallBackFn;

  constructor(props?: CustomEventChannelProps) {
    super();
    this.root = props?.root || window;
    this.eventName = props?.options?.eventName || "flags:update";
    this.onChange = props?.options?.onChange;
    this.flags = {};
  }

  init() {
    this.root.addEventListener(this.eventName, (e: Event) => {
      const { detail } = e as CustomEvent;

      this.flags = {
        ...this.flags,
        ...detail,
      };

      this.update(this.flags);

      if (this.onChange) {
        this.onChange();
      }
    });
  }

  getFlags() {
    return this.flags;
  }
}
