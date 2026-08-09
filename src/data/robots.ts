import cobotImg from "@/assets/robots/cr-05e-cobot.png";
import air4Img from "@/assets/robots/air4-560-grey.png";
import scaraImg from "@/assets/robots/kla700-scara.png";
import zdft1215Img from "@/assets/robots/zdft1215.png";
import zdgt2518Img from "@/assets/robots/zdgt2518.png";
import zdfx0808Img from "@/assets/robots/zdfx0808.png";
import amrImg from "@/assets/robots/amr-300.png";

export interface Robot {
  id: string;
  model: string;
  name: string;
  series: "AIR Series" | "CS Series" | "AMR Series" | "SCARA Series";
  tagline: string;
  axes: string;
  payload: string;
  reach: string;
  repeatability: string;
  description: string;
  longDescription: string;
  applications: string[];
  specs: { label: string; value: string }[];
  workingRange: { label: string; value: string }[];
  image: string | null;
  featured: boolean;
}

export const robots: Robot[] = [
  {
    id: "air4-560",
    model: "AIR4-560",
    name: "AIR4-560 Compact 6-Axis Robot",
    series: "AIR Series",
    tagline: "High-speed 6-axis for 3C & small-part work",
    axes: "6-Axis",
    payload: "4 kg",
    reach: "560 mm",
    repeatability: "±0.02 mm",
    description:
      "Compact 6-axis industrial robot engineered for the 3C industry — assembly, handling, screwing and testing of small workpieces.",
    longDescription:
      "The AIR4-560 is a compact 6-axis robot built for high-speed, high-precision operations in the 3C industry. Standard cycle time under 0.33 s, IP67 wrist protection and floor/wall/ceiling mounting let it drop into tight cells for assembly, screwing, handling and inspection. It ships pre-integrated with our own inCube20 controller.",
    applications: ["3C Assembly & Testing", "High-Speed Handling", "Screwing", "Precision Inspection"],
    specs: [
      { label: "Axes", value: "6" },
      { label: "Payload", value: "4 kg" },
      { label: "Max Reach", value: "560 mm" },
      { label: "Repeatability", value: "±0.02 mm" },
      { label: "Robot Weight", value: "≈ 23 kg" },
      { label: "Standard Cycle Time", value: "< 0.33 s" },
      { label: "Mounting", value: "Floor / Wall / Ceiling" },
      { label: "Protection", value: "IP65 (IP67 optional)" },
      { label: "Controller", value: "inCube20 (in-house)" },
    ],
    workingRange: [
      { label: "J1 — Base rotation", value: "−170° … +170°" },
      { label: "J2 — Shoulder", value: "−110° … +120°" },
      { label: "J3 — Elbow", value: "−108° … +152°" },
      { label: "J4 — Wrist roll", value: "−200° … +200°" },
      { label: "J5 — Wrist pitch", value: "−118° … +118°" },
      { label: "J6 — Tool rotation", value: "−350° … +350°" },
    ],
    image: air4Img,
    featured: true,
  },
  {
    id: "zdfx0808",
    model: "AIR6-0808",
    name: "AIR6-0808 Compact General-Purpose Robot",
    series: "AIR Series",
    tagline: "Small footprint. Big work envelope.",
    axes: "6-Axis",
    payload: "8 kg",
    reach: "827 mm",
    repeatability: "±0.05 mm",
    description:
      "Compact 6-axis robot for machine tending, pick-and-place, packaging and light assembly where floor space is tight.",
    longDescription:
      "The AIR6-0808 is our compact general-purpose 6-axis platform — 8 kg payload in an 827 mm reach and only 42 kg body weight. IP65-rated, floor or ceiling mount, and small 200 × 300 mm base make it easy to drop into existing cells for CNC tending, pick-and-place, packaging and light assembly.",
    applications: ["CNC Tending", "Pick & Place", "Packaging", "Light Assembly"],
    specs: [
      { label: "Axes", value: "6" },
      { label: "Payload", value: "8 kg" },
      { label: "Max Reach", value: "827 mm" },
      { label: "Repeatability", value: "±0.05 mm" },
      { label: "Robot Weight", value: "≈ 42 kg" },
      { label: "Base Size", value: "200 × 300 mm" },
      { label: "Mounting", value: "Floor / Ceiling" },
      { label: "Protection", value: "IP65" },
      { label: "Controller", value: "Texsonics RC series (in-house)" },
    ],
    workingRange: [
      { label: "J1 — Base rotation", value: "±170°" },
      { label: "J2 — Shoulder", value: "−145° … +80°" },
      { label: "J3 — Elbow", value: "−70° … +180°" },
      { label: "J4 — Wrist roll", value: "±180°" },
      { label: "J5 — Wrist pitch", value: "±130°" },
      { label: "J6 — Tool rotation", value: "±360°" },
    ],
    image: zdfx0808Img,
    featured: true,
  },
  {
    id: "zdft1215",
    model: "AIR6-1215",
    name: "AIR6-1215 General Purpose Robot",
    series: "AIR Series",
    tagline: "The 12 kg cell partner with 1.46 m reach",
    axes: "6-Axis",
    payload: "12 kg",
    reach: "1463 mm",
    repeatability: "±0.05 mm",
    description:
      "Versatile 6-axis robot for CNC machine tending, loading/unloading, assembly and material handling with extended reach.",
    longDescription:
      "The AIR6-1215 pairs a 12 kg payload with a wide 1463 mm activity radius, covering complex motion paths inside compact production layouts. Floor or ceiling mount, IP54 body with IP65 wrist, and our own controller keep integration simple across CNC tending, assembly and material handling cells.",
    applications: ["CNC Machine Tending", "Loading / Unloading", "Assembly", "Material Handling", "Gluing & Dispensing"],
    specs: [
      { label: "Axes", value: "6" },
      { label: "Payload", value: "12 kg" },
      { label: "Max Reach", value: "1463 mm" },
      { label: "Repeatability", value: "±0.05 mm" },
      { label: "Robot Weight", value: "≈ 116 kg" },
      { label: "Base Size", value: "290 × 300 mm" },
      { label: "Mounting", value: "Floor / Ceiling" },
      { label: "Protection", value: "IP54 body / IP65 wrist" },
      { label: "Controller", value: "Texsonics RC series (in-house)" },
    ],
    workingRange: [
      { label: "J1 — Base rotation", value: "±180°" },
      { label: "J2 — Shoulder", value: "−125° … +90°" },
      { label: "J3 — Elbow", value: "−84° … +205°" },
      { label: "J4 — Wrist roll", value: "±170°" },
      { label: "J5 — Wrist pitch", value: "−150° … +116°" },
      { label: "J6 — Tool rotation", value: "±360°" },
    ],
    image: zdft1215Img,
    featured: true,
  },
  {
    id: "zdgt2518",
    model: "AIR6-2518",
    name: "AIR6-2518 Heavy Payload Robot",
    series: "AIR Series",
    tagline: "25 kg payload. 1.8 m reach.",
    axes: "6-Axis",
    payload: "25 kg",
    reach: "1808 mm",
    repeatability: "±0.08 mm",
    description:
      "Heavy-payload 6-axis robot for palletizing, press tending, foundry handling and large-part transfer.",
    longDescription:
      "The AIR6-2518 is our heavy-payload platform for palletizing, foundry and stamping automation, press-to-press transfer and large-part handling. A rigid cast structure and high-torque drives deliver dependable cycle times at 25 kg with a 1808 mm envelope — at a price point imported brands can't match, with local support they can't offer.",
    applications: ["Palletizing", "Press / Stamping Tending", "Foundry & Die Casting", "Large Part Handling"],
    specs: [
      { label: "Axes", value: "6" },
      { label: "Payload", value: "25 kg" },
      { label: "Max Reach", value: "1808 mm" },
      { label: "Repeatability", value: "±0.08 mm" },
      { label: "Robot Weight", value: "≈ 191 kg" },
      { label: "Base Size", value: "300 × 420 mm" },
      { label: "Mounting", value: "Floor / Ceiling" },
      { label: "Protection", value: "IP54 body / IP67 wrist" },
      { label: "Controller", value: "Texsonics RC series (in-house)" },
    ],
    workingRange: [
      { label: "J1 — Base rotation", value: "±180°" },
      { label: "J2 — Shoulder", value: "−125° … +90°" },
      { label: "J3 — Elbow", value: "−77° … +202°" },
      { label: "J4 — Wrist roll", value: "±180°" },
      { label: "J5 — Wrist pitch", value: "±125°" },
      { label: "J6 — Tool rotation", value: "±360°" },
    ],
    image: zdgt2518Img,
    featured: true,
  },
  {
    id: "kla700-scara",
    model: "KLA700-6N",
    name: "KLA700-6N SCARA Robot",
    series: "SCARA Series",
    tagline: "4-axis SCARA — 0.44 s cycle, 6 kg payload",
    axes: "4-Axis SCARA",
    payload: "6 kg",
    reach: "700 mm",
    repeatability: "±0.02 mm (XY)",
    description:
      "High-throughput 4-axis SCARA for assembly, loading/unloading, sorting, inspection and dispensing on flat workplanes.",
    longDescription:
      "The KLA700-6N is a horizontal-multi-joint SCARA robot built for repetitive planar work — assembly, part loading, sorting, inspection and dispensing. 6 kg payload, 700 mm arm reach, 200 mm Z stroke and a fast 0.44 s standard cycle, in a compact 24 kg body. Integrated pneumatic and signal harness through the arm keeps end-effector tooling clean and repeatable.",
    applications: ["Assembly", "Loading / Unloading", "Sorting", "Inspection", "Dispensing"],
    specs: [
      { label: "Axes", value: "4 (SCARA)" },
      { label: "Payload", value: "6 kg" },
      { label: "Arm Length", value: "700 mm" },
      { label: "Z Stroke", value: "200 mm" },
      { label: "Standard Cycle", value: "0.44 s" },
      { label: "Body Weight", value: "24 kg" },
      { label: "Signals", value: "15 pin D-Sub (13-return cable)" },
      { label: "Pneumatics", value: "1 × ⌀6 + 2 × ⌀6 (0.59 MPa)" },
      { label: "Harness Length", value: "3 m" },
      { label: "Protection", value: "IP20" },
      { label: "Environment", value: "0–40 °C, 35–85 % RH" },
    ],
    workingRange: [
      { label: "A-axis (inner arm)", value: "±140°" },
      { label: "B-axis (outer arm)", value: "±145°" },
      { label: "Z-axis (vertical stroke)", value: "200 mm" },
      { label: "W-axis (tool rotation)", value: "±360°" },
      { label: "A/B max speed", value: "8700 mm/s" },
      { label: "Z max speed", value: "1100 mm/s" },
      { label: "W max speed", value: "2000°/s" },
      { label: "Repeatability — A/B", value: "±0.02 mm" },
      { label: "Repeatability — Z", value: "±0.01 mm" },
      { label: "Repeatability — W", value: "±0.01°" },
    ],
    image: scaraImg,
    featured: true,
  },
  {
    id: "cr-05e-cobot",
    model: "CR-05E",
    name: "CR-05E Collaborative Robot",
    series: "CS Series",
    tagline: "Works with people, not behind fences",
    axes: "6-Axis",
    payload: "5 kg",
    reach: "800 mm",
    repeatability: "±0.03 mm",
    description:
      "Collaborative 6-axis cobot with harmonic-drive joints and hand-guided teaching — deployable in days, not months.",
    longDescription:
      "The CR-05E collaborative robot brings automation to workspaces shared with people. Harmonic-drive joints (Laifual Drive-based), hand-guided teaching and safety-rated monitored stop let it run fence-free machine tending, assembly, testing and packaging cells. A compact 1052 mm build height and 138 × 138 mm base make it easy to place beside operators on existing benches.",
    applications: ["Fence-free Machine Tending", "Assembly", "Testing & Inspection", "Packaging"],
    specs: [
      { label: "Axes", value: "6" },
      { label: "Payload", value: "5 kg" },
      { label: "Max Reach", value: "800 mm" },
      { label: "Repeatability", value: "±0.03 mm" },
      { label: "Joints", value: "Harmonic drive, force-limited" },
      { label: "Height", value: "1052 mm" },
      { label: "Base Size", value: "138 × 138 mm" },
      { label: "Teaching", value: "Hand guiding + teach pendant" },
      { label: "Safety", value: "Collaborative operation per ISO/TS 15066 design intent" },
      { label: "Programming", value: "Graphical HMI / Offline CAM" },
    ],
    workingRange: [
      { label: "J1 — Base rotation", value: "±170°" },
      { label: "J2 — Shoulder", value: "±170°" },
      { label: "J3 — Elbow", value: "±160°" },
      { label: "J4 — Wrist 1", value: "±170°" },
      { label: "J5 — Wrist 2", value: "±170°" },
      { label: "J6 — Tool rotation", value: "±175°" },
    ],
    image: cobotImg,
    featured: true,
  },
  {
    id: "amr-300",
    model: "AMR-300",
    name: "AMR-300 Autonomous Mobile Robot / AGV",
    series: "AMR Series",
    tagline: "Intralogistics that drives itself",
    axes: "Autonomous",
    payload: "300 kg",
    reach: "Fleet-wide",
    repeatability: "±10 mm docking",
    description:
      "AGV / AMR platform that moves material between stations, warehouses and lines with LiDAR-based natural navigation.",
    longDescription:
      "The AMR-300 moves material between stations, stores and production lines without operators, tracks, or magnetic tape. LiDAR-based natural navigation maps your plant as-is, the fleet manager dispatches jobs from your ERP or MES, and roller-top or lift-top modules match your load units. Dual safety LiDAR plus bumpers keep it safe around people and forklifts.",
    applications: ["Line-side Delivery", "Warehouse Transfer", "WIP Movement", "Finished Goods Transport"],
    specs: [
      { label: "Type", value: "AGV / Autonomous Mobile Robot" },
      { label: "Payload", value: "300 kg" },
      { label: "Navigation", value: "Natural navigation (LiDAR SLAM)" },
      { label: "Docking Accuracy", value: "±10 mm" },
      { label: "Top Modules", value: "Roller-top / Lift-top / Custom" },
      { label: "Fleet Management", value: "Texsonics fleet manager, ERP/MES integration" },
      { label: "Charging", value: "Opportunity charging, auto-dock" },
      { label: "Safety", value: "Dual safety LiDAR + bumpers" },
    ],
    workingRange: [
      { label: "Travel speed", value: "≤ 1.5 m/s" },
      { label: "Runtime", value: "~8 h per charge" },
      { label: "Min aisle width", value: "900 mm" },
      { label: "Gradeability", value: "≤ 5% incline" },
      { label: "Turning footprint", value: "Turns in place (differential drive)" },
    ],
    image: amrImg,
    featured: true,
  },
];

export const applications = [
  "Pick & Place",
  "Machine Tending",
  "CNC Loading / Unloading",
  "Palletizing",
  "Welding",
  "Spray Painting",
  "Assembly",
  "Packaging",
  "Material Handling",
  "Vision Inspection",
];

export const industries = [
  "Automotive",
  "Foundries",
  "Sheet Metal",
  "CNC Workshops",
  "Textiles",
  "Plastic Molding",
  "Electronics",
  "Pharmaceutical",
  "Engineering Components",
  "Machine Builders",
  "Stamping",
  "OEMs",
];
