export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Testimonials", href: "#testimonials" },
] as const;

export const about = {
  paragraphs: [
    "As Founder and Principal of Apple Properties Limited, Nnamdi leads the development of residential and mixed-use projects across key urban markets.",
    "Guided by a strategic & detail-oriented approach, he focuses on identifying properties and spaces designed to hold long-term value.",
    "Nnamdi brings clarity, efficiency and a disciplined mindset across the lifecycle of multi-million-dollar builds.",
  ],
  metrics: [
    { value: "6+ years", label: "Experience" },
    { value: "10+", label: "Completed Projects" },
    { value: "$5.5m", label: "Closed Deals" },
  ],
};

export type Project = {
  date: string;
  name: string;
  description: string;
  metrics: { value: string; label: string }[];
  images: { src: string; alt: string }[];
};

export const projects: Project[] = [
  {
    date: "Oct 2026",
    name: "Elysium Court",
    description:
      "Tucked away in Ikoyi’s lush, secure neighborhood, Elysium Court is a 1,500 sqm boutique development. Designed as a quiet retreat from Lagos’s busy commercial districts, it offers 16 spacious 3- and 4-bedroom residences.",
    metrics: [
      { value: "$3.8m", label: "Property Value" },
      { value: "18 months", label: "Project Duration" },
    ],
    images: [
      {
        src: "/images/elysium-1.webp",
        alt: "Elysium Court exterior with timber deck, pool and garden",
      },
      {
        src: "/images/elysium-2.webp",
        alt: "Elysium Court living room opening onto the pool deck",
      },
      {
        src: "/images/elysium-3.webp",
        alt: "Elysium Court kitchen and dining area",
      },
      { src: "/images/elysium-4.webp", alt: "Elysium Court bedroom" },
      {
        src: "/images/elysium-5.webp",
        alt: "Elysium Court covered terrace with outdoor seating",
      },
    ],
  },
  {
    date: "Feb 2026",
    name: "Caspar Homes",
    description:
      "Located in Ajah Garden Estate, Caspar Homes is a 700 sqm contemporary villa featuring three levels of sunlit terraces, covered outdoor lounging, and a private poolside garden.",
    metrics: [
      { value: "$970k", label: "Property Value" },
      { value: "15 months", label: "Project Duration" },
    ],
    images: [
      {
        src: "/images/caspar-1.webp",
        alt: "Caspar Homes villa and pool seen from above",
      },
      { src: "/images/caspar-2.webp", alt: "Caspar Homes living room" },
      {
        src: "/images/caspar-3.webp",
        alt: "Caspar Homes covered poolside terrace",
      },
      {
        src: "/images/caspar-4.webp",
        alt: "Caspar Homes front entrance and arrival garden",
      },
      { src: "/images/caspar-5.webp", alt: "Caspar Homes kitchen and dining" },
      { src: "/images/caspar-6.webp", alt: "Caspar Homes master bedroom" },
    ],
  },
];

export const testimonials = [
  {
    quote:
      "What sets Nnamdi apart is his disciplined approach to feasibility and market analysis. He does not just build for aesthetics; he builds for sustained commercial performance.",
    name: "Chris Etimo",
    title: "CEO, JHV Petroleum",
  },
  {
    quote:
      "Buying property in Nigeria from abroad comes with valid concerns around transparency and delivery. Nnamdi and the Apple Properties team removed every bit of uncertainty from our initial market briefing to final handover.",
    name: "Sarah Vance-Miller",
    title: "Diaspora Homebuyer (London, UK)",
  },
  {
    quote:
      "Working with Nnamdi was the best decision I ever made on the journey to acquiring my dream home.",
    name: "Chinedu Okafor",
    title: "Managing Partner, Ridgeway Capital",
  },
];

export const contact = {
  email: "applepropertiesglobal@gmail.com",
  phones: ["09016889304", "09014883028"],
  address: "Block 82, ICAN Junction, Okota Link Road, Lagos, Nigeria",
};
