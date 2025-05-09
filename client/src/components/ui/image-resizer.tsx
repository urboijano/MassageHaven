
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from './button';

interface ImageResizerProps {
  open: boolean;
  onClose: () => void;
  onComplete: (resizedImageUrl: string) => void;
  imageUrl: string;
}

export function ImageResizer({ open, onClose, onComplete, imageUrl }: ImageResizerProps) {
  const resizeImage = () => {
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const resizedImageUrl = URL.createObjectURL(blob);
        onComplete(resizedImageUrl);
        onClose();
      }, 'image/jpeg', 0.8);
    };
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Preview Image</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Preview"
            style={{ maxHeight: '60vh', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="accent" onClick={resizeImage}>Upload Image</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
