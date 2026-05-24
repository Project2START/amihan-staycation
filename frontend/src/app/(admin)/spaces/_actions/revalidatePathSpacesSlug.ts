"use server";

import { revalidatePath } from "next/cache";

export default async function revalidatePathSpacesSlug(slug: string) {
  revalidatePath(`/spaces/${slug}`);
}
