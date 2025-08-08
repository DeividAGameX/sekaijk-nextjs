import createFolder from "@/features/users/service/resources/createFolderResource.service";
import {authOptions} from "@/utils/AuthOptions";
import {getServerSession} from "next-auth";
import {NextRequest, NextResponse} from "next/server";

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    banner?: string | undefined | null;
    slug?: string | undefined | null;
    rolesId: number;
    createdAt: Date;
    updatedAt: Date;
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const author = await getServerSession(authOptions);
    const response = await createFolder({
        name: body.name,
        parentId: body.parentId,
        usersId: (author?.user as User).id,
    });
    return NextResponse.json(...response);
}
