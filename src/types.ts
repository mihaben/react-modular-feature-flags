export type EventListener = (flags: Flags) => void;
export type Observer = (flags?: Flags) => void;

export interface Flags {
  [key: string]: boolean;
}

export interface FeatureFlagsChannel {
  init: () => void;
  getFlags: () => Flags | Promise<Flags>;
  update: (flags: Flags) => void;
  onUpdate: (eventListener: EventListener) => void;
  eventListener?: EventListener;
}

export type ChannelFlags = {
  [key: string]: { flags: Flags; priority: number };
};
