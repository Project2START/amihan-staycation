"use client";

import { useEffect, useState } from "react";
import { Product } from "./Product";
import { urlsToFiles } from "@/app/shared/lib/urlToFiles";
import { NewUnitSchema } from "../../lib/newUnitSchema";
import EditUnitForm from "../../components/EditUnitForm";
import { CircularProgress } from "@mui/material";

export default function ProductEdit({
  product,
  onCloseDialog,
}: {
  product: Product;
  onCloseDialog: () => void;
}) {
  const [newProduct, setNewProduct] = useState<NewUnitSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const { photos, id } = product;

  useEffect(() => {
    setLoading(true);
    const handlePhotosTransform = async () => {
      const photoUrls = photos.map((photo) => photo.image_url);
      const photoFiles = await urlsToFiles(photoUrls);

      const newPhotos = photoFiles.map((photoFile, index) => ({
        file: photoFile,
        id: photos[index].id,
        src: URL.createObjectURL(photoFile),
      }));

      setNewProduct({ ...product, photos: newPhotos });
      setLoading(false);
    };

    handlePhotosTransform();
  }, [photos]);

  return (
    <div>
      {newProduct && (
        <EditUnitForm
          productId={id}
          onCloseDialog={onCloseDialog}
          edit={{ editMode: true, dataFillers: newProduct }}
        />
      )}
      {loading && (
        <div className="h-[50vh] flex items-center justify-center">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
