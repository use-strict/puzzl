import { sleep } from "@puzzle/core/lib/async/sleep";
import { Task } from "@puzzle/core/lib/async/Task";
import { CancellationToken, OperationCanceledError } from "@puzzle/core/lib/async/cancellation";

interface IBlogPost {
    author: string;
    description: string;
}

class AsyncTaskApp {
    async main() {
        // Use-case: we have an async action that we want to perform, but we want to control it's execution
        // A regular Promise is executed immediately when defined and we cannot restart or cancel it.

        // IMPORTANT: See asyncCancellation example for understanding cancellation tokens

        // We define an async task, but we don't start it immediately
        let fetchTask = new Task<IBlogPost>(async (token) => this.fetchBlogPostCancelable(token));

        await sleep(1000);
        // Start the task, but don't wait for the result. If we wanted to wait and grab the result, we could "await" it.
        fetchTask.start();
        // After half a second a cancellation occurs (this can be triggered from a different part of the application)
        setTimeout(() => fetchTask.cancel(), 500);

        // In some other part of the app, we can wait for the task to finish and grab the result
        try {
            let post = await fetchTask.wait();
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

        // We can restart the task, too
        fetchTask.reset();
        fetchTask.start();

    }

    async fetchBlogPostCancelable(token: CancellationToken) {
        // This could be an XHR that returns a JSON
        await sleep(1000 + Math.random() * 1000);
        // Assuming the request can't be cancelled, here is our first chance to bail out
        token.throwIfCancelled();
        let blogPost: IBlogPost = {
            author: "John",
            description: "A blog post",
        };
        return Promise.resolve(blogPost);
    }
}

new AsyncTaskApp().main();
