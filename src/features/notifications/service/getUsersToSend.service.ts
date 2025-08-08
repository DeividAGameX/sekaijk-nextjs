import UsersModel from "@/features/users/lib/UsersModel";
import {RespCommon} from "@/types/Resp";
import {validateErrorPrisma} from "@/utils/validateError";
import {Prisma} from "@prisma/client";

interface ReturnType {
    id: number;
    name: string;
}

export default async function getUsersToSend(): Promise<
    [ReturnType[] | RespCommon, ResponseInit]
> {
    try {
        const users = await UsersModel.findMany({
            select: {
                id: true,
                name: true,
            },
        });
        return [users, {status: 200}];
    } catch (error) {
        return validateErrorPrisma(
            error as Prisma.PrismaClientKnownRequestError
        );
    }
}
