import { resolveFlags, flagsAreEqual } from "./helpers";
import {
  Source,
  Flags,
  FeatureFlagsSource,
  SourcesFlags,
  Observer,
} from "./types";

interface FeatureFlagsOptions {
  defaultFeatureFlags?: Flags;
  priorityOrder?: Source[];
  debug?: boolean;
}

export class FeatureFlags {
  private priorityOrder: Source[];
  private debug: boolean;
  private observers: Observer[];
  private sourcesFlags: SourcesFlags;
  private flags: Flags;
  private sources: {
    [key: string]: FeatureFlagsSource;
  };

  constructor() {
    // From high to low priority
    this.priorityOrder = [
      "QUERY_PARAMS",
      "COOKIES",
      "CUSTOM_EVENT",
      "REMOTE_FLAGGER",
      "DEFAULT",
    ];
    this.debug = false;
    this.observers = [];
    this.sourcesFlags = {};
    this.flags = {};

    this.sources = {};
  }

  init(options: FeatureFlagsOptions) {
    const { defaultFeatureFlags, priorityOrder, debug } = options;

    this.priorityOrder = priorityOrder || this.priorityOrder;
    this.debug = debug || this.debug;

    if (defaultFeatureFlags) {
      this.setDefaultFlags(defaultFeatureFlags);
    }
  }

  initSource = async (
    sourceType: Source,
    sourceInstance: FeatureFlagsSource
  ) => {
    this.sources[sourceType] = sourceInstance;

    sourceInstance.onUpdate((flags: Flags) => {
      this.updateFlags(sourceType, flags);
    });

    sourceInstance.init();

    const sourceFlags = await sourceInstance.getFlags();
    this.updateFlags(sourceType, sourceFlags);
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
    this.updateFlags("DEFAULT", flags);
  }

  private setSourceFlag(sourceType: Source, flags: Flags) {
    this.sourcesFlags[sourceType] = flags;
  }

  private updateFlags(sourceType: Source, flags: Flags) {
    this.setSourceFlag(sourceType, flags);
    const newFlags = resolveFlags(this.sourcesFlags, this.priorityOrder);

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
