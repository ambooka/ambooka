import type { ReactNode } from "react";

import NexusPracticeResources from "./NexusPracticeResources";
import NexusResourceMediaRestorer from "./NexusResourceMediaRestorer";
import NexusResourcePlacementGuardV2 from "./NexusResourcePlacementGuardV2";
import NexusResources from "./NexusResources";
import "./resources/audit";
import "./nexus-log.css";
import "./nexus-practice.css";

export default function NexusLogLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div id="nexus-log-shell">
      <div className="nexus-log-route">{children}</div>
      <NexusResources />
      <NexusResourcePlacementGuardV2 />
      <NexusResourceMediaRestorer />
      <NexusPracticeResources />
    </div>
  );
}
