import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem, SelectTrigger, SelectValue, Select, SelectContent } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useParams, useSearchParams } from "react-router-dom";

interface DeploymentSetupScreenProps {}

export function DeploymentSetupScreen({}: DeploymentSetupScreenProps) {

  const [searchParams] = useSearchParams()
  const [source, setSource] = useState<string | null>(searchParams.get("source") || null)
  const [repositories, setRepositories] = useState<any[]>([])

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      repository: "",
      branch: "",
      buildCommand: "",
      targetDirectory: "",
      runCommand: "",
    }
  })

  useEffect(() => {

    const fetchRepositories = async () => {
      // Get cookie
      const token = document.cookie.split("; ").find(row => row.startsWith("github_token="))?.split("=")[1]
      if (!token) {
        console.log("Failed to fetch repositories: No token found");
        return;
      }

      const userIdentifier = document.cookie.split("; ").find(row => row.startsWith("github_username="))?.split("=")[1]

      const response = await fetch(`https://api.github.com/users/${userIdentifier}/repos?sort=updated`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      const data = await response.json()
      console.log(data)
      setRepositories(data)
    }
    fetchRepositories()
  }, [])

  return (
    <main className="p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/deployment">Deployments</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Preview Deployment</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form onSubmit={(data) => { console.log(data) }} className="space-y-6 mt-8 w-full max-w-screen-lg text-left">
        <header className="flex flex-col mb-4">
          <h1 className="text-3xl font-bold">Setup Deployment</h1>
          <p className="text-muted-foreground">
            Review the details of your deployment before creating it and authorize the deployment source.
          </p>
        </header>
        <div className="flex flex-1 flex-col space-y-2 w-1/2">
          <Label htmlFor="repository">Repository</Label>
          <Controller
            name="repository"
            control={control}
            render={({ field: { onChange } }) => (
              <Select onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a repository" />
                </SelectTrigger>
                <SelectContent>
                  {repositories.map((repo, index) => (
                    <SelectItem key={index} value={repo.full_name}>{repo.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
        </div>
        <div className="flex flex-1 flex-col space-y-2 w-1/2">
          <Label htmlFor="branch">Branch</Label>
          <Input {...register("branch")} id="branch" type="text" className="input" placeholder="main" />
        </div>
        <div className="flex flex-1 flex-col space-y-2 w-1/2">
          <Label htmlFor="buildCommand">Build Command</Label>
          <Input {...register("buildCommand")} id="buildCommand" type="text" className="input" placeholder="npm run build" />
        </div>
        <div className="flex flex-1 flex-col space-y-2 w-1/2">
          <Label htmlFor="targetDirectory">Target Directory</Label>
          <Input {...register("targetDirectory")} id="targetDirectory" type="text" className="input" placeholder="public" />
        </div>
        <div className="flex flex-1 flex-col space-y-2 w-1/2">
          <Label htmlFor="runCommand">Run Command</Label>
          <Input {...register("runCommand")} id="runCommand" type="text" className="input" placeholder="npm start" />
        </div>
      </form>
    </main >
  );
}
