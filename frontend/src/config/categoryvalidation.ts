// config/categoryValidation.ts
import {CategoryConfig} from "@/types/categorytypes";

export const categories: CategoryConfig[] = [
  {
    name: "Agriculture & Food",
    subcategories: [
      {
        name: "Farm Animals",
        requiredFields: [
          "animalType",
          "age",
          "breed",
          "weight",
          "healthStatus",
        ],
        dropdownOptions: {
          animalType: [
            "Cows",
            "Sheep",
            "Goats",
            "Pigs",
            "Chickens",
            "Fish",
            "Cane Rat",
            "Rabbits",
            "Chinchillas",
            "Ducks",
            "Geese",
            "Goats",
            "Grasscutters",
            "Guinea Fowls",
            "Ostriches",
            "Quails",
            "Roosters",
            "Sheeps",
            "Shellfish",
            "Snails",
            "Turkey",
            "Others",
          ],
          breed: ["Local", "Exotic", "Crossbreed"],
          healthStatus: ["Healthy", "Vaccinated", "Under Treatment"],
        },
      },
      {
        name: "Farm machinery & Equipment",
        requiredFields: [
          "equipmentType",
          "brand",
          "model",
          "condition",
          "color",
        ],
        dropdownOptions: {
          equipmentType: [
            "Tractor",
            "Harvester",
            "Plough",
            "Irrigation System",
            "Cages",
            "Milling Machines",
            "Knapsack Sprayer",
            "Power Tiller",
            "Drinkers",
            "Cassava Processing Machines",
            "Chiken Processing Equipement",
            "Cow Milking Machines",
            "Egg Incubators",
            "Egg Transport Crate",
            "Feeders",
            "Filters",
            "Fish Ponds",
            "Fogging Machines",
            "Greenhouses",
            "Hammer Mills",
            "Manure Dryers",
            "Palm Kernel Crackers",
            "Poultry Vaccinators",
            "Rain Guns",
            "Rice Destoners",
            "Scales",
            "Seed Planters",
            "Seed Trays",
            "Shellers & Threshers",
            "Smoking Kilns",
            "Tarpaulins",
            "Weeding Machines",
            "Other",
          ],
          brand: ["John Deere", "Massey Ferguson", "New Holland", "Kubota"],
          condition: [
            "Brand New",
            "Used",
            "Seller Refurbished",
            "For Parts or Not Working",
            "Manufacturer Refurbished",
          ],
          color: ["Red", "Green", "Blue", "Yellow"],
        },
      },
      {
        name: "Feeds, Supplements & Seeds",
        requiredFields: ["type", "weight", "brand", "expiryDate"],
        dropdownOptions: {
          type: ["Feeds", "Plant Seeds", "Supplement"],
          brand: ["Purina", "Royal Canin", "Pioneer Seeds", "Monsanto"],
        },
      },
      {
        name: "Meal & Drink",
        requiredFields: ["type", "litre", "brand", "expiryDate"],
        dropdownOptions: {
          type: ["Bottle", "Can", "Plastic"],
          brand: ["Purina", "Royal Canin", "Pioneer Seeds", "Monsanto"],
        },
      },
    ],
  },
  {
    name: "Babies & Kid",
    subcategories: [
      {
        name: "Children's Clothing",
        requiredFields: ["brand", "type", "material", "color", "size"],
        dropdownOptions: {
          brand: ["Carter's", "OshKosh", "Nike", "Adidas", "Gap"],
          type: ["T-Shirts", "Pants", "Dresses", "Sweaters", "Pajamas"],
          material: ["Cotton", "Polyester", "Wool", "Denim", "Linen"],
          color: ["Red", "Blue", "Green", "Yellow", "Pink"],
          size: ["0-3M", "3-6M", "6-12M", "1Y", "2Y", "3Y"],
        },
      },
      {
        name: "Children's Furniture",
        requiredFields: ["type", "material", "color", "brand"],
        dropdownOptions: {
          type: ["Cribs", "Beds", "Dressers", "Chairs", "Tables"],
          material: ["Wood", "Plastic", "Metal", "MDF"],
          color: ["White", "Natural", "Black", "Pink", "Blue"],
          brand: ["IKEA", "Graco", "Delta Children", "Dream On Me"],
        },
      },
    ],
  },
  {
    name: "Electronics",
    subcategories: [
      {
        name: "Laptops & Computers",
        requiredFields: [
          "brand",
          "model",
          "processor",
          "ram",
          "storage",
          "screenSize",
        ],
        dropdownOptions: {
          brand: ["Apple", "Dell", "HP", "Lenovo", "ASUS"],
          processor: [
            "Intel i3",
            "Intel i5",
            "Intel i7",
            "Intel i9",
            "AMD Ryzen",
          ],
          ram: ["4GB", "8GB", "16GB", "32GB", "64GB"],
          storage: ["256GB", "512GB", "1TB", "2TB"],
          screenSize: ['13"', '14"', '15.6"', '16"', '17"'],
        },
      },
    ],
  },
  // Add more categories as needed
];

export const getCategory = (categoryName: string) => {
  return categories.find((cat) => cat.name === categoryName);
};

export const getSubcategoryConfig = (
  categoryName: string,
  subcategoryName: string
) => {
  const category = getCategory(categoryName);
  return category?.subcategories.find((sub) => sub.name === subcategoryName);
};
