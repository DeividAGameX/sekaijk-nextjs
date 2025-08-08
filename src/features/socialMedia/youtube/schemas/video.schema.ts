import {z} from "zod";
import {CreateVideo, YoutubeVideosType} from "../types/youtube";
import {RespCommon} from "@/types/Resp";
import {Tag} from "@/features/tags/types/tag";

interface YoutubeVideosProps extends YoutubeVideosType {
    Tags: Tag[];
}

const videoCreateSchema = z.object({
    title: z
        .string({message: "string"})
        .min(1, {message: "require"})
        .max(150, {message: "max150"}),
});

const updateSchema = z.object({
    title: z
        .string({message: "string"})
        .min(1, {message: "require"})
        .max(150, {message: "max150"}),
    description: z.string({message: "string"}).max(500, {message: "max500"}),
    cloudinaryUrl: z.string().url().nullable().optional(),
    thumbnail: z.string().url().nullable(),
    Tags: z.array(z.number()).optional().nullable(),
});

const reviewSchema = z.object({
    title: z
        .string({message: "string"})
        .min(1, {message: "require"})
        .max(150, {message: "max150"}),
    description: z
        .string({message: "string"})
        .min(1, {message: "require"})
        .max(500, {message: "max500"}),
    cloudinaryUrl: z.string().min(1, {message: "require"}).url(),
    thumbnail: z.string().min(1, {message: "require"}).url(),
    Tags: z.array(z.number()),
});

export function validateCreate(
    body: CreateVideo
): [
    (
        | CreateVideo
        | {[key: string]: string | {[key: string]: string}}
        | RespCommon
    ),
    ResponseInit
] {
    try {
        return [videoCreateSchema.parse(body), {status: 200}];
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors: {[key: string]: string} = {};
            console.log(error.issues);
            for (const f of error.issues) {
                fieldErrors[f.path[0]] = f.message;
            }
            return [
                {message: "formInvalid", field: fieldErrors},
                {status: 400},
            ];
        }
        return [
            {
                message: "unknown",
            },
            {status: 400},
        ];
    }
}

export function validateUpdate(
    body: YoutubeVideosProps
): [
    (
        | YoutubeVideosProps
        | {[key: string]: string | null | number[] | {[key: string]: string}}
        | RespCommon
    ),
    ResponseInit
] {
    try {
        return [updateSchema.parse(body), {status: 200}];
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors: {[key: string]: string} = {};
            console.log(error.issues);
            for (const f of error.issues) {
                fieldErrors[f.path[0]] = f.message;
            }
            return [
                {message: "formInvalid", field: fieldErrors},
                {status: 400},
            ];
        }
        return [
            {
                message: "unknown",
            },
            {status: 400},
        ];
    }
}

export function validateReview(
    body: YoutubeVideosProps
): [
    (
        | YoutubeVideosProps
        | {[key: string]: string | null | number[] | {[key: string]: string}}
        | RespCommon
    ),
    ResponseInit
] {
    try {
        return [reviewSchema.parse(body), {status: 200}];
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors: {[key: string]: string} = {};
            console.log(error.issues);
            for (const f of error.issues) {
                fieldErrors[f.path[0]] = f.message;
            }
            return [
                {message: "formInvalid", field: fieldErrors},
                {status: 400},
            ];
        }
        return [
            {
                message: "unknown",
            },
            {status: 400},
        ];
    }
}
