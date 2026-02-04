// // app/ClientLayout.tsx
// "use client"; // 🔑 marks this as a Client Component

// import { fetchUser } from "@/lib/features/users/usersThunks";
// import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// import { useSearchParams } from "next/navigation";
// import { useEffect } from "react";

// export default function ClientLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//     const searchParams = useSearchParams();
//   const userId = searchParams.get("user");

//   const dispatch = useAppDispatch();
//   const user = useAppSelector((state) => state.users.data);

//   useEffect(() => {
//     dispatch(fetchUser(userId));
//   }, [dispatch]);

//   return <>{children}</>;
// }
