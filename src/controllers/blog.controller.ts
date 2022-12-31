import Blog from "../models/blog.model";
import Avatar from "../models/avatar.model";
import { Request, Response } from "express";
import cloud from "../config/cloudinary.config";
import { logger } from "../libraries/Logger.library";

export const createBlog = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  try {
    const { secure_url, public_id } = await cloud.uploader.upload(
      req.file?.path as string,
      { transformation: { width: 1200, height: 800 } }
    );
    const thumbnail = await Avatar.create({
      image: secure_url,
      cloudinary_id: public_id,
    });

    const blog = await Blog.create({
      userId: req.user.id,
      title,
      content,
      thumbnail: thumbnail.id,
    });

    res.status(200).json({
      success: true,
      message: "managed to create a blog",
      data: { blog },
    });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ success: false, message: error });
  }
};

// export const coba = (req: Request, res: Response) => {
//   try {
//     const { title, content, image } = req.body;
//     res.status(200).json({ success: true, data: { title, content, image } });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
//   // return upload.single("image")(req, res, (): any => {
//   //   try {
//   //     console.log(req.file);
//   //     if (req.file === undefined)
//   //       return res.status(400).json({ success: false, message: "gagal" });
//   //   } catch (error: any) {
//   //     return res.status(400).json({
//   //       success: false,
//   //       message: error.message,
//   //     });
//   //   }
//   // });
// };

// const objectifyFormdata = (data: any) => {
//   return data
//     .getBuffer()
//     .toString()
//     .split(data.getBoundary())
//     .filter((e: any) => e.includes("form-data"))
//     .map((e: any) =>
//       e
//         .replace(/[\-]+$/g, "")
//         .replace(/^[\-]+/g, "")
//         .match(/\; name\=\"([^\"]+)\"(.*)/s)
//         .filter((_v: any, i: any) => i == 1 || i == 2)
//         .map((e: any) => e.trim())
//     )
//     .reduce((acc: any, cur: any) => {
//       acc[cur[0]] = cur[1];
//       return acc;
//     }, {});
// };

// function rawFormDataToJSON(raw_data: any, boundary: any) {
//   var spl = raw_data.split(boundary);
//   var data_out: any[] = [];
//   spl.forEach((element: any) => {
//     let obj: any = {};
//     let ll = element.split("\n");
//     if (ll[1]) {
//       let key = ll[1].split("=")[1].replace('"', "").replace('"\r', "");
//       let val = "";
//       if (ll.length > 3) {
//         for (let i = 3; i < ll.length; i++) {
//           val += ll[i] + "\n";
//         }
//       }
//       obj[key] = val.replace("--", "").replace("\r\n\n", "");
//       data_out.push(obj);
//     }
//   });
//   return data_out;
// }
