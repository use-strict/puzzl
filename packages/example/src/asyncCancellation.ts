import { sleep } from "@puzzle/core/lib/async/sleep";
import { CancellationTokenSource, CancellationToken, OperationCanceledError } from "@puzzle/core/lib/async/cancellation";

class AsyncCancellationApp {
    async main() {
        // Simple case: we fetch a blog post and print it to the console
        let post = await this.fetchBlogPost();
        console.log(post); // { author: ... }

        // But what if we have an external event like route change or cancel button being pressed before it's finished?

        let tokenSource = new CancellationTokenSource();
        // After half a second a cancellation occurs (this can be triggered from a different part of the application)
        setTimeout(() => tokenSource.cancel(), 500);

        try {
            let post = await this.fetchBlogPostCancelable(tokenSource.token);
            console.log(post);
        } catch (e) {
            if (e instanceof OperationCanceledError) {
                // Do something special when a cancel occurs (e.g. cleanup)
                console.log('Request was cancelled');
            } else {
                // Very important to rethrow any other kind of error
                throw e;
            }
        }

    }

    async fetchBlogPost() {
        // This could be an XHR that returns a JSON
        await sleep(1000 + Math.random() * 1000);
        return Promise.resolve({
            author: "John",
            description: "A blog post",
        });
    }

    async fetchBlogPostCancelable(token: CancellationToken) {
        // This could be an XHR that returns a JSON
        await sleep(1000 + Math.random() * 1000);
        // Assuming the request can't be cancelled, here is our first chance to bail out
        token.throwIfCancelled();
        return Promise.resolve({
            author: "John",
            description: "A blog post",
        });
    }
}

new AsyncCancellationApp().main();
