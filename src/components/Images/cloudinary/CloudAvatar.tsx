import React from "react";
import { Avatar } from "@material-ui/core";
//@ts-ignore
import { Transformation, Image } from "cloudinary-react";
import { Cloudinary } from "cloudinary-core";
import { FaUser } from "react-icons/fa";

const cl = new Cloudinary({
  cloud_name: "iketown",
  secure: true
});

interface ICloudAvatar {
  src?: string;
  publicId?: string;
  width?: number;
}

const CloudAvatar = ({ src, width = 40, publicId }: ICloudAvatar) => {
  return (
    <Avatar>
      {publicId ? (
        <Image cloudName="iketown" publicId={publicId} width={width}>
          <Transformation
            width={width}
            height={width}
            gravity="faces"
            crop="thumb"
          />
          <Transformation quality="auto" fetchFormat="auto" />
        </Image>
      ) : (
        <FaUser />
      )}
    </Avatar>
  );
};

export default CloudAvatar;
