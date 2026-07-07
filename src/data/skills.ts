export type Skill = {
  name: string;
  icon: string;
  description: string;
};

export const portfolioSkills: { graphicDesign: Skill[]; videoEditing: Skill[] } = {
  graphicDesign: [
    {
      name: "Adobe Photoshop",
      icon: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
      description: "Used for poster design, photo manipulation, image editing, social media creatives, banners, and marketing graphics."
    },
    {
      name: "Canva",
      icon: "/logos/canva.png",
      description: "Used for quick marketing creatives, presentations, and social media content."
    },
    {
      name: "Figma",
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
      description: "Used for UI/UX layouts, prototypes, wireframes, and collaborative design."
    }
  ],
  videoEditing: [
    {
      name: "DaVinci Resolve",
      icon: "/logos/davinci.png",
      description: "Used for professional video editing, color grading, promotional videos, reels, and short-form content."
    }
  ]
};
