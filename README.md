# react-modular-feature-flags

<br>
<div align="center">
    <picture>
        <img alt="react-modular-feature-flags" width="480px" src="./public/react-modular-feature-flags-logo.svg" />
    </picture>
    <p align="center">Modular feature flags management for modern React apps</p>

</div>
<br>

## Table of contents

- [About](#about)
- [Installation](#installation)
- [FeatureFlags API](#featureflags-api)
- [Channels](#channels)
  - [Cookies](#cookies)
  - [Query Params](#query-params)
  - [Custom event](#custom-event)
  - [Configcat](#configcat)
  - [Custom channel](#custom-channel)

## About

`react-modular-feature-flags` is a powerful library designed to manage the state of feature flags in your React applications. This library allows seamless integration of multiple channels to activate and deactivate feature flags, providing a highly flexible and modular approach to feature management.

Key features include:

- **Singleton Class:** Ensures a single source of truth for all your feature flags.
- **Multiple Channels:** Connect various channels such as query params, custom events, cookies, remote flaggers, and more to control feature flags.
- **State Resolution:** Automatically resolves the state of each feature flag by processing inputs from different channels based on their priority.
- **Custom Channels:** Create and integrate your custom channels to manage feature flags as per your unique requirements.
- **Real-Time Access:** Access the current state of any feature flag at any moment using our hook `useFeatureFlag`.
- **TypeScript Support:** Fully typed with TypeScript for enhanced developer experience and code safety.

![Diagram](./public/react-modular-feature-flags%20diagram.svg)

> [!TIP]  
> You can see our sample project [here](/example/src/App.tsx).

## Installation

```bash
#Yarn
yarn add react-modular-feature-flags

#NPM
npm install react-modular-feature-flags
```

Once the package is installed, you can import the library in your app.

```js
import featureFlags from "react-modular-feature-flags";
```

Initialize the library. You can set default flags at this point:

```js
featureFlags.init({
  defaultFeatureFlags: { foo: true },
});
```

Next you must add the different channels you want to support. You can add as many channels as you need.

```js
featureFlags.initChannel({ priority: 1 }, new MyChannel());
```

> [!TIP]
> Learn more about the [available channels](#channels) or how to [create your own custom channel](#custom-channel).

Finally, you can access the value of the feature flag within your components using the following `hook`:

```js
const flagValue = useFeatureFlag("foo");
```

## FeatureFlags API

### Methods

| Prop          | Type                                                 | Description                                                                                  |
| ------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `init`        | `({defaultProps?: Record<string, boolean>}) => void` | Initializes the library                                                                      |
| `initChannel` | `({priority: number}, Channel) => void`              | Initializes a channel with a specific priority. Higher priorities overwrite lower priorities |
| `getFlags`    | `() => Record<string, boolean>`                      | Returns the value of all computed flags                                                      |
| `getFlag`     | `(flag:String) => boolean`                           | Returns the value of a specific flag                                                         |

## Channels

> A channel is a mechanism through which feature flags can be activated or deactivated. Each channel listens to specific sources and communicates the state of these flags to the library. Channels allow for dynamic and flexible control over feature flags, ensuring that the application's features can be toggled based on various contexts and conditions.

### Cookies

> [!NOTE]  
> The Cookies channel leverages browser cookies to store and retrieve feature flag states. This is particularly useful for maintaining feature state across different sessions and ensuring a consistent user experience.

**How to trigger?**

```js
document.cookie = "featureFlags=bar,foo=false,baz";
```

**API**

| Prop   | Type     | Required | Default value  | Description                |
| ------ | -------- | -------- | -------------- | -------------------------- |
| `key`  | `string` | `false`  | `featureFlags` | Sets the key of the cookie |
| `root` | `Window` | `false`  | `window`       | Sets the global object     |

### Query Params

> [!NOTE]  
> The Query Params channel enables you to control feature flags through URL parameters. By appending specific parameters to the URL, you can easily toggle features for debugging or testing purposes without altering the codebase.

**How to trigger?**

```
my-website.com?featureFlags=bar,foo=false,baz
```

**API**

| Prop   | Type     | Required | Default value  | Description                     |
| ------ | -------- | -------- | -------------- | ------------------------------- |
| `key`  | `string` | `false`  | `featureFlags` | Sets the key of the query param |
| `root` | `Window` | `false`  | `window`       | Sets the global object          |

### Custom event

> [!NOTE]  
> The Custom Events channel allows feature flags to be controlled via events dispatched within your application. This provides a dynamic way to manage feature states based on user interactions or other custom triggers.

**How to trigger?**

```js
window.dispatchEvent(
  new CustomEvent("flags:update", {
    detail: { bar: true, baz: true, foo: false },
  })
);
```

**API**

| Prop      | Type           | Required | Default value | Description                   |
| --------- | -------------- | -------- | ------------- | ----------------------------- |
| `options` | `EventOptions` | `false`  | -             | Sets the options of the event |
| `root`    | `Window`       | `false`  | `window`      | Sets the global object        |

#### EventOptions

| Prop        | Type         | Required | Default value  | Description                             |
| ----------- | ------------ | -------- | -------------- | --------------------------------------- |
| `eventName` | `string`     | `false`  | `flags:update` | Sets the key of the event               |
| `onChange`  | `() => void` | `false`  | -              | Callback invoked when event is executed |

### Configcat

> [!NOTE]  
> The ConfigCat channel integrates with the [ConfigCat service](https://configcat.com/) to manage feature flags remotely. This channel allows you to update feature flags in real-time from a centralized dashboard, offering a powerful way to control feature rollout across different environments and user segments.

| Prop        | Type        | Required | Default value | Description       |
| ----------- | ----------- | -------- | ------------- | ----------------- |
| `configCat` | `ConfigCat` | `true`   | -             | ConfigCat library |
| `options`   | `Options`   | `true`   | -             | Sets the options  |

#### Options

| Prop                  | Type                      | Required | Default value | Description                      |
| --------------------- | ------------------------- | -------- | ------------- | -------------------------------- |
| `SDKKey`              | `string`                  | `true`   | -             | SDKKey of your ConfigCat project |
| `defaultFlags`        | `Record<string, boolean>` | `false`  | `{}`          | Default feature flags            |
| `pollIntervalSeconds` | `number`                  | `false`  | `150`         | Polling interval                 |

### Custom channel

> [!NOTE]  
> If you need to, you can create your own custom channels connected to the services your project requires.
>
> In this simple example we create a channel that turns on a flag when passing a specific number of ms.

```ts
// my-custom-channel.class.ts

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
```

```tsx
// App.ts

...

featureFlags.initChannel({ priority: 1 }, new MyCustomChannel({key:"bar", delay: 2000}));
```
