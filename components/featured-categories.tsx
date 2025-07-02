import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Headphones, Watch, Camera } from "lucide-react"

const categories = [
  {
    name: "Electronics",
    icon: Smartphone,
    href: "/categories/electronics",
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Audio",
    icon: Headphones,
    href: "/categories/audio",
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Wearables",
    icon: Watch,
    href: "/categories/wearables",
    color: "from-green-500 to-green-600",
  },
  {
    name: "Photography",
    icon: Camera,
    href: "/categories/photography",
    color: "from-orange-500 to-orange-600",
  },
]

export function FeaturedCategories() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.name} href={category.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
