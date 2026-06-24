'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardCheck,
  BarChart3,
  LifeBuoy,
  Landmark,
  LogOut,
  Settings,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  ClipboardList,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const applicantNav = [
  { title: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Onboarding', href: '/consent', icon: ShieldCheck },
  { title: 'Readiness', href: '/readiness', icon: BadgeCheck },
  { title: 'Apply for Loan', href: '/apply', icon: FilePlus2 },
  { title: 'Results', href: '/results', icon: FileCheck2 },
  { title: 'Fix & Resubmit', href: '/fix', icon: Sparkles },
  { title: 'Checklist', href: '/checklist', icon: ClipboardList },
]

const opsNav = [
  { title: 'Officer Review', href: '/review', icon: ClipboardCheck, badge: '5' },
  { title: 'Analytics', href: '/admin', icon: BarChart3 },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-1 py-1.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Landmark className="size-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-sidebar-foreground">BrightBridge</span>
            <span className="text-xs text-sidebar-foreground/60">Youth loan platform</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Borrower</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {applicantNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    render={
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {opsNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    render={
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Support">
                  <LifeBuoy />
                  <span>Support</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Sign out"
              render={
                <Link href="/">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                      AO
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col leading-tight">
                    <span className="text-sm font-medium">Amara Okafor</span>
                    <span className="text-xs text-sidebar-foreground/60">Sign out</span>
                  </div>
                  <LogOut className="size-4 text-sidebar-foreground/60" />
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}