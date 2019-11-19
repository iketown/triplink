import React from "react";
import { Avatar } from "@material-ui/core";
//@ts-ignore
import { Transformation, Image } from "cloudinary-react";
import { Cloudinary } from "cloudinary-core";

const cl = new Cloudinary({
  cloud_name: "iketown",
  secure: true
});

interface ICloudAvatar {
  src?: string;
  publicId?: string;
  width?: number;
}

const CloudAvatar = ({ src, width = 60, publicId }: ICloudAvatar) => {
  console.log("publicID", publicId);
  return (
    // <Avatar>
    <Image cloudName="iketown" publicId={publicId} width={width}>
      <Transformation width={100} height={100} gravity="faces" crop="thumb" />
      {/* <Transformation quality="auto" fetchFormat="auto" /> */}
    </Image>
    // </Avatar>
  );
};

export default CloudAvatar;
