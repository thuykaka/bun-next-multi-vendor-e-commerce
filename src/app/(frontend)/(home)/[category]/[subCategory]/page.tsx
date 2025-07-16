type CategoryPageProps = {
  params: Promise<{ category: string; subCategory: string }>;
};

export default async function SubCategoryPage({ params }: CategoryPageProps) {
  const { category, subCategory } = await params;

  return <div>{JSON.stringify({ category, subCategory }, null, 2)}</div>;
}
