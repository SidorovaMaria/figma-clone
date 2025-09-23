const adjectives = [
  "Happy",
  "Creative",
  "Energetic",
  "Lively",
  "Dynamic",
  "Radiant",
  "Joyful",
  "Vibrant",
  "Cheerful",
  "Sunny",
  "Sparkling",
  "Bright",
  "Shining",
];

const animals = [
  "Dolphin",
  "Tiger",
  "Elephant",
  "Penguin",
  "Kangaroo",
  "Panther",
  "Lion",
  "Cheetah",
  "Giraffe",
  "Hippopotamus",
  "Monkey",
  "Panda",
  "Crocodile",
];

export function generateRandomName(): string {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

  return `${randomAdjective} ${randomAnimal}`;
}
export const getShapeInfo = (shapeType: string) => {
  switch (shapeType) {
    case "Rect":
      return {
        icon: "/assets/rectangle.svg",
        name: "Rectangle",
      };

    case "Circle":
      return {
        icon: "/assets/circle.svg",
        name: "Circle",
      };

    case "Triangle":
      return {
        icon: "/assets/triangle.svg",
        name: "Triangle",
      };

    case "Line":
      return {
        icon: "/assets/line.svg",
        name: "Line",
      };

    case "IText":
      return {
        icon: "/assets/text.svg",
        name: "Text",
      };

    case "Image":
      return {
        icon: "/assets/image.svg",
        name: "Image",
      };

    case "Freeform":
      return {
        icon: "/assets/freeform.svg",
        name: "Free Drawing",
      };

    default:
      return {
        icon: "/assets/rectangle.svg",
        name: shapeType,
      };
  }
};
