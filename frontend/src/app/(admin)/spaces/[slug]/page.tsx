import HeaderAdmin from "../../components/HeaderAdmin";
import Product from "./components/Product";

export default async function SpaceSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex flex-col">
      <HeaderAdmin />
      <Product spaceId={slug} />
    </div>
  );
}
