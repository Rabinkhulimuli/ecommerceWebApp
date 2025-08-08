
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
export const categories = [
  "Electronics",
  "Audio",
  "Wearable",
  "Photography",
  "Gaming",
  "Home & Decor",
];

type filterProps={
  price:number[],
  setPrice:React.Dispatch<React.SetStateAction<[number,number]>>,
  categorys:string[],
  setCategories: React.Dispatch<React.SetStateAction<string[]>>,
  handleFilterChange:()=> void,
  isLoading:boolean
}
/* const brands = ["Apple", "Samsung", "Sony", "Nike", "Adidas", "Canon"]
 */
export function ProductFilters({price,setPrice,categorys,setCategories,handleFilterChange,isLoading}:filterProps) {

  const handleSliderChange = (value: [number,number]) => {
    setPrice(value);
  };
  const handleChecked = (category: string, checked: boolean) => {
    setCategories((prev) =>
      checked ? [...prev, category] : prev.filter((item) => item !== category)
    );
  };

  return (
    <div className="space-y-6 relative">
      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              defaultValue={[0, 5000]}
              max={5000}
              step={10}
              value={price}
              onValueChange={handleSliderChange}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${price[0]}</span>
              <span>${price[1]}+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={categorys.includes(category)}
                  onCheckedChange={(checked) =>
                    handleChecked(category, checked === true)
                  }
                />
                <Label htmlFor={category} className="text-sm font-normal">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {(price[0] !== 0 || price[1] !== 5000 || categorys.length > 0) && (
        <div className="absolute top-1 right-4">
          <button
            disabled={isLoading}
            onClick={handleFilterChange}
            className="border-1 px-2 py-1 bg-orange-300 rounded-md hover:scale-105 hover:text-blue-500"
          >
            {isLoading ? "Applying changes" : "Apply changes"}
          </button>
        </div>
      )}
      {/*  <Card>
        <CardHeader>
          <CardTitle>Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox id={brand} />
                <Label htmlFor={brand} className="text-sm font-normal">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
