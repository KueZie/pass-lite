import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { MdErrorOutline } from "react-icons/md";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, redirect, useNavigate } from "react-router-dom";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { IconBrandBitbucket, IconBrandGitlab } from "@tabler/icons-react";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CodeSquare } from "lucide-react";
import { ErrorMessage } from "@hookform/error-message";
import InputError from "@/components/form/InputError";

const SOURCE_OPTIONS = [
  { label: "GitHub", value: "github", icon: GitHubLogoIcon },
  { label: "GitLab", value: "gitlab", icon: IconBrandGitlab },
  { label: "Bitbucket", value: "bitbucket", icon: IconBrandBitbucket },
  { label: "Manual", value: "manual", icon: CodeSquare },
];

const ValidDeploymentName = (name: string) => {
  return /^[a-z0-9-]+$/.test(name);
}

export function DeploymentCreateScreen() {

  const { formState: { errors, isValid }, handleSubmit, control, getValues, setValue, register } = useForm({
    defaultValues: {
      name: "",
      type: "static",
      region: "",
      source: "github",
    },
    mode: "all",
    reValidateMode: "onChange",
  });

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    localStorage.setItem("deployment", JSON.stringify(data));
    console.log(data);
    window.location.href = "http://localhost:8080/api/oauth/github/authorize";
  }

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
            <BreadcrumbPage>Create Deployment</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8 w-full max-w-screen-lg text-left">
        <header className="flex flex-col mb-4">
          <h1 className="text-3xl font-bold">Create Deployment</h1>
          <p className="text-muted-foreground">
            Deploy your static sites, React applications, and more to the web with a single command.
          </p>
        </header>
        <div className="flex flex-1 flex-col mb-2">
          <Label htmlFor="type" className="text-primary mb-2">Type</Label>
          <Controller
            name="type"
            render={({ field }) => (
              /* Custom Card-style select btn */
              <div className="grid grid-cols-3 gap-8">
                <div
                  {...field}
                  onClick={() => {
                    setValue("type", "static")
                  }}
                  className="cursor-pointer flex flex-1"
                >
                  <div className={`text-left rounded-md text-card-foreground shadow-md ring-1 ring-border ${field.value === "static" ? "ring-foreground" : ""}`}>
                    <div className="p-4">
                      Static Site
                      <div className="pt-2 tracking-tight text-muted-foreground">
                        Deploy static sites, such as HTML, CSS, and JavaScript files to the web.
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  {...field}
                  onClick={() => {
                    setValue("type", "react")
                  }}
                  className="cursor-pointer flex flex-1"
                >
                  <div className={`text-left rounded-md text-card-foreground shadow-md ring-1 ring-border ${field.value === "react" ? "ring-foreground" : ""}`}>
                    <div className="p-4">
                      Single Page Application
                      <div className="pt-2 tracking-tight text-muted-foreground">
                        Deploy React applications, such as Create React App, Next.js, and Gatsby.
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  {...field}
                  onClick={() => {
                    setValue("type", "api")
                  }}
                  className="cursor-pointer flex flex-1"
                >
                  <div className={`text-left rounded-md text-card-foreground shadow-md ring-1 ring-border ${field.value === "api" ? "ring-foreground" : ""}`}>
                    <div className="p-4">
                      API
                      <div className="pt-2 tracking-tight text-muted-foreground">
                        Deploy APIs, such as Node.js, Express, and Flask applications to the web.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            control={control}
          />
          <ErrorMessage errors={errors} name="type" render={({ message }) => <InputError message={message} />} />
        </div>
        <div className="flex flex-1 flex-col">
          <Label htmlFor="source" className="text-primary mb-2">
            Source{" "}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="align-middle">
                  <MdErrorOutline className="w-4 h-4 text-foreground" />
                </TooltipTrigger>
                <TooltipContent align="start">
                  Choose the source code repository for your deployment.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Controller
            name="source"
            render={({ field }) => (
              <div className="flex flex-row gap-8 pb-8">
                {SOURCE_OPTIONS.map((option, index) => (
                  <div
                    className="cursor-pointer flex"
                    onClick={() => { setValue("source", option.value) }}
                    key={index}
                  >
                    <div className={`flex flex-col items-center rounded-md text-card-foreground shadow-md p-8 py-6 ring-1 ring-border ${field.value === option.value ? "ring-foreground" : ""}`}>
                      <option.icon className="w-8 h-8" />
                      <div className="mt-2">
                        {option.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            control={control}
          />
          <ErrorMessage errors={errors} name="source" render={({ message }) => <InputError message={message} />} />
        </div>
        <div className="flex flex-row gap-8">
          <div className="flex flex-1 flex-col">
            <Label htmlFor="name" className="text-primary mb-2">Name</Label>
            <Input type="text" {...register("name", {
              required: 'Name is required',
              validate: {
                validName: (value) => ValidDeploymentName(value) || 'Name must only contain lowercase letters, numbers, and hyphens',
                minLength: (value) => value.length >= 4 || 'Name must be at least 4 characters long',
                maxLength: (value) => value.length <= 20 || 'Name must be at most 32 characters long',
              }
            })} placeholder="Enter a name for your deployment" />
            <ErrorMessage errors={errors} name="name" render={({ message }) => <InputError message={message} />} />
          </div>
          <div className="flex flex-1 flex-col">
            <Label htmlFor="region" className="text-primary mb-2">
              Region{" "}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="align-middle">
                    <MdErrorOutline className="w-4 h-4 text-foreground" />
                  </TooltipTrigger>
                  <TooltipContent align="start">
                    Regions are physical locations where your code will be deployed. <br /> Choose the region closest to your users for the best performance.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Controller
              name="region"
              rules={{ required: 'Region is required' }}
              render={({ field }) => (
                <Select
                  onValueChange={(value: string) => setValue("region", value)}>
                  <SelectTrigger className="text-red">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-west-1">US West 1</SelectItem>
                    <SelectItem value="us-west-2">US West 2</SelectItem>
                    <SelectItem value="us-east-1">US East 1</SelectItem>
                    <SelectItem value="us-east-2">US East 2</SelectItem>
                  </SelectContent>
                </Select>
              )} control={control} />
            <ErrorMessage errors={errors} name="region" render={({ message }) => <InputError message={message} />} />
          </div>
        </div>
        <div className="flex justify-between border-t-2 pt-8">
          <div className="flex flex-col">
            <h2 className="text-foreground text-lg font-bold p-0 leading-tight">$10.00/month</h2>
            <p className="text-muted-foreground p-0 leading-tight">$0.0134/hour</p>
          </div>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </main >
  );
}
