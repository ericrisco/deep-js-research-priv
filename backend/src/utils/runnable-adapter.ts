import { Runnable, RunnableConfig } from "@langchain/core/runnables";
import { ResearchState } from "../types/research.state";

class BrainRunnable extends Runnable<ResearchState, Partial<ResearchState>> {
    lc_namespace = ["research", "brain"];

    constructor(private brain: { invoke: (state: ResearchState) => Promise<Partial<ResearchState>> }) {
        super();
    }

    async invoke(input: ResearchState, options?: RunnableConfig): Promise<Partial<ResearchState>> {
        return this.brain.invoke(input);
    }

    [Symbol.iterator]() {
        return {
            next: () => ({ done: true, value: undefined })
        };
    }

    [key: string]: any;
}

export function makeRunnable(brain: { invoke: (state: ResearchState) => Promise<Partial<ResearchState>> }) {
    return new BrainRunnable(brain);
} 