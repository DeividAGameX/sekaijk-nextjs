import {RespCommon} from "@/types/Resp";
import ResourceModel from "../../lib/ResourceModel";
import {ResourceType, UserResource} from "../../types/userResource";
import {validateErrorPrisma} from "@/utils/validateError";
import {Prisma} from "@prisma/client";

interface UploadResourceForm {
    name: string;
    resourceId: string;
    url: string;
    type: ResourceType;
    usersFoldersId: string | null;
}

export default async function uploadResource(
    body: UploadResourceForm,
    userId: number
): Promise<[UserResource | RespCommon, ResponseInit]> {
    try {
        const userResource = await ResourceModel.create({
            data: {
                ...body,
                userId,
            },
        });
        return [userResource, {status: 200}];
    } catch (error) {
        console.log(error);
        return validateErrorPrisma(
            error as Prisma.PrismaClientKnownRequestError
        );
    }
}
