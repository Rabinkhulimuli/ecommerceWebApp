import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Share2 } from "lucide-react";

export default function Share({ url, title, text }: any) {
  const handleNativeShare = async () => {
    if (typeof navigator.share === "function") {
       await navigator.share({
        title: title || "Check this out!",
        text: text || "Take a look at this amazing content!",
        url: url || window.location.href,
      });
    }
  };

  return (
    <>
      {typeof navigator.share === "function" ? (
        <Button onClick={handleNativeShare} variant="outline" size="lg" className="w-full sm:w-fit">
              <Share2 className="h-5 w-5" />
            </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" className="w-full">
              <Share2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank">Facebook</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`} target="_blank">Twitter</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`} target="_blank">LinkedIn</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
