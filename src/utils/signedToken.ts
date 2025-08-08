import crypto from "crypto";

export function generateSignedToken(
    action: string,
    userName: string,
    SECRET: string
) {
    const data = `${action}:${userName}`;
    const signature = crypto
        .createHmac("sha256", SECRET)
        .update(data)
        .digest("hex");

    return signature;
}

export function verifySignedToken(
    action: string,
    userName: string,
    signature: string,
    SECRET: string
): boolean {
    const data = `${action}:${userName}`;
    const expectedSignature = crypto
        .createHmac("sha256", SECRET)
        .update(data)
        .digest("hex");

    return signature === expectedSignature;
}
