import { useCallback, useState } from "react";

export default function useDynamicImage() {
  const [image, setImage] = useState<HTMLImageElement>();
  const onSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      // get all selected Files
      const files = e.target.files as FileList;
      for (let i = 0, file = files[i]; i < files.length; ++i) {
        // check if file is valid Image (just a MIME check)
        switch (file.type) {
          case "image/jpeg":
          case "image/png":
          case "image/gif":
            // read Image contents from file
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
              // create HTMLImageElement holding image data
              const img = new Image();
              img.src = reader.result as string;
              img.onload = () => setImage(img);
            };
            reader.readAsDataURL(file);
            // process just one file
            return;
        }
      }
    },
    [],
  );
  return {
    image,
    onSelect,
  };
}
