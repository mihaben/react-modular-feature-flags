import { resolveFlags, flagsAreEqual } from "./helpers";
import { Flags, FeatureFlagsChannel, ChannelFlags, Observer } from "./types";
import { v4 as uuidv4 } from "uuid";

interface FeatureFlagsOptions {
  defaultFeatureFlags?: Flags;
}

export class FeatureFlags {
  private observers: Observer[];
  private channelsFlags: ChannelFlags;
  private flags: Flags;

  constructor() {
    this.observers = [];
    this.channelsFlags = {};
    this.flags = {};
  }

  init(options: FeatureFlagsOptions) {
    const { defaultFeatureFlags } = options;

    if (defaultFeatureFlags) {
      this.setDefaultFlags(defaultFeatureFlags);
    }
  }

  initChannel = async (
    { priority }: { priority: number },
    channelInstance: FeatureFlagsChannel
  ) => {
    const key = uuidv4();

    this.initChannelFlags(key, priority);

    channelInstance.onUpdate((flags: Flags) => {
      this.updateChannelFlags(key, flags);
    });

    channelInstance.init();

    const flags = await channelInstance.getFlags();
    this.updateChannelFlags(key, flags);
  };

  subscribe(obs: Observer) {
    if (typeof obs === "function") {
      this.observers.push(obs);
    }
  }

  unsubscribe(obs: Observer) {
    this.observers = this.observers.filter((observer) => observer !== obs);
  }

  getFlags(): Flags {
    return this.flags;
  }

  getFlag(flag: string): boolean {
    return this.flags[flag];
  }

  private setDefaultFlags(flags: Flags) {
    const key = "default";
    this.initChannelFlags(key, 0);
    this.updateChannelFlags(key, flags);
  }

  private initChannelFlags(key: string, priority: number) {
    this.channelsFlags[key] = {
      flags: {},
      priority,
    };
  }

  private setChannelFlag(key: string, flags: Flags) {
    if (!this.channelsFlags[key]) return;
    this.channelsFlags[key].flags = flags;
  }

  private updateChannelFlags(key: string, flags: Flags) {
    this.setChannelFlag(key, flags);
    const newFlags = resolveFlags(this.channelsFlags);

    if (!flagsAreEqual(this.flags, newFlags)) {
      this.flags = newFlags;
      this.notifyUpdate();
    }
  }

  private notifyUpdate() {
    this.observers.forEach((obs) => obs(this.flags));
  }

  public getObservers() {
    return this.observers;
  }
}

const featureFlags = new FeatureFlags();
export default featureFlags;
