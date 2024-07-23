export type EventListener = (flags: Flags) => void;
export type Observer = (flags?: Flags) => void;

export type Source =
  | "QUERY_PARAMS"
  | "CUSTOM_EVENT"
  | "COOKIES"
  | "REMOTE_FLAGGER"
  | "DEFAULT";

export interface Flags {
  [key: string]: boolean;
}
export interface FeatureFlagsSource {
  init: () => void;
  getFlags: () => Flags | Promise<Flags>;
  update: (flags: Flags) => void;
  onUpdate: (eventListener: EventListener) => void;
  eventListener?: EventListener;
}

export type SourcesFlags = {
  [key in Source]?: Flags;
};
