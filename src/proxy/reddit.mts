import type { VercelRequest, VercelResponse } from "@vercel/node";
import { reddit } from "@riskybot/apis";

export default async function (request: VercelRequest, response: VercelResponse): Promise<void | VercelResponse> {
    const querys = request.query;

    response.setHeader("Access-Control-Allow-Origin", "*");

    if (querys["type"] === "post") {

        const post = await reddit.randomPostInSubreddit(querys["subreddit"].toString() || "memes");
        if (!post) return response.status(404).send("No post found");

        return response
            .json({
                author: post.author,
                title: post.title,
                url: post.url,
                subreddit: post.subreddit,
                subreddit_name_prefixed: post.subreddit_name_prefixed,
                over_18: post.over_18,
                ups: post.ups,
                downs: post.downs,
                num_comments: post.num_comments,
                created_utc: post.created_utc,
                permalink: post.permalink,
                selftext: post.selftext
            });
        //  .setHeader("Cors", "*")
    }
    if (request.url === "/api") {
        response.json({ hello: "world" });
        return;
    }

    return response.status(404).json("Not found");

}
