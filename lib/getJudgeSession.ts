import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getJudgeSession() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw { error: "Unauthorized — please log in", status: 401 };
    }

    if (session.user.role !== "judge" && session.user.role !== "admin") {
        throw { error: "Forbidden — this route is for judges only", status: 403 };
    }

    if (!session.user.judge_id && session.user.role === "judge") {
        throw {
            error: "No judge profile linked to this account — contact admin",
            status: 403,
        };
    }

    return {
        session,
        judgeId: session.user.judge_id,
    };
}
