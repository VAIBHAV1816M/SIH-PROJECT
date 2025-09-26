export interface Issue {
  id: string
  title: string
  category: string
  status: "Open" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High" | "Critical"
  assignedTo: string
  submittedBy: string
  description: string
  location: string
  reportedOn: string
  coordinates: [number, number]
  image?: string
  video?: string
  audio?: string
}

export const hardcodedIssues: Issue[] = [
  {
    id: "ISS-001",
    title: "Garbage overflow near community bin",
    category: "Solid Waste Management Department",
    status: "Open",
    priority: "High",
    assignedTo: "",
    submittedBy: "Resident - Prakash S",
    description:
      "Community dustbin at Kothrud Depot Road is overflowing with uncollected waste. Spillage attracting stray animals and foul smell reported since two days.",
    location: "Kothrud Depot Road",
    reportedOn: "2025-09-22",
    coordinates: [18.5078, 73.8077],
    image: "/images/1.overflowing-bin-in-public-park.webp",
  },
  {
    id: "ISS-002",
    title: "Public toilet requires deep cleaning",
    category: "Health & Sanitation Department",
    status: "In Progress",
    priority: "Medium",
    assignedTo: "Ward Sanitation Inspector",
    submittedBy: "Shop Owner - Kavita M",
    description:
      "Municipal toilet near Deccan bus stop has foul odor and wet floors. Cleaning schedule seems missed and consumables not replenished.",
    location: "Deccan Bus Stop",
    reportedOn: "2025-09-21",
    coordinates: [18.5167, 73.8417],
    image: "/images/2.Public toilet requires deep cleaning.webp",
  },
  {
    id: "ISS-003",
    title: "Water pipeline leakage on main road",
    category: "Water Works Department",
    status: "Open",
    priority: "Critical",
    assignedTo: "",
    submittedBy: "Citizen - Aditi P",
    description:
      "Continuous water seepage from underground line causing puddles and reduced pressure in nearby lanes. Potential road damage if not fixed urgently.",
    location: "FC Road - Near Gate No. 3",
    reportedOn: "2025-09-23",
    coordinates: [18.5209, 73.8522],
    image: "/images/3.Water pipeline leakage on main road.webp",
  },
  {
    id: "ISS-004",
    title: "Potholes across intersection",
    category: "Public Works Department (PWD)",
    status: "In Progress",
    priority: "High",
    assignedTo: "",
    submittedBy: "Auto Driver - Ramesh V",
    description:
      "Multiple deep potholes at the Senapati Bapat Road junction causing traffic slowdown and risk to two-wheelers. Requires patching and leveling.",
    location: "SB Road Junction",
    reportedOn: "2025-09-20",
    coordinates: [18.5362, 73.8410],
    image: "/images/4.Potholes across intersection.webp",
  },
  {
    id: "ISS-005",
    title: "Streetlight not working for entire lane",
    category: "Municipal Corporation Electrical Department",
    status: "Open",
    priority: "Medium",
    assignedTo: "Mike Employee",
    submittedBy: "Resident Welfare Assoc.",
    description:
      "Three consecutive streetlights are out from Lane 5 to Lane 7, creating dark stretch post 7 PM. Cabling suspected; poles numbered EL-23 to EL-25.",
    location: "Lane 5, Aundh",
    reportedOn: "2025-09-18",
    coordinates: [18.5602, 73.8073],
    image: "/images/5.Streetlight not working for entire lane.webp",
  },
  {
    id: "ISS-006",
    title: "Overflowing bin near Shivajinagar Court",
    category: "Solid Waste Management Department",
    status: "Open",
    priority: "Medium",
    assignedTo: "",
    submittedBy: "Citizen - Manoj K",
    description:
      "Public bin adjacent to Shivajinagar Court is overflowing; litter on pavement attracting stray animals.",
    location: "Shivajinagar Court",
    reportedOn: "2025-09-24",
    coordinates: [18.5312, 73.8476],
    image: "/images/6.Overflowing bin near Shivajinagar Court.webp",
  },
  {
    id: "ISS-007",
    title: "Streetlight flickering near Baner Road junction",
    category: "Municipal Corporation Electrical Department",
    status: "Open",
    priority: "Low",
    assignedTo: "Mike Employee",
    submittedBy: "Resident - Tanvi R",
    description:
      "One lamp post intermittently flickers at night near Baner Road junction causing poor visibility for vehicles.",
    location: "Baner Road Junction",
    reportedOn: "2025-09-24",
    coordinates: [18.5586, 73.7897],
    image: "/images/7.Streetlight flickering near Baner Road junction.webp",
  },
  {
    id: "ISS-008",
    title: "Water leakage near Swargate bus depot",
    category: "Water Works Department",
    status: "In Progress",
    priority: "High",
    assignedTo: "",
    submittedBy: "Shopkeeper - Rafiq S",
    description:
      "Continuous seepage from roadside valve causing slippery patch and reduced pressure in nearby shops.",
    location: "Swargate Bus Depot",
    reportedOn: "2025-09-23",
    coordinates: [18.5018, 73.8629],
    image: "/images/8.Water leakage near Swargate bus depot.webp",
  },
  {
    id: "ISS-009",
    title: "Public toilet cleaning required at Viman Nagar park",
    category: "Health & Sanitation Department",
    status: "Open",
    priority: "Medium",
    assignedTo: "",
    submittedBy: "Jogger - Nisha P",
    description:
      "Park restroom hasn’t been cleaned; wet floors and no handwash. Request immediate sanitation visit.",
    location: "Viman Nagar Central Park",
    reportedOn: "2025-09-25",
    coordinates: [18.5665, 73.9138],
    image: "/images/9.Public toilet cleaning required at Viman Nagar park.webp",
  },
  {
    id: "ISS-010",
    title: "Potholes on lane behind Fatima Nagar market",
    category: "Public Works Department (PWD)",
    status: "Open",
    priority: "High",
    assignedTo: "",
    submittedBy: "Delivery Rider - Omkar D",
    description:
      "Multiple potholes after recent rains; two-wheelers skidding reported. Needs patchwork and leveling.",
    location: "Fatima Nagar Market Lane",
    reportedOn: "2025-09-25",
    coordinates: [18.5006, 73.9033],
    image: "/images/10.Potholes on lane behind Fatima Nagar market.webp",
  },
]

