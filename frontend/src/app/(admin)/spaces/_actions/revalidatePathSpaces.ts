"use server";

import { revalidatePath } from "next/cache";

export default async function revalidatePathSpaces() {
  revalidatePath("/spaces");
}
