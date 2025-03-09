import React from 'react';
import Image from 'next/image';

export interface AvatarProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Avatar component for displaying user profile images
 * Falls back to initials if no image is provided
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  className = '',
  size = 'md',
}) => {
  // Determine size class
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const sizeClass = sizeClasses[size];

  // Get initials from alt text for fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(alt);

  // If src is empty or invalid, show initials
  if (!src) {
    return (
      <div
        className={`${sizeClass} ${className} flex items-center justify-center rounded-full bg-primary text-white font-medium`}
        aria-label={alt}
      >
        {initials}
      </div>
    );
  }

  // Otherwise, show image
  return (
    <div className={`${sizeClass} ${className} relative rounded-full overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={`(max-width: 768px) ${size === 'xl' ? '4rem' : '2.5rem'}, ${
          size === 'xl' ? '4rem' : '2.5rem'
        }`}
      />
    </div>
  );
};

export default Avatar; 