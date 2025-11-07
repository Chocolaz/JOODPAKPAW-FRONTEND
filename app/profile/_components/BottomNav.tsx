// // components/BottomNav.tsx
// "use client";
// import { usePathname } from "next/navigation";
// import { Home, Heart, Bell, User } from "lucide-react";

// export function BottomNav() {
//   const pathname = usePathname();

//   // This array holds our nav items
//   const navItems = [
//     { href: "/", label: "Home", icon: Home },
//     { href: "/favorites", label: "Favorites", icon: Heart },
//     { href: "/notifications", label: "Notifications", icon: Bell },
//     { href: "/profile", label: "Profile", icon: User },
//   ];

//   return (
//     // NAV CONTAINER:
//     // We make it 'sticky' or 'fixed'. Since it's INSIDE our
//     // phone wrapper, 'sticky' works perfectly. 'bottom-0' pins it.
//     <nav className="sticky bottom-0 w-full bg-white p-2 border-t border-gray-200">
//       <div className="flex justify-around items-center">
//         {navItems.map((item) => {
//           // Check if this item is the active one
//           const isActive = pathname === item.href;

//           return (
//             <Link
//               key={item.label}
//               href={item.href}
//               className="flex flex-col items-center justify-center w-full"
//             >
//               {/* This div is for the active top border */}
//               <div
//                 className={`w-10 h-1 rounded-full ${
//                   isActive ? "bg-orange-500" : "bg-transparent"
//                 }`}
//               ></div>

//               {/* Icon */}
//               <item.icon
//                 className={`w-6 h-6 mt-1 ${
//                   isActive ? "text-orange-600" : "text-gray-500"
//                 }`}
//               />

//               {/* Label */}
//               <span
//                 className={`text-xs font-medium ${
//                   isActive ? "text-orange-600" : "text-gray-900"
//                 }`}
//               >
//                 {item.label}
//               </span>
//             </Link>
//           );
//         })}
//       </div>
//     </nav>
//   );
// }

