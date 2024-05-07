import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
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
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  CreateDeploymentUploadLinkRequest,
  useCreateDeploymentUploadLinkMutation,
} from "@/slices/api";
import { ErrorMessage } from "@hookform/error-message";
import { DraggableFileUpload } from "@/components/form/DraggableFileUpload";
import { useToast } from "@/components/ui/use-toast";
import { MdErrorOutline } from "react-icons/md";

export function DeploymentCreateScreen() {
  const {
    handleSubmit,
    register,
    control,
    formState: { dirtyFields, errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      deploymentType: "zip",
      file: null,
    },
    mode: "onSubmit",
    reValidateMode: "onBlur"
  });

  const [createDeploymentUploadLink] = useCreateDeploymentUploadLinkMutation();
  const { toast } = useToast();

  const submit = async (data: any) => {
    const request = {
      name: data.name,
    } as CreateDeploymentUploadLinkRequest;
    const response = await createDeploymentUploadLink(request).unwrap();
    console.log(data.file);

    // const uploadResponse = await fetch(response.uploadUrl, {
    //   method: "PUT",
    //   body: data.file[0],
    //   headers: {
    //     "Content-Type": "application/zip",
    //   },
    // });

    toast({
      title: "Deployment created",
      description: "Your deployment has been created successfully.",
    })
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 text-left">
      <div className="flex flex-1 justify-center items-center">
        <Card className="w-[400px] bg-primary-foreground dark:bg-muted/10">
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
                    {...register("name", {
                      required: "Name is required",
                      validate: {
                        length: (value) => {
                          if (value.length < 3) {
                            return "Name must be at least 3 characters long.";
                          }
                          return true;
                        },
                      }
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="name"
                    render={({ message }) => (
                      <div className="flex items-center text-destructive"><MdErrorOutline size="16px" className="mr-2"/><p className="leading-tight">{message}</p></div>
                    )} />
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
                  <Label htmlFor="deploymentType">Upload Method</Label>
                  <Controller
                    name="deploymentType"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Select value={value} onValueChange={onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="repository">Repository</SelectItem>
                          <SelectItem value="zip">Compressed Archive (.zip)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="file">Project Files</Label>
                  <Controller
                    name="file"
                    control={control}
                    rules={{
                      validate: {
                        present: (value) => {
                          if (!value) {
                            return "Please upload a file.";
                          }
                          return true;
                        },
                        type: (value: any) => {
                          console.log(value[0].type, dirtyFields.file)
                          // Types are trivially convertable to application/zip
                          const allowedTypes = ["application/zip", "application/octet-stream", "application/x-zip-compressed"];
                          if (dirtyFields.file && !allowedTypes.includes(value[0].type)) {
                            return "Invalid file type. Please upload a ZIP file.";
                          }
                          return true;
                        }
                      }
                    }}
                    render={({ field: { onChange } }) => (
                      <DraggableFileUpload
                        onFiles={onChange} />
                    )} />
                  <ErrorMessage
                    errors={errors}
                    name="file"
                    render={({ message }) => (
                      <div className="flex items-center text-destructive"><MdErrorOutline size="16px" className="mr-2"/><p className="leading-tight">{message}</p></div>
                    )} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit" variant="outline" className="w-full">Deploy</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
