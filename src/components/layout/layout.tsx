import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ErrorLogsTable } from "../ui/errorLogsTable"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Xpense
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Application Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* main section */}
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <h1 className="text-2xl font-semibold">Xpense</h1>
           
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle>
                  <p>Status</p>
                </CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
                {/* <CardAction>Card Action</CardAction> */}
            </CardHeader>
            <CardContent>
              <div className="inline-flex items-center gap-2">
                  <span>
                    Running
                  </span>
                  <span className="size-2 inline-block bg-teal-600 rounded-full me-2 animate-pulse"></span>
              </div>
            </CardContent>
            {/* <CardFooter>
              <p>Card Footer</p>
            </CardFooter> */}
          </Card>
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              {/* <CardDescription>Card Description</CardDescription> */}
              {/* <CardAction>Card Action</CardAction> */}
            </CardHeader>
            <CardContent>
              <p>1</p>
            </CardContent>
            {/* <CardFooter>
              <p>Card Footer</p>
            </CardFooter> */}
          </Card>
          </div>

          <ErrorLogsTable />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
