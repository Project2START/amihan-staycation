"use client";

import { useEffect, useState } from "react";
import NewUnitForm from "../../components/NewUnitFormTwo";
import { Product } from "./Product";
import { urlsToFiles } from "@/app/shared/lib/urlToFiles";
import { NewUnitSchema } from "../../lib/newUnitSchema";

export default function ProductEdit({
  product,
  onCloseDialog,
}: {
  product: Product;
  onCloseDialog: () => void;
}) {
  const [newProduct, setNewProduct] = useState<NewUnitSchema | null>(null);
  const { photos, id } = product;

  //   const handleProductTransform = async () => {
  //     const photoUrls = photos.map(photo => (photo.image_url));
  //     const photoFiles = await urlsToFiles(photoUrls);

  //     return photoFiles;
  //   }

  useEffect(() => {
    const handlePhotosTransform = async () => {
      const photoUrls = photos.map((photo) => photo.image_url);
      const photoFiles = await urlsToFiles(photoUrls);

      const newPhotos = photoFiles.map((photoFile, index) => ({
        file: photoFile,
        id: photos[index].id,
        src: URL.createObjectURL(photoFile),
      }));

      setNewProduct({ ...product, photos: newPhotos });
    };

    handlePhotosTransform();
  }, [photos]);

  return (
    <div>
      {newProduct && (
        <NewUnitForm
          onCloseDialog={onCloseDialog}
          edit={{ editMode: true, dataFillers: newProduct }}
        />
      )}
    </div>
  );
}
