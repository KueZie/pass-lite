import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useListDeploymentsQuery } from "@/slices/api"
import { MoreHorizontal } from "lucide-react"
import { useEffect } from "react"
import { createPortal } from "react-dom"
import { MdAddCircleOutline } from "react-icons/md"
import { Link } from "react-router-dom"

export function Dashboard() {
  const { data: deployments, isLoading } = useListDeploymentsQuery()

  useEffect(() => {
    console.log(deployments)
  }, [deployments])

  const SkeletonRow = () => {
    return (
      <TableRow>
        <Skeleton className="hidden w-[100px] sm:table-cell" />
      </TableRow>
    )
  }

  const NoDeployments = () => (
    <div
      className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You have no deployments
        </h3>
        <p className="text-sm text-muted-foreground">
          You can add a new deployment by clicking the button below.
        </p>
        <Button variant="outline" size="default" className="mt-4">
          <Link to="/dashboard/deployments/create">
            Create Deployment
          </Link>
        </Button>
      </div>
    </div>
  )

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {document.getElementById("portal-root") ?
        createPortal(<Button><Link to="/dashboard/deployments/create">Create</Link></Button>, document.getElementById("portal-root") as HTMLElement) : null}
      {!deployments?.length ? NoDeployments() :
        (<Card className="text-left">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Deployments
              <Button className="p-2">
                <Link to="/dashboard/deployments/create" className="flex text-base items-center">
                  <MdAddCircleOutline className="h-6 w-6" />
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Manage your deployments and view insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="h-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Total Sales
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Created at</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>))}
                {deployments?.map((deployment: any) => (
                  <TableRow key={deployment.DeploymentName}>
                    <TableCell className="font-medium">{deployment.DeploymentName}</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">$199.99</TableCell>
                    <TableCell className="hidden md:table-cell">30</TableCell>
                    <TableCell className="hidden md:table-cell">
                      2024-02-14 02:14 PM
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> products
            </div>
          </CardFooter>
        </Card>)}
    </main>
  )
}
