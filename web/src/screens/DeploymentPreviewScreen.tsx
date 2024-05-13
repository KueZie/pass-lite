import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export function DeploymentPreviewScreen() {

  const { formState, handleSubmit, control, setError, setValue, getValues, register } = useForm({
    defaultValues: {
      name: "",
      type: "static",
      region: "",
      source: "github",
    },
  });


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
              <Link to="/dashboard/deployments">Deployments</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Preview Deployment</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form onSubmit={handleSubmit((data) => { console.log(data) })} className="space-y-6 mt-8 w-full max-w-screen-lg text-left">
        <header className="flex flex-col mb-4">
          <h1 className="text-3xl font-bold">Preview Deployment</h1>
          <p className="text-muted-foreground">
            Review the details of your deployment before creating it and authorize the deployment source.
          </p>
        </header>
        <div className="flex flex-1 flex-col space-y-2">
        </div>
      </form>
    </main >
  );
}
