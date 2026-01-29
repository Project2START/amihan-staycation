import HeaderAdmin from "../../components/HeaderAdmin";
import Space from "./components/Product";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex flex-col">
      <HeaderAdmin />
      <Space spaceId={slug} />
    </div>
  );
}
