import React, { useRef, useEffect } from "react";
import { Button } from "@material-ui/core";
import { useField } from "react-final-form";
//
//
export interface IImageInfo {
  created_at: string;
  format: string;
  path: string;
  public_id: string;
  secure_url: string;
  thumbnail_url: string;
}

const UploadWidget = ({
  croppingAspectRatio,
  buttonText = "Edit Photo"
}: {
  croppingAspectRatio?: number;
  buttonText?: string;
}) => {
  const cloudRef = useRef();
  const { input } = useField("avatarURL");
  const { input: pidInput } = useField("avatarPublicId");
  const handleInfo = (info: IImageInfo) => {
    const { public_id, secure_url } = info;
    input.onChange(secure_url);
    pidInput.onChange(public_id);
  };
  useEffect(() => {
    //@ts-ignore
    if (window.cloudinary) {
      //@ts-ignore
      cloudRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: "iketown",
          uploadPreset: "avatars",
          cropping: true,
          croppingAspectRatio,
          croppingCoordinatesMode: "custom"
        },
        (error: any, result: any) => {
          if (error) console.log("error in cloudinary", error);
          if (!error && result && result.event === "success") {
            console.log("it worked!", result.info);
            handleInfo(result.info);
          }
        }
      );
    }
  }, []);
  const openWidget = () => {
    if (cloudRef.current) {
      //@ts-ignore
      cloudRef.current.open();
    }
  };
  return <Button onClick={openWidget}>{buttonText}</Button>;
};

export default UploadWidget;
