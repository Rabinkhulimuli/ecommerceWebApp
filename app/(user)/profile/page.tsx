"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const addressSchema = z.object({
  street: z.string().min(3, "Street must be at least 3 characters").optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  postalCode: z
    .string()
    .regex(/^[a-zA-Z0-9\s-]+$/, "Invalid postal code format"),
  isPrimary: z.boolean().default(false),
});

const profileSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").max(50),
  email: z.string().email("Invalid email address"),
  avatar: z.any().optional(),
  addresses: z
    .array(addressSchema)
    .min(1, "At least one address is required")
    .max(2),
  primaryAddressIndex: z.number().min(0).max(1),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const {toast}= useToast()
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      id: "",
      name: "",
      email: "",
      avatar: null,
      addresses:  [{ street: "", city: "", country: "", postalCode: "" }],
      primaryAddressIndex: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const addresses = watch("addresses");
  const primaryAddressIndex = watch("primaryAddressIndex");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user");
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          reset({
            id: data.id || "",
            name: data.name || "",
            email: data.email || "",
            avatar: null,
            addresses:  [{ street: data.addresses[0]?.street || "", city: data.addresses[0]?.city || "", country: data.addresses[0]?.country || "", postalCode: data.addresses[0]?.postalCode || "" }],
            primaryAddressIndex: data.primaryAddressIndex || 0,
          });
          if (data.image) setPreview(data.image);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUser();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("name", data.name);
    formData.append("email", data.email);

    // Handle avatar
    if (data.avatar instanceof File) {
      formData.append("avatar", data.avatar);
      formData.append("avatarChanged", "true");
    } else {
      formData.append("avatarChanged", "false");
    }

    // Prepare addresses
    const primaryAddress = {
      ...data.addresses[data.primaryAddressIndex],
      isPrimary: true
    };
    formData.append("primaryRawAddress", JSON.stringify(primaryAddress));

    if (data.addresses.length > 1) {
      const secondaryIndex = 1 - data.primaryAddressIndex;
      const secondaryAddress = {
        ...data.addresses[secondaryIndex],
        isPrimary: false
      };
      formData.append("secondaryRawAddress", JSON.stringify(secondaryAddress));
    }

    const res = await fetch("/api/user", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(await res.text());
    toast({title:"Profile updated successfully",
      description:"your profile has been updated successfully",
      variant:"destructive",
    })
  } catch (error) {
    toast({
      title:"Error updating profile",
      description:"An error occurred while updating your profile. Please try again later.",
      variant:"destructive",
    })
  } finally {
    setLoading(false);
  }
};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid image file.",
        variant: "destructive",
      })
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      // 2MB
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      })
      return;
    }

    setValue("avatar", file, { shouldDirty: true });

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setValue("avatar", null, { shouldDirty: true });
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addAddress = () => {
    if (addresses.length < 2) {
      append({
        street: "",
        city: "",
        country: "",
        postalCode: "",
        isPrimary: false,
      });
    }
  };

  const removeAddress = (index: number) => {
    if (addresses.length > 1) {
      remove(index);
      // Adjust primary address index if needed
      if (primaryAddressIndex === index) {
        setValue("primaryAddressIndex", 0);
      } else if (primaryAddressIndex > index) {
        setValue("primaryAddressIndex", primaryAddressIndex - 1);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden border cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image
              src={preview || "/profile/Default_Profile_Picture.svg"}
              alt="Avatar"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                Change
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload New
            </Button>
            {preview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
              >
                Remove
              </Button>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Basic Info Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Addresses Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Addresses</h2>
            {addresses.length < 2 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAddress}
              >
                Add Address
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={`p-4 border rounded-md relative ${
                  primaryAddressIndex === index ? "border-primary" : ""
                }`}
              >
                {addresses.length > 1 && (
                  <div className="absolute top-2 right-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAddress(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="radio"
                    id={`address-${index}`}
                    value={index}
                    checked={primaryAddressIndex === index}
                    onChange={() => setValue("primaryAddressIndex", index)}
                    className="h-4 w-4 text-primary"
                  />
                  <Label htmlFor={`address-${index}`} className="font-medium">
                    {primaryAddressIndex === index
                      ? "Primary Address"
                      : "Secondary Address"}
                  </Label>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`street-${index}`}>Street (Optional)</Label>
                    <Input
                      id={`street-${index}`}
                      {...register(`addresses.${index}.street`)}
                    />
                    {errors.addresses?.[index]?.street && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.addresses[index]?.street?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`city-${index}`}>City*</Label>
                    <Input
                      id={`city-${index}`}
                      {...register(`addresses.${index}.city`)}
                    />
                    {errors.addresses?.[index]?.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.addresses[index]?.city?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`country-${index}`}>Country*</Label>
                    <Input
                      id={`country-${index}`}
                      {...register(`addresses.${index}.country`)}
                    />
                    {errors.addresses?.[index]?.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.addresses[index]?.country?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`postalCode-${index}`}>Postal Code*</Label>
                    <Input
                      id={`postalCode-${index}`}
                      {...register(`addresses.${index}.postalCode`)}
                    />
                    {errors.addresses?.[index]?.postalCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.addresses[index]?.postalCode?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.addresses?.root && (
            <p className="text-red-500 text-sm">
              {errors.addresses.root.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={loading || !isDirty}
            className="min-w-32"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Updating...
              </span>
            ) : (
              "Update Profile"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
