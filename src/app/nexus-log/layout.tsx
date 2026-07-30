import type { ReactNode } from "react";

import NexusResourcePlacementGuardV2 from "./NexusResourcePlacementGuardV2";
import NexusResources from "./NexusResources";
import "./nexus-log.css";

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
    </div>
  );
}
