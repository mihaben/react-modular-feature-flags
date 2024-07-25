import featureFlags, { CookiesChannel, useFeatureFlag } from "../../dist";

enum Flags {
  default = "default",
  foo = "foo",
  bar = "bar",
  baz = "baz",
}

// Initialize the feature flags
featureFlags.init({
  defaultFeatureFlags: { [Flags.default]: true },
});

// Initialize the cookies channel
featureFlags.initChannel({ priority: 1 }, new CookiesChannel(window));

function App() {
  return (
    <div>
      <h1>Feature Flags</h1>
      <pre>
        <ul>
          <ItemFlag flagKey={Flags.default} />
          <ItemFlag flagKey={Flags.foo} />
          <ItemFlag flagKey={Flags.bar} />
          <ItemFlag flagKey={Flags.baz} />
        </ul>
      </pre>
    </div>
  );
}

function ItemFlag({ flagKey }: { flagKey: string }) {
  const flagValue = useFeatureFlag(flagKey);

  return (
    <li>
      Flag <b>{flagKey}</b>: {flagValue?.toString()}
    </li>
  );
}

export default App;
