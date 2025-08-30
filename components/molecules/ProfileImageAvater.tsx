import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface iAppProps {
  imageSrc: string | null;
  text: string;
  width?: string; // optional width like "w-12 h-12"
  alt: string;
}

export const ProfileImageAvatar = ({
  text,
  imageSrc,
  alt,
  width = "w-12 h-12", // Default size if not provided
}: iAppProps) => {
  return (
    
      <Avatar className={cn(width)}>
        {imageSrc ? (
          <AvatarImage src={imageSrc} alt={alt} />
        ) : (
          <AvatarFallback>{text}</AvatarFallback>
        )}
      </Avatar>
    
  );
};
