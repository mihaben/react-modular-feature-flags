import featureFlags, { useFeatureFlag } from "../../dist";

featureFlags.init({
  defaultFeatureFlags: { test: true },
});

function App() {
  const test = useFeatureFlag("test");
  return (
    <div>
      <pre>
        <b>flag "test":</b> {test.toString()}
      </pre>
    </div>
  );
}

export default App;
