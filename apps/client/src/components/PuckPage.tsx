import { Render } from "@puckeditor/core/rsc";
import { config, type PuckData } from "@church/puck-config";

/// Puck's headless renderer. Astro renders this on the server with no
/// `client:*` directive, so the browser receives HTML and no JavaScript.
export default function PuckPage({ data }: { data: PuckData }) {
  return <Render<typeof config> config={config} data={data} />;
}
