import featureFlags from "./feature-flags.class";

export default featureFlags;

// Channels
export { default as BaseChannel } from "./channels/base-channel.class";
export { default as CookiesChannel } from "./channels/cookies-channel.class";
export { default as CustomEventChannel } from "./channels/custom-event-channel.class";
export { default as QueryParamsClientChannel } from "./channels/query-params-client-channel.class";
export { default as ConfigcatChannel } from "./channels/configcat-channel.class";

// Hook
export { default as useFeatureFlag } from "./use-feature-flag";
