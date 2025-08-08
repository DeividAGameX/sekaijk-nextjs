import {RespCommon} from "@/types/Resp";
import ResourceModel from "../../lib/ResourceModel";
import {UserResource} from "../../types/userResource";
import {validateErrorPrisma} from "@/utils/validateError";
import {Prisma} from "@prisma/client";
import {cloudinary} from "@/lib/CloudinaryConfig";
import axios from "axios";

export default async function deleteResource(
    id: number,
    token?: string
): Promise<[UserResource | RespCommon, ResponseInit]> {
    try {
        const userResource = await ResourceModel.delete({
            where: {
                id,
            },
        });
        console.log(userResource);
        if (userResource.type === "VIDEO") {
            axios.delete(
                `${process.env.CDN}/delete/${userResource.resourceId}`,
                {
                    headers: {
                        Authorization: `Key ${token}`,
                    },
                }
            );
        }
        await cloudinary.uploader.destroy(
            userResource.resourceId,
            {
                resource_type: userResource.type.toLocaleLowerCase(),
            },
            (error, result) => {
                if (error) console.log(error);
                console.log(result);
            }
        );
        return [userResource, {status: 200}];
    } catch (error) {
        console.log(error);
        return validateErrorPrisma(
            error as Prisma.PrismaClientKnownRequestError
        );
    }
}
