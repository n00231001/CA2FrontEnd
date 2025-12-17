import * as React from "react";
import {
  IconConfetti,
  IconTheater,
  IconDashboard,
  IconMicrophone2,
  IconInnerShadowTop,
  IconMusic,
  IconFileText,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useLocation } from "react-router";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Doctors",
      url: "/doctors",
      icon: IconConfetti,
    },
    {
      title: "Patients",
      url: "/patients",
      icon: IconTheater,
    },
    {
      title: "prescriptions",
      url: "/prescriptions",
      icon: IconFileText,
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: IconMicrophone2,
    },
    {
      title: "Diagnoses",
      url: "/diagnoses",
      icon: IconMusic,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  console.log(location);

  let message = location.state?.message;
  let type = location.state?.type;

  useEffect(() => {
    if (message) {
      if (type === 'error') {
        toast.error(message);
      }
      else if (type === 'success') {
        toast.success(message);
      } else {
        toast(message);
      }
    }
  }, [message]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="#">
                  <IconInnerShadowTop className="!size-5" />
                  <span className="text-base font-semibold">Acme Inc.</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-auto"
              >
                {theme === 'dark' ? <IconSun className="size-5" /> : <IconMoon className="size-5" />}
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
