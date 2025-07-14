import type { Product } from "./types"

// Mock product data - in a real app, this would come from a database
const products: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    image: "/placeholder.svg?height=400&width=400",
    category: "Audio",
    brand: "Sony",
    rating: 4.8,
    reviews: 1247,
    inStock: true,
    features: ["Noise Cancellation", "Wireless", "30hr Battery", "Premium Sound"],
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration.",
    price: 249.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Wearables",
    brand: "Apple",
    rating: 4.6,
    reviews: 892,
    inStock: true,
    features: ["Heart Rate Monitor", "GPS", "Water Resistant", "Smart Notifications"],
  },
  {
    id: "3",
    name: "Professional Camera Lens",
    description: "High-performance telephoto lens perfect for professional photography and videography.",
    price: 899.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Photography",
    brand: "Canon",
    rating: 4.9,
    reviews: 456,
    inStock: true,
    features: ["Telephoto", "Image Stabilization", "Weather Sealed", "Professional Grade"],
  },
  {
    id: "4",
    name: "Gaming Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard designed for gaming with customizable keys.",
    price: 159.99,
    originalPrice: 199.99,
    discount: 20,
    image: "/placeholder.svg?height=400&width=400",
    category: "Gaming",
    brand: "Razer",
    rating: 4.7,
    reviews: 2103,
    inStock: true,
    features: ["Mechanical Switches", "RGB Lighting", "Programmable Keys", "Gaming Optimized"],
  },
  {
    id: "5",
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Electronics",
    brand: "Samsung",
    rating: 4.4,
    reviews: 678,
    inStock: true,
    features: ["Fast Charging", "Qi Compatible", "LED Indicator", "Compact Design"],
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Audio",
    brand: "JBL",
    rating: 4.5,
    reviews: 1534,
    inStock: true,
    features: ["360° Sound", "Waterproof", "Portable", "12hr Battery"],
  },
  {
    id: "7",
    name: "Smart Home Hub",
    description: "Central hub for controlling all your smart home devices with voice commands.",
    price: 129.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Electronics",
    brand: "Amazon",
    rating: 4.3,
    reviews: 892,
    inStock: false,
    features: ["Voice Control", "Smart Home Integration", "WiFi Enabled", "Compact Design"],
  },
  {
    id: "8",
    name: "Professional Drone",
    description: "4K camera drone with advanced flight features and long battery life.",
    price: 1299.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Photography",
    brand: "DJI",
    rating: 4.8,
    reviews: 234,
    inStock: true,
    features: ["4K Camera", "GPS Navigation", "30min Flight Time", "Obstacle Avoidance"],
  },
]

export async function getProducts(): Promise<Product[]| null> {

  try{
     const data = await fetch("http://localhost:3000/api/products")
 
    if(!data.ok){
      return null
    }
       const res= data.json()
     console.log(res)
      return res
  }catch(err){
    console.log(err)
    throw new Error("error getting product")
  }
}
export async function getProduct(id: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return products.find((product) => product.id === id) || null
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return products.filter((product) => product.category.toLowerCase() === category.toLowerCase())
}