export const chartData = {
  reportingTrends: [
    { month: "Jan", issues: 11 },
    { month: "Feb", issues: 14 },
    { month: "Mar", issues: 21 },
    { month: "Apr", issues: 16 },
    { month: "May", issues: 28 },
    { month: "Jun", issues: 19 },
  ],
  openIssuesTrends: [
    { month: "Jan", open: 9 },
    { month: "Feb", open: 7 },
    { month: "Mar", open: 12 },
    { month: "Apr", open: 10 },
    { month: "May", open: 13 },
    { month: "Jun", open: 8 },
  ],
  resolutionTrends: [
    { month: "Jan", resolved: 8 },
    { month: "Feb", resolved: 12 },
    { month: "Mar", resolved: 15 },
    { month: "Apr", resolved: 18 },
    { month: "May", resolved: 14 },
    { month: "Jun", resolved: 20 },
  ],
  employeeTrends: [
    { month: "Jan", employees: 240 },
    { month: "Feb", employees: 242 },
    { month: "Mar", employees: 244 },
    { month: "Apr", employees: 246 },
    { month: "May", employees: 247 },
    { month: "Jun", employees: 248 },
  ],
  monthlyResolved: [
    { name: "Completed", value: 52, fill: "#22c55e" },
    { name: "In Progress", value: 21, fill: "#f59e0b" },
    { name: "Open", value: 27, fill: "#ef4444" },
  ],
  issuePriorities: [
    { priority: "Critical", count: 8, fill: "#dc2626" },
    { priority: "High", count: 15, fill: "#ea580c" },
    { priority: "Medium", count: 22, fill: "#ca8a04" },
    { priority: "Low", count: 12, fill: "#16a34a" },
  ],
  departmentalResponse: [
    { department: "Solid Waste Management Department", avgTime: 2.4 },
    { department: "Health & Sanitation Department", avgTime: 3.1 },
    { department: "Water Works Department", avgTime: 1.9 },
    { department: "Public Works Department (PWD)", avgTime: 2.7 },
    { department: "Municipal Corporation Electrical Department", avgTime: 1.5 },
  ],
}

export const stats = {
  totalIssues: 157,
  openIssues: 42,
  avgResolutionTime: 2.3,
  employeeCount: 248,
}
