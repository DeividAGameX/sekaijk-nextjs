import deleteResource from "@/features/users/service/resources/deleteResource.service";
import {params as ParamsType} from "@/types/api/paramApi";
import {authOptions} from "@/utils/AuthOptions";
import {getServerSession} from "next-auth";
import {NextRequest, NextResponse} from "next/server";

interface User {
    name: string;
    token: string;
}

export async function DELETE(_: NextRequest, {params}: ParamsType) {
    const {id} = await params;
    const author = await getServerSession(authOptions);
    let token = "";
    if (author)
        token = `${(author?.user as User).name}:${
            (author?.user as User).token
        }`;
    const response = await deleteResource(parseInt(id), token);
    return NextResponse.json(...response);
}
