import featureFlags, {
  CookiesChannel,
  QueryParamsClientChannel,
  CustomEventChannel,
  useFeatureFlag,
} from "../../dist";

import Logo from "./assets/logo.svg?react";

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
featureFlags.initChannel({ priority: 1 }, new CookiesChannel());

// Initialize the query params client channel
featureFlags.initChannel({ priority: 2 }, new QueryParamsClientChannel());

// Initialize the custom event channel
featureFlags.initChannel({ priority: 3 }, new CustomEventChannel());

function App() {
  return (
    <div className="container mx-auto">
      <div className="py-12 w-2/5">
        <h1>
          <Logo />
        </h1>
      </div>
      <Alert />
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Feature Flag Key
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <ItemFlag flagKey={Flags.default} />
            <ItemFlag flagKey={Flags.foo} />
            <ItemFlag flagKey={Flags.bar} />
            <ItemFlag flagKey={Flags.baz} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ItemFlag({ flagKey }: { flagKey: string }) {
  const flagValue = useFeatureFlag(flagKey);

  return (
    <tr>
      <th scope="col" className="px-6 py-3">
        {flagKey}
      </th>
      <th scope="col" className="px-6 py-3">
        {flagValue ? <BadgeActive /> : <BadgeInactive />}
      </th>
    </tr>
  );
}

function BadgeActive() {
  return (
    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
      Active
    </span>
  );
}

function BadgeInactive() {
  return (
    <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
      Inactive
    </span>
  );
}

function Alert() {
  return (
    <div
      className="flex items-center p-4 mb-4 text-sm text-sky-800 rounded-lg bg-sky-50"
      role="alert"
    >
      <svg
        className="flex-shrink-0 inline w-4 h-4 me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div>
        Access the{" "}
        <a href="#as" className="underline underline-offset-4">
          documentation
        </a>{" "}
        to learn how to enable and disable feature flags.
      </div>
    </div>
  );
}

export default App;
