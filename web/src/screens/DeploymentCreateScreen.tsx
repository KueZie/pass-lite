import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  CreateDeploymentUploadLinkRequest,
  useCreateDeploymentUploadLinkMutation,
} from "@/slices/api";
import { ErrorMessage } from "@hookform/error-message";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DraggableFileUpload } from "@/components/form/DraggableFileUpload";

export function DeploymentCreateScreen() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      framework: "",
      file: null,
    },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const [createDeploymentUploadLink] = useCreateDeploymentUploadLinkMutation();

  const submit = async (data: any) => {
    const request = {
      name: data.name,
    } as CreateDeploymentUploadLinkRequest;
    const response = await createDeploymentUploadLink(request).unwrap();
    console.log(data.file);

    const uploadResponse = await fetch(response.uploadUrl, {
      method: "PUT",
      body: data.file[0],
      headers: {
        "Content-Type": "application/zip",
      },
    });

    console.log(uploadResponse);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 text-left">
      <div className="flex flex-1 justify-center items-center">
        <Card className="w-[400px] bg-muted-foreground/5">
          <CardHeader>
            <CardTitle>Create a Deployment</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(submit)}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Name of your deployment"
                    {...register("name")}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Description of your project"
                    {...register("description")}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Framework</Label>
                  <Controller
                    name="framework"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="next">Next.js</SelectItem>
                          <SelectItem value="sveltekit">SvelteKit</SelectItem>
                          <SelectItem value="astro">Astro</SelectItem>
                          <SelectItem value="nuxt">Nuxt.js</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {/* <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="dropzone-file">Project Files</Label>
                  <Label className="flex items-center justify-center w-full">
                    <div className="flex flex-col items-center justify-center w-full h-42 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        {}
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ZIP or TAR (MAX. 50GB)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        {...register("file", {
                          required: 'File is required',
                          validate: {
                            type: (files: any) => {
                              const allowedMimeType = ["application/zip", "application/x-zip-compressed", "application/x-zip", "application/octet-stream"];
                              return (files && allowedMimeType.includes(files[0]?.type)) || `Invalid file type. Allowed types: ${allowedMimeType.join(', ')}`
                            }
                          },
                        })}
                      />
                    </div>
                  </Label>
                </div> */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="file">Project Files</Label>
                  <Controller
                    name="file"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <DraggableFileUpload
                        onFiles={onChange} />
                    )} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Preview</Button>
              <Button type="submit">Deploy</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
