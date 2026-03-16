import { NavbarComp } from "@/components/navbar";

export default function StudyShell({ children }) {
  return (
    <div className="grass-world">
      <NavbarComp />
      <div className="pixel-trees" />
      <div className="poke-container main-content">
        {children}
      </div>
    </div>
  );
}
